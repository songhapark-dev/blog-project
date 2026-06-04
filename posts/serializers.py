from rest_framework import serializers
from .models import Post, Category, Comment

# 1️⃣ Comment Serializer (댓글)
class CommentSerializer(serializers.ModelSerializer):
    """
    댓글 직렬화
    - id, author, content, created_at만 필요
    - post_id는 URL에서 받음
    """
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']  # 자동 생성되는 필드


# 2️⃣ Category Serializer (카테고리)
class CategorySerializer(serializers.ModelSerializer):
    """
    카테고리 직렬화
    """
    posts_count = serializers.SerializerMethodField()  # 커스텀 필드
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'posts_count']
    
    def get_posts_count(self, obj):
        """이 카테고리의 게시글 개수"""
        return obj.posts.count()


# 3️⃣ Post List Serializer (게시글 목록 - 간단한 정보)
class PostListSerializer(serializers.ModelSerializer):
    """
    게시글 목록용 (메인페이지, 검색 결과)
    - 제목, 카테고리, 생성일, 조회수만 표시
    - 본문은 표시 안 함 (많은 데이터 전송 방지)
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 
            'title', 
            'category', 
            'category_name',
            'created_at', 
            'view_count'
        ]
        read_only_fields = fields  # 모두 읽기 전용


# 4️⃣ Post Detail Serializer (게시글 상세 - 모든 정보)
class PostDetailSerializer(serializers.ModelSerializer):
    """
    게시글 상세용 (상세페이지)
    - 모든 정보 + 댓글 포함
    """
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'category',
            'category_name',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]