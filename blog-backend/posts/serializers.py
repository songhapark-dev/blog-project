from rest_framework import serializers
from .models import Post, Category, Comment

# 1. Comment Serializer (댓글)
class CommentSerializer(serializers.ModelSerializer):
    """
    댓글 직렬화
    """
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


# 2. Category Serializer (카테고리)
class CategorySerializer(serializers.ModelSerializer):
    """
    카테고리 직렬화
    """
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'posts_count']
    
    def get_posts_count(self, obj):
        return obj.posts.count()


# 3. Post List Serializer (게시글 목록 - 간단한 정보)
class PostListSerializer(serializers.ModelSerializer):
    """
    게시글 목록용 (메인페이지, 검색 결과)
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 
            'title', 
            'content',      
            'image', # 👈 메인용엔 원래 잘 들어있었습니다!
            'category', 
            'category_name',
            'created_at', 
            'view_count'
        ]
        read_only_fields = fields


# 4. Post Detail Serializer (게시글 상세 - 모든 정보)
class PostDetailSerializer(serializers.ModelSerializer):
    """
    게시글 상세용 (상세페이지)
    """
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'image', # 1. 여기에 'image' 필드를 정식으로 추가합니다!
            'category',
            'category_name',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]
        read_only_fields = [
            'id',
            'image', # 2. 읽기 전용 목록에도 image를 추가해 줍니다.
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]