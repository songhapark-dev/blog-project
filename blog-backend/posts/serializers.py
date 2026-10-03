# blog-backend/posts/serializers.py
from rest_framework import serializers
from .models import Post, Category, Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'posts_count']
    
    def get_posts_count(self, obj):
        return obj.posts.count()


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
        # URLField이므로 바로 반환
        return obj.image


# ✅ 수정: image를 CharField로 변경
class PostDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.CharField(required=False, allow_blank=True)  # ✅ CharField
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',      
            'content',    
            'image',  # ← 이제 URL 문자열 가능
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