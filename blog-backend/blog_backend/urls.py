from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),  # 관리자 페이지 연결
    path("", include("posts.urls")),  # 루트 주소로 들어오면 posts 앱의 urls.py로 토스!
    #path('api/', include('posts.urls')),
] 
   
