import itertools
from django.utils.text import slugify

def generate_unique_slug(model_class,slug_field):
        max_length = model_class._meta.get_field('slug').max_length
        slug       = original = slugify(slug_field)[: max_length]

        for i in itertools.count(1):
            if not model_class.objects.filter(slug=slug).exists():
                break

            #Create the unique slug
            slug = '{0}-{1}' .format(original[:max_length - len(str(i)) -1], i)
            
        return slug

