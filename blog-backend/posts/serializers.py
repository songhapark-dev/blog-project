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
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField() # 🎯 일반 필드 대신 커스텀 메서드로 주소 강제 추출
    
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

    # 메인 화면에 뿌려질 대표 썸네일 주소가 무조건 클라우디네리 절대 경로를 보게 만듭니다.
    def get_image(self, obj):
        if obj.image:
            # 주소가 이미 외부 URL 형태면 그대로 반환, 아니면 Cloudinary 스토리지 URL 강제 추출
            if obj.image.url.startswith('http'):
                return obj.image.url
            # 혹시 모를 로컬 상대경로 찌꺼기 방어
            return f"https://res.cloudinary.com/do2h3n6ex/image/upload/{obj.image.name}"
        return None


# 4. Post Detail Serializer (게시글 상세 보기 및 생성)
class PostDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField() # 🎯 상세 페이지 대문 이미지 주소 강제 추출
    
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

    # 상세 페이지 대문 썸네일 주소 정제 로직
    def get_image(self, obj):
        if obj.image:
            if obj.image.url.startswith('http'):
                return obj.image.url
            return f"https://res.cloudinary.com/do2h3n6ex/image/upload/{obj.image.name}"
        return None