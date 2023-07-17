import os
import random
import string
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render, redirect


def Home(request):
    return render(request, 'index.html')

def receive(request):
    if request.method == 'POST':
        data = request.POST
        code = data.get('code')
        return redirect('download_files', code)

    return render(request, 'receive.html')

def upload_files(request):
    if request.method == 'POST' and request.FILES.getlist('files'):
        files = request.FILES.getlist('files')
        folder_name = generate_folder_name()
        folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
        os.makedirs(folder_path)

        for file in files:
            handle_uploaded_file(file, folder_path)
        
        return render(request, 'upload_success.html', {'folder_name': folder_name})
    
    return render(request, 'upload.html')

def handle_uploaded_file(file, folder_path):
    file_path = os.path.join(folder_path, file.name)
    with open(file_path, 'wb') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

def generate_folder_name():
    return ''.join(random.choices(string.ascii_lowercase, k=6))

def download_files(request, folder_name):
    folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
    files = os.listdir(folder_path)
    download_links = []

    for file in files:
        file_path = os.path.join(settings.MEDIA_URL, folder_name, file)
        download_links.append(file_path)
    
    return render(request, 'download.html', {'download_links': download_links})
