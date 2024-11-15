from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Hello BeyondMD - Backend - This confirms that the backend works. </h1>")
