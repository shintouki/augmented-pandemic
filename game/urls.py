"""Mapping URLs to views"""

from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views

from . import views

APP_NAME = 'game'

URL_PATTERNS= [
    url(r'^$', views.index, name='index'),
    url(r'^users/$', views.users, name='users'),
    url(r'^user_detail/(?P<user_id>\w+)$', views.user_detail, name='user_detail'),
    url(r'^leaderboard/$', views.leaderboard, name='leaderboard'),
    url(r'^play/$', views.play, name='play'),
    url(r'^database/infection-rates/$', views.infection_rates, name='infection_rates'),
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout'),
    url(r'^admin/', admin.site.urls),
    url(r'^(?P<location_name>.+)/win/$', views.win, name='win'),
    url(r'^(?P<location_name>.+)/lose/$', views.lose, name='lose'),
]
