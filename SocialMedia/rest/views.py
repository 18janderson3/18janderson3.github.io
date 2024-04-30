from django.http import HttpResponse
from django.shortcuts import render
from requests import Response
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.decorators import action
from datetime import datetime
from django.db.models import F

# Create your views here.
class TestViewSet(viewsets.ModelViewSet):
    queryset = BPostData.objects.all()
    serializer_class = BPostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = BPostData.objects.all()
    serializer_class = BPostSerializer


class GetThreadsView(viewsets.ModelViewSet):
    serializer_class = BPostSerializer
    
    def get_queryset(self):
        id = self.kwargs['id']
        return BPostData.objects.filter(thread=id)
    

class BThreadsViewSet(viewsets.ModelViewSet):
    queryset = BPostData.objects.filter(thread__exact=F('id'))
    serializer_class = BPostSerializer
    