from django.db import models
from django.utils.text import slugify

# 1️. Category 모델 (카테고리)
class Category(models.Model):
    """
    블로그 카테고리
    예: 오스트리아라이프, 독일어, 코딩로그
    """
    name = models.CharField(max_length=100, unique=True)  # "오스트리아라이프"
    slug = models.SlugField(unique=True, blank=True)      # "austria-life"
    
    def save(self, *args, **kwargs):
        """자동으로 slug 생성"""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "categories"  # Admin에서 "categorys" 아니라 "categories"로 표시


# 2️. Post 모델 (게시글)
class Post(models.Model):
    """
    블로그 게시글
    """
    title = models.CharField(max_length=255)              # 제목
    content = models.TextField()                          # 본문 (마크다운)
    category = models.ForeignKey(                         # 카테고리 (외래키)
        Category,
        on_delete=models.CASCADE,
        related_name='posts'  # Category 객체에서 .posts로 접근 가능
    )
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 일시 (자동)
    updated_at = models.DateTimeField(auto_now=True)      # 수정 일시 (자동)
    view_count = models.IntegerField(default=0)           # 조회수
    
    class Meta:
        ordering = ['-created_at']  # 최신순 정렬
    
    def __str__(self):
        return self.title


# 3️. Comment 모델 (댓글)
class Comment(models.Model):
    """
    게시글 댓글
    """
    post = models.ForeignKey(                             # 어느 게시글의 댓글인가
        Post,
        on_delete=models.CASCADE,
        related_name='comments'  # Post 객체에서 .comments로 접근 가능
    )
    author = models.CharField(max_length=100)             # 작성자 이름
    content = models.TextField()                          # 댓글 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 일시 (자동)
    
    class Meta:
        ordering = ['-created_at']  # 최신순 정렬
    
    def __str__(self):
        return f"Comment by {self.author} on {self.post.title}"
