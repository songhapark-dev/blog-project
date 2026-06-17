import os
import cloudinary.uploader
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.db.models import Q
from .models import Post, Category, Comment
from .serializers import (
    PostListSerializer,
    PostDetailSerializer,
    CategorySerializer,
    CommentSerializer
)
from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.core.management import call_command

# 1. Category ViewSet (카테고리)
class CategoryViewSet(viewsets.ModelViewSet):
    """
    엔드포인트:
    - GET /categories/        → 모든 카테고리 조회 (누구나)
    - POST /categories/       → 카테고리 생성 (오직 관리자만)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'

    # 권한 설정: 조회는 누구나, 생성/수정/삭제는 오직 관리자만!
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


# 2. Post ViewSet (게시글)
class PostViewSet(viewsets.ModelViewSet):
    """
    기본 엔드포인트:
    - GET /posts/               → 모든 게시글 조회 (누구나)
    - POST /posts/              → 홈페이지에서 직접 새 글 쓰기 (오직 관리자만! 🔑)
    - PUT /posts/{id}/          → 글 수정 (오직 관리자만!)
    - DELETE /posts/{id}/       → 글 삭제 (오직 관리자만!)
    """
    queryset = Post.objects.select_related('category').prefetch_related('comments')
    lookup_field = 'id'

    # 핵심 보안 필터: 일반 조회와 조회수 증가, 검색은 전 세계 누구나 통과!
    # 그 외의 POST(글쓰기), PUT(수정), DELETE(삭제)는 오직 관리자의 JWT 토큰이 있어야만 통과!
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'view', 'search']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    def get_serializer_class(self):
        """
        action에 따라 다른 serializer 사용
        - list, search: PostListSerializer (간단한 정보)
        - retrieve, create, update: PostDetailSerializer (모든 정보 및 생성/수정용)
        """
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return PostDetailSerializer
        return PostListSerializer
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        post = self.get_object()
        post.view_count += 1
        post.save()
        return Response({'view_count': post.view_count})
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        게시글 검색 엔드포인트 (단일 필드 검색 구조 유지)
        
        요청: GET /posts/search/?q=django
        응답: [{ Post 객체들... }]
        """
        query = request.query_params.get('q', '').strip()
        
        if not query:
            posts = Post.objects.all()
        else:
            posts = Post.objects.filter(
                Q(title__icontains=query) | Q(content__icontains=query)
            )
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = PostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PostListSerializer(posts, many=True)
        return Response(serializer.data)
    
    # [버그 박멸 박스] 본문 내 드래그 앤 드롭 이미지 전용 격리 통로 개설
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def upload_image(self, request):
        """
        본문에 드롭된 이미지를 게시글로 생성하지 않고, 
        Cloudinary에 직접 업로드한 뒤 무조건 HTTPS 절대 주소만 리턴합니다.
        """
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': '이미지 파일이 누락되었습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 장고의 내부 스토리지를 거치지 않고 Cloudinary API로 직접 업로드 
            response = cloudinary.uploader.upload(
                image_file,
                folder="blog_images"
            )
            
            # 클라우디네리가 발급한 보안 HTTPS 절대 경로 주소 추출
            image_url = response.get('secure_url')
            
            if not image_url:
                return Response({'error': 'Cloudinary로부터 URL을 받아오지 못했습니다.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            return Response({'image': image_url}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': f'이미지 업로드 중 실패: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 3. Comment ViewSet (댓글)
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    lookup_field = 'id'
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
        
    def get_queryset(self):
        queryset = Comment.objects.all()
        post_id = self.request.query_params.get('post', None)
        
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)
        
        return queryset
    

# 완전히 독립된 마이그레이션 트리거 뷰 (오타 수정 완료)
@staff_member_required  # 어드민 로그인한 관리자만 접속 가능하게 제한
def trigger_cloudinary_migration(request):
    try:
        # 우리가 만들어둔 커스텀 명령어를 코드로 실행하는 장고 내장 함수입니다.
        call_command('migrate_images_to_cloudinary')
        return HttpResponse("🎉 Cloudinary 마이그레이션 성공적으로 완료!")
    except Exception as e:
        return HttpResponse(f"❌ 마이그레이션 실패: {e}", status=500)