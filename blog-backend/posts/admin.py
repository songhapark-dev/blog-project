from django.contrib import admin
from .models import Category, Post, Comment

# Category Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']  # 목록에 표시될 열
    prepopulated_fields = {'slug': ('name',)}  # name 입력하면 자동으로 slug 생성

# Post Admin
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'created_at', 'view_count']
    list_filter = ['category', 'created_at']  # 필터 기능
    search_fields = ['title', 'content']  # 검색 기능
    readonly_fields = ['view_count', 'created_at', 'updated_at']

# Comment Admin
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['author', 'content']