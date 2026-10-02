# posts/serializers.py 전체 코드
from rest_framework import serializers
from .models import Post, Category, Comment

# 1. Comment Serializer (댓글)
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


# 2. Category Serializer (카테고리)
class CategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'posts_count']
    
    def get_posts_count(self, obj):
        return obj.posts.count()


# 3. Post List Serializer (게시글 목록 - 메인 화면 미리보기 썸네일 버그 박멸)
class PostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )
    image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 
            'title',      
            'content',    
            'image', 
            'category', 
            'category_name',
            'created_at', 
            'view_count'
        ]
        read_only_fields = fields

    
    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None


# 4. Post Detail Serializer (게시글 상세 보기 및 생성)
class PostDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',      
            'content',    
            'image', 
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
