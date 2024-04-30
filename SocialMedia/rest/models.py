from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class BPostData(models.Model):

    def __str__(self):
        return self.name

    thread = models.IntegerField(null=True)
    name = models.CharField(max_length=200, default='Anonymous')
    date = models.DateTimeField()
    text = models.TextField(max_length=1000, null=True)
    image = models.ImageField(upload_to='images', blank=True)




@receiver(post_save, sender=BPostData)
def new_thread(sender, instance, **kwargs):
    if(instance.thread is None):
        instance.thread = instance.id
        instance.save()