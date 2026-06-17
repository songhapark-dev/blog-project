from django.core.management.base import BaseCommand
from posts.models import Post
import cloudinary.uploader
import os
from django.conf import settings


class Command(BaseCommand):
    help = "Migrate existing MEDIA images to Cloudinary"

    def handle(self, *args, **kwargs):
        posts = Post.objects.all()

        migrated = 0
        skipped = 0
        failed = 0

        for post in posts:
            if not post.image:
                self.stdout.write(f"SKIP (no image): Post {post.id}")
                skipped += 1
                continue

            image_path = post.image.path  # 로컬 파일 경로

            # 이미 URL이면 skip
            if str(post.image).startswith("http"):
                self.stdout.write(f"SKIP (already cloud): Post {post.id}")
                skipped += 1
                continue

            try:
                if not os.path.exists(image_path):
                    self.stdout.write(f"FAIL (file missing): Post {post.id}")
                    failed += 1
                    continue

                # Cloudinary 업로드
                result = cloudinary.uploader.upload(
                    image_path,
                    folder="blog_images"
                )

                cloudinary_url = result.get("secure_url")

                # DB 업데이트
                post.image = cloudinary_url
                post.save()

                self.stdout.write(f"MIGRATED Post {post.id}")
                migrated += 1

            except Exception as e:
                self.stdout.write(f"ERROR Post {post.id}: {str(e)}")
                failed += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nDONE: migrated={migrated}, skipped={skipped}, failed={failed}"
        ))