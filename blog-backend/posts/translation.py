from modeltranslation.translator import register, TranslationOptions
from .models import Post

@register(Post)
class PostTranslationOptions(TranslationOptions):
    # 3개 국어로 쪼개고 싶은 핵심 필드 지정
    fields = ('title', 'content')