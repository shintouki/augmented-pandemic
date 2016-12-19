"""Mapping URLs to views"""

from django.conf.urls import url
from django.contrib import admin

from . import views

app_name = 'game'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^users/$', views.users, name='users'),
    # url(r'^user_search/$', views.user_search, name='user_search'),
    url(r'^user_detail/', views.user_detail, name='user_detail'),
    url(r'^leaderboard/$', views.leaderboard, name='leaderboard'),
    url(r'^play/$', views.play, name='play'),
    url(r'^database/location_json/$', views.location_json, name='location_json'),
    url(r'^database/safezone_json/$', views.safezone_json, name='safezone_json'),
    url(r'^database/announcement_json/$', views.announcement_json, name='announcement_json'),
    url(r'^database/profile_json/$', views.profile_json, name='profile_json'),
    url(r'^logout_successful/$', views.logout_successful, name='logout_successful'),
    url(r'^admin/', admin.site.urls),
    url(r'^(?P<location_name>.+)/win/$', views.win, name='win'),
    url(r'^(?P<location_name>.+)/lose/$', views.lose, name='lose'),
]
