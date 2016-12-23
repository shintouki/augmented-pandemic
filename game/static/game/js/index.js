"use strict";

$(document).ready(function() {
    $.getJSON('/game/database/announcement_json/', function(data) {

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let currentAnnouncement = data[key]["fields"]["announcement_text"];
                let announcementDate = data[key]["fields"]["pub_date"];
                console.log(currentAnnouncement);
                console.log(announcementDate);
                let infoWindowOutput = "<p>" + currentAnnouncement + "</p>";
                $("#announcementWindow").append(infoWindowOutput);
                $("#announcementWindow").animate({scrollTop: $("#announcementWindow").prop("scrollHeight")}, 500);
            }
        }
        
    });
});