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


# 3. Post List Serializer (게시글 목록 - 단일 언어 복구)
class PostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 
            'title',      # 다시 원래의 담백한 단일 필드로 복구!
            'content',    # 다시 원래의 담백한 단일 필드로 복구!
            'image', 
            'category', 
            'category_name',
            'created_at', 
            'view_count'
        ]
        read_only_fields = fields


# 4. Post Detail Serializer (게시글 상세 및 생성 - 단일 언어 복구)
class PostDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'title',      # 3개 국어 파편화 필드 삭제 후 단일화
            'content',    # 3개 국어 파편화 필드 삭제 후 단일화
            'image', 
            'category',
            'category_name',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]
        # 중요: 이미지 실시간 주입을 위해 'image' 필드는 쓰기 가능(read_only에서 제외) 상태 유지!
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]