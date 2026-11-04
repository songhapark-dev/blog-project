# blog-backend/posts/serializers.py
import re
from rest_framework import serializers
from .models import Post, Category, Comment

class CommentSerializer(serializers.ModelSerializer):
    # 스팸 방지용 숨은 입력칸(honeypot): 사람은 볼 수 없어서 비워두고, 봇은 채움
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)

    AUTHOR_MAX = 20
    CONTENT_MAX = 1000
    MAX_LINKS = 2

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at', 'website']
        read_only_fields = ['id', 'created_at']

    def validate_author(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('닉네임을 입력해 주세요.')
        if len(value) > self.AUTHOR_MAX:
            raise serializers.ValidationError(f'닉네임은 {self.AUTHOR_MAX}자 이하로 입력해 주세요.')
        return value

    def validate_content(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('댓글 내용을 입력해 주세요.')
        if len(value) > self.CONTENT_MAX:
            raise serializers.ValidationError(f'댓글은 {self.CONTENT_MAX}자 이하로 입력해 주세요.')
        if len(re.findall(r'https?://|www\.', value, re.IGNORECASE)) > self.MAX_LINKS:
            raise serializers.ValidationError('링크가 너무 많이 포함되어 있습니다.')
        return value

    def validate(self, attrs):
        if attrs.pop('website', ''):
            raise serializers.ValidationError('댓글을 등록할 수 없습니다.')
        return attrs


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