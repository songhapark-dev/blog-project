# Blog Backend

Django REST Framework를 사용한 블로그 백엔드

## 설치 및 실행

### 1. 가상환경 설정
```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 마이그레이션
```bash
python manage.py migrate
```

### 4. 관리자 계정 생성
```bash
python manage.py createsuperuser
```

### 5. 개발 서버 실행
```bash
python manage.py runserver
```

서버: http://localhost:8000/
Admin: http://localhost:8000/admin/

## 프로젝트 구조

- `blog_backend/` - Django 프로젝트 설정
- `posts/` - 게시글, 카테고리, 댓글 앱
  - `models.py` - Category, Post, Comment 모델
  - `admin.py` - Django Admin 설정
  - `views.py` - API 뷰 (작성 예정)
  - `serializers.py` - DRF Serializer (작성 예정)

## API 엔드포인트 (개발 중)

- `GET /api/posts/` - 모든 게시글
- `GET /api/posts/{id}/` - 게시글 상세
- `GET /api/posts/search/?q=query` - 검색
- `GET /api/categories/` - 카테고리
- `POST /api/posts/{id}/view/` - 조회수 증가
- `GET /api/comments/{post_id}/` - 댓글

## 기술 스택

- Python 3.11
- Django 4.2
- Django REST Framework 3.14
- PostgreSQL (나중에 Supabase)