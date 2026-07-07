import re
from typing import Optional


def generate_slug(text: str, max_length: int = 200) -> str:

    slug = text.lower()
    
    slug = re.sub(r'\s+', '-', slug)
    
    slug = re.sub(r'[^a-z0-9\-]', '', slug)
    
    slug = re.sub(r'-+', '-', slug)
    
    slug = slug.strip('-')

    slug = slug[:max_length]
    
    return slug


def generate_unique_slug(base_slug: str, existing_slugs: list, max_length: int = 200) -> str:
   
    slug = base_slug[:max_length]
    
    if slug not in existing_slugs:
        return slug
    
    counter = 1
    while True:
        new_slug = f"{base_slug}-{counter}"[:max_length]
        if new_slug not in existing_slugs:
            return new_slug
        counter += 1
