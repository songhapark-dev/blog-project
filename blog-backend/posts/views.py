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


# 1. Category ViewSet (카테고리) - ModelViewSet으로 변경하여 관리기능 뚫기
class CategoryViewSet(viewsets.ModelViewSet):
    """
    엔드포인트:
    - GET /posts/categories/        → 모든 카테고리 조회 (누구나)
    - POST /posts/categories/       → 카테고리 생성 (오직 관리자만)
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
        # 글을 새로 쓰거나(create) 수정할 때(update)도 본문 전체 내용이 필요하므로 Detail 버전을 사용합니다.
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
        게시글 검색 엔드포인트
        
        요청: GET /api/posts/search/?q=django
        응답: [{ Post 객체들... }]
        
        검색 범위:
        - 제목 (title)
        - 본문 (content)
        
        예시:
        http://localhost:8000/api/posts/search/?q=react
        http://localhost:8000/api/posts/search/?q=독일어
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
        


# 3. Comment ViewSet (댓글) - 🛠️ ModelViewSet으로 변경 (나중에 댓글 쓰기 기능을 위해 미리 선로 개설)
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    lookup_field = 'id'
    
    def get_permissions(self):
        # 댓글 조회는 누구나, 생성/수정/삭제는 오직 송하님(Admin)만 (추후 일반댓글 허용 시 수정 가능)
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
        
    def get_queryset(self):
        queryset = Comment.objects.all()
        post_id = self.request.query_params.get('post', None)
        
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)
        
        return queryset