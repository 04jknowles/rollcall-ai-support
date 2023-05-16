from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    # replace 'yourapp' with the name of your app
    path('', include('chat.urls')),
]
