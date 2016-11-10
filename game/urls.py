from django.conf.urls import url

from . import views

app_name = 'game'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^register/$', views.register, name='register'),
    url(r'^users/$', views.users, name='users'),
    url(r'^user_detail/(?P<user_id>\w+)$', views.user_detail, name='user_detail'),
    url(r'^leaderboard/$', views.leaderboard, name='leaderboard'),
]