from rest_framework import viewsets, status
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


# 1. Category ViewSet (카테고리)
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    카테고리 조회만 가능 (생성, 수정, 삭제 불가)
    
    엔드포인트:
    - GET /api/categories/        → 모든 카테고리
    - GET /api/categories/{id}/   → 카테고리 상세
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'


# 2. Post ViewSet (게시글)
class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    게시글 조회만 가능 (생성, 수정, 삭제 불가)
    
    기본 엔드포인트:
    - GET /api/posts/              → 모든 게시글 (페이지네이션)
    - GET /api/posts/{id}/         → 게시글 상세
    
    커스텀 엔드포인트:
    - POST /api/posts/{id}/view/   → 조회수 증가
    - GET /api/posts/search/?q=...  → 검색
    """
    
    queryset = Post.objects.select_related('category').prefetch_related('comments')
    lookup_field = 'id'
    
    def get_serializer_class(self):
        """
        action에 따라 다른 serializer 사용
        - list, search: PostListSerializer (간단한 정보)
        - retrieve: PostDetailSerializer (모든 정보)
        """
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostListSerializer
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        """
        조회수 증가 엔드포인트
        
        요청: POST /api/posts/{id}/view/
        응답: { "view_count": 10 }
        """
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
            # 검색어 없으면 모든 게시글
            posts = Post.objects.all()
        else:
            # 제목이나 본문에 검색어 포함된 게시글
            posts = Post.objects.filter(
                Q(title__icontains=query) | Q(content__icontains=query)
            )
        
        # 페이지네이션 적용
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = PostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PostListSerializer(posts, many=True)
        return Response(serializer.data)


# 3. Comment ViewSet (댓글)
class CommentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    댓글 조회만 가능 (생성, 수정, 삭제 불가)
    
    엔드포인트:
    - GET /api/comments/              → 모든 댓글
    - GET /api/comments/{id}/         → 댓글 상세
    - GET /api/comments/?post={id}    → 특정 게시글의 댓글
    """
    serializer_class = CommentSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        """
        URL 파라미터로 필터링
        ?post={post_id}를 받으면 해당 게시글의 댓글만 반환
        """
        queryset = Comment.objects.all()
        post_id = self.request.query_params.get('post', None)
        
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)
        
        return queryset