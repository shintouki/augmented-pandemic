from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views

from . import views

app_name = 'game'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^users/$', views.users, name='users'),
    url(r'^user_detail/(?P<user_id>\w+)$', views.user_detail, name='user_detail'),
    url(r'^leaderboard/$', views.leaderboard, name='leaderboard'),
    url(r'^play/$', views.play, name='play'),
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),
    url(r'^admin/', admin.site.urls),

]
