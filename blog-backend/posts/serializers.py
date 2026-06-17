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
    # 목록에서도 이미지 필드가 장고 스토리지 설정을 순수하게 따르도록 보장
    image = serializers.ImageField(read_only=True)
    
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


# 4. Post Detail Serializer (게시글 상세 및 생성 - 단일 언어 복구)
class PostDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    
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
        # 중요: 이미지 실시간 주입을 위해 'image' 필드는 쓰기 가능(read_only에서 제외) 상태 유지!
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'view_count',
            'comments'
        ]

    # 🔥 [버그 박멸] 주소를 강제로 가공하던 의심스러운 to_representation 메서드를 완전히 삭제했습니다!
    # 이제 settings.py의 DEFAULT_FILE_STORAGE 설정에 따라 장고가 알아서 완벽한 Cloudinary 주소를 반환합니다.