from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_files, name='upload_files'),
    path('download/<str:folder_name>/', views.download_files, name='download_files'),
    path('receive', views.receive, name='receive'),
]