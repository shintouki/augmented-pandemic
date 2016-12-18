"""Admin settings"""

from django.contrib import admin

from .models import Location
from .models import Safezone
from .models import Announcement
from .models import Profile

admin.site.register(Location)
admin.site.register(Safezone)
admin.site.register(Announcement)
admin.site.register(Profile)