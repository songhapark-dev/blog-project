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
            # 메인 대문에서도 언어별 제목/본문 조회가 가능하도록 필드 개방
            'title_ko', 'content_ko',
            'title_de', 'content_de',
            'title_en', 'content_en',     
            'image', 
            'category', 
            'category_name',
            'created_at', 
            'view_count'
        ]
        read_only_fields = fields


# 4. Post Detail Serializer (게시글 상세 및 생성 - 모든 정보)
class PostDetailSerializer(serializers.ModelSerializer):
    """
    게시글 상세 및 작성/수정용
    """
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            # 장고 modeltranslation이 바라보는 실제 3개 국어 물리 필드 전면 등록!
            'title_ko', 'content_ko',
            'title_de', 'content_de',
            'title_en', 'content_en',
            'image', 
            'category',
            'category_name',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]
        # 중요: 이미지 업로드(생성) 시점에 image 필드를 채워야 하므로 
        # read_only_fields 목록에서 'image'를 과감히 제거하여 쓰기 권한을 부여합니다!
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]