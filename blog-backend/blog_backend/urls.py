import os
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),  # 관리자 페이지 연결
    path("", include("posts.urls")),  # 루트 주소로 들어오면 posts 앱의 urls.py로 토스!
    #path('api/', include('posts.urls')),
] 
   
# 개발 및 배포 환경에서 미디어 파일을 서빙할 수 있도록 설정 추가
if settings.DEBUG or os.environ.get('RENDER'):
    urlpatterns += static(settings.MEDIA_URL, document_domain=settings.MEDIA_ROOT)