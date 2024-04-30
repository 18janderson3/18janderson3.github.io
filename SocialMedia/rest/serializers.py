from rest_framework import serializers
from .models import BPostData
from datetime import datetime

class BPostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, required=False)
    date = serializers.DateTimeField(required=False, format="%Y-%m-%d %H:%M:%S", default=datetime.now())
    class Meta:
        model = BPostData
        fields = ['id', 'thread', 'name', 'date', 'text', 'image' ]

