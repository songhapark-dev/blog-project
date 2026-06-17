import os
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

    # 권한 설정: 조회는 누구나, 생성/수정/삭제는 오직 송하님(Admin)만!
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
    # 그 외의 POST(글쓰기), PUT(수정), DELETE(삭제)는 오직 송하님의 JWT 토큰이 있어야만 통과!
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
            # [롤백 완료] 복잡한 언어별 분기 없이 단일 title과 content 내부를 시원하게 통합 검색합니다.
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
        Cloudinary에만 안전하게 업로드한 뒤 영구 주소만 리턴합니다.
        """
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': '이미지 파일이 누락되었습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 임시 가짜 Post 객체를 메모리에 만들되, save()를 안 해서 DB 적재를 차단합니다.
        # 장고가 스토리지 파이프라인을 태워 Cloudinary 주소를 생성하게 만듭니다.
        from django.core.files.storage import default_storage
        filename = default_storage.save(f"blog_images/inline_{image_file.name}", image_file)
        image_url = default_storage.url(filename)
        
        # 렌더 환경에 맞게 깔끔한 절대 주소 반환 구조 보장
        if not image_url.startswith('http'):
            # 배포 환경 변수가 있다면 도메인을 붙여주고 없으면 상대경로 리턴
            render_url = os.environ.get('RENDER_EXTERNAL_URL', '')
            image_url = f"{render_url}{image_url}"

        return Response({'image': image_url}, status=status.HTTP_200_OK)    


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
    
    @staff_member_required  # 어드민 로그인한 관리자만 접속 가능하게 제한
    def trigger_cloudinary_migration(request):
        try:
            # 우리가 만들어둔 커스텀 명령어를 코드로 실행하는 장고 내장 함수입니다.
            call_command('migrate_images_to_cloudinary')
            return HttpResponse("🎉 Cloudinary 마이그레이션 성공적으로 완료!")
        except Exception as e:
            return HttpResponse(f"❌ 마이그레이션 실패: {e}", status=500)