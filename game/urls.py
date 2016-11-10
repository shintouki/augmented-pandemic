from django.conf.urls import url

from . import views

app_name = 'game'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^register/$', views.detail, name='register'),
    url(r'^results/$', views.results, name='users'),
    url(r'^user_detail/$', views.vote, name='user_detail'),
    url(r'^leaderboard/$', views.vote, name='leaderboard'),
]