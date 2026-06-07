import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path("admin/", admin.site.urls),  # 관리자 페이지 연결
    path("", include("posts.urls")),  # 루트 주소로 들어오면 posts 앱의 urls.py로 토스!
    #path('api/', include('posts.urls')),
] 
   
# 개발 및 배포 환경에서 미디어 파일을 서빙할 수 있도록 설정 추가
if settings.DEBUG:
    from django.conf.urls.static import static
    # 오타였던 document_domain을 정석 문법인 document_root로 수정!
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # 🎯 Render 실전 배포 환경에서 장고가 강제로 미디어 디렉토리를 외부에 열어주도록 선로 개설
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
    