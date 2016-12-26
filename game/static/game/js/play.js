"use strict";

$(document).ready(function() {
    $("#toggleMapButton").click(function() {
        $("#map").toggle("fast");
        let infoWindowOutput = "<p>Map toggled.</p>";
        $("#infoWindow").append(infoWindowOutput);
        $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
    });

    $("#helpButton").click(function() {
        let tutorial = "<p>How to play:</p>" +
        "Choose one of 3 actions: Attempt to quarantine the infected, " +
        "cure one of the infected, or rescue stranded passerby.<br>" +
        "<p>Your action can increase the infection rate or decrease " +
        "the infection rate depending on the outcome!</p><br>";
        $("#infoWindow").append(tutorial);
        $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
    });

    $("#clearInfoWindowButton").click(function() {
        $("#infoWindow").empty();
    });

});

let ccnyMarkers = [
      ['Shephard Hall', 40.820536297872856, -73.94823431968689],
      ['Engineering Building', 40.821591780613375, -73.94790709018707],
      ['NAC', 40.81967160141943, -73.95081460475922],
      ['Architecture Building', 40.81763769349211, -73.95049810409546],
      ['Marshak', 40.819265636754835, -73.9493715763092],
      ['Sophie Davis Building', 40.82097473120442, -73.9500904083252],
      ['The Towers(dorm)', 40.81466994350047, -73.95087361335754],
      ['CUNY Advanced Science Research Center', 40.815666651361695, -73.95009309053421]
];

let baysideMarkers = [
    ['Bayside Fields', 40.771913123811196, -73.7852954864502],
    ['Bayside Highschool', 40.77160436885864, -73.78072500228882],
    ['OLBS', 40.76622530236848, -73.78520965576172],
    ['Bay Terrace Shopping Center', 40.77950154452172, -73.77699136734009],
    ['Auburndale Station', 40.761609683748404, -73.78986597061157]
];

let safeZoneMarkers = [
    ['Safe Zone 1', 40.81652125045496, -73.95123839378357],
    ['Safe Zone 2', 40.82204441518121, -73.94990801811218],
    ['Safe Zone 3', 40.81866886418722, -73.95164608955383],
    ['Safe Zone 4', 40.81717487938587, -73.948073387146],
    ['Safe Zone 5', 40.82123454218155, -73.94617438316345],
    ['Safe Zone A', 40.76880925874281, -73.79186153411865],
    ['Safe Zone B', 40.77625179166222, -73.77057552337646],
    ['Safe Zone C', 40.77348937673562, -73.77469539642334],
    ['Safe Zone D', 40.77469185382073, -73.78598213195801],
    // ['Safe Zone Test', 40.771612494007364, -73.78711938858032]
];

function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.82, lng: -73.9493 },
        zoom: 16
    });

    let infoWindow = new google.maps.InfoWindow({map: map});

    // Set center to current location and create infowindow for current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);

            $("#centerMapButton").click(function() {
                map.setCenter(pos);
                let infoWindowOutput = "<p>Map centered.</p>";
                $("#infoWindow").append(infoWindowOutput);
                $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
            });

            let locationName = 'Current Location';

            let marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: locationName
            });

            // Create circle around markers
            let circle = new google.maps.Circle({
                map: map,
                radius: 20,
                fillColor: '#0000CD',
                strokeOpacity: '0'
            });
            circle.bindTo('center', marker, 'position');

            // Create description boxes
            let infoWindowContent =
                '<div class="info_content">' +
                '<h4>' + locationName + '</h4>' +
                '</div>';

            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(map, marker);
                }
            })(marker));

        infoWindow.setPosition(pos);
        infoWindow.setContent('You are here.');
        map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    let marker;
    let circle;
    $.getJSON('/game/database/location_json/', function(locationData) {
        $.getJSON('/game/database/safezone_json/', function(safezoneData) {
            // Find infection rate
            navigator.geolocation.getCurrentPosition(function(position) {
                let pos = new google.maps.LatLng(position.coords.latitude,
                                                 position.coords.longitude);
                let marker;
                let circle;
                let markersAndCirclesList = [];

                // Draw ccny markers
                for (let i=0; i<ccnyMarkers.length; i++) {
                    let position = new google.maps.LatLng(ccnyMarkers[i][1],
                                                          ccnyMarkers[i][2]);
                    let locationName = ccnyMarkers[i][0];
                    let ccnyRadius = 80;
                    // Create markers
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: locationName
                    });

                    // Create circle around markers
                    circle = new google.maps.Circle({
                        map: map,
                        radius: ccnyRadius,
                        fillColor: '#AA1100',
                        strokeOpacity: '0'
                    });
                    circle.bindTo('center', marker, 'position');

                    let matchesWon = locationData[locationName].fields.matches_won;
                    let matchesLost = locationData[locationName].fields.matches_lost;
                    let totalMatches = matchesWon + matchesLost;
                    let infectionRate = Math.round(matchesLost / totalMatches * 100 * 100) / 100;
                    let zoneText = locationData[locationName].fields.zone_text;

                    // Record marker and circle details to use later with check location button
                    let markerDetails = {'location': locationName,
                                         'zone': zoneText,
                                         'marker': marker,
                                         'circle': circle,
                                         'infection_rate': infectionRate
                                        };
                    markersAndCirclesList.push(markerDetails);

                    // Create description boxes
                    let infoWindowContent =
                      '<div class="info_content">' +
                      '<h4>' + locationName + '</h4>' +
                      '<p>Infection rate: ' + infectionRate + '%</p>' +
                        '<p>Matches Won: ' + matchesWon + '</p>' +
                        '<p>Matches Lost: ' + matchesLost + '</p>' +'</div>';

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infoWindow.setContent(infoWindowContent);
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));
                }

                // Draw bayside Markers
                for (let i=0; i<baysideMarkers.length; i++) {
                    let position = new google.maps.LatLng(baysideMarkers[i][1],
                                                          baysideMarkers[i][2]);
                    let locationName = baysideMarkers[i][0];
                    let baysideRadius = 200;
                    // let baysideRadius = 100;

                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: locationName
                    });

                    circle = new google.maps.Circle({
                        map: map,
                        radius: baysideRadius,
                        fillColor: '#AA1100',
                        strokeOpacity: '0'
                    });
                    circle.bindTo('center', marker, 'position');

                    let matchesWon = locationData[locationName].fields.matches_won;
                    let matchesLost = locationData[locationName].fields.matches_lost;
                    let totalMatches = matchesWon + matchesLost;
                    let infectionRate = Math.round(matchesLost / totalMatches * 100 * 100) / 100;
                    let zoneText = locationData[locationName].fields.zone_text;

                    // Record marker and circle details to use later with check location button
                    let markerDetails = {'location': locationName,
                                         'zone': zoneText,
                                         'marker': marker,
                                         'circle': circle,
                                         'infection_rate': infectionRate
                                        };
                    markersAndCirclesList.push(markerDetails);

                    let infoWindowContent =
                        '<div class="info_content">' +
                        '<h4>' + locationName + '</h4>' +
                        '<p>Infection rate: ' + infectionRate + '%</p>' +
                        '<p>Matches Won: ' + matchesWon + '</p>' +
                        '<p>Matches Lost: ' + matchesLost + '</p>' +
                        '</div>';

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infoWindow.setContent(infoWindowContent);
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));
                }

                // Draw Safe Zone Markers
                let safezoneMarkerList = [];
                for (let i=0; i<safeZoneMarkers.length; i++) {
                    let position = new google.maps.LatLng(safeZoneMarkers[i][1], safeZoneMarkers[i][2]);
                    let locationName = safeZoneMarkers[i][0];
                    let safeZoneRadius = 50;

                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: locationName
                    });

                    circle = new google.maps.Circle({
                        map: map,
                        radius: safeZoneRadius,
                        fillColor: '#008000',
                        strokeOpacity: '0'
                    });
                    circle.bindTo('center', marker, 'position');

                    let markerDetails = {'location': locationName, 'marker': marker, 'circle': circle};
                    safezoneMarkerList.push(markerDetails);

                    let antidotesInStock = safezoneData[locationName].fields.antidotes_in_stock;
                    let antidotesGivenOut = safezoneData[locationName].fields.antidotes_given_out;

                    markerDetails = {'location': locationName,
                                         'zone': zoneText,
                                         'marker': marker,
                                         'circle': circle,
                                         'antidotes_in_stock': antidotesInStock,
                                         'antidotes_given_out': antidotesGivenOut
                                        };

                    markersAndCirclesList.push(markerDetails);

                    let infoWindowContent =
                        '<div class="info_content">' +
                        '<h4>' + locationName + '</h4>' +
                        '<p>Antidotes In Stock: ' + antidotesInStock + '</p>' +
                        '<p>Antidotes Given Out: ' + antidotesGivenOut + '</p>' +
                        '</div>';

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infoWindow.setContent(infoWindowContent);
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));
                }

                // Check location on page load
                $(document).ready(function() {
                    let locatedInsideACircle = false;
                    let currentLocation;
                    let typeLocation = "";

                    // Find current subzone (location)
                    for (let i=0; i<markersAndCirclesList.length; i++) {
                        let location = markersAndCirclesList[i]['location'];
                        let circle = markersAndCirclesList[i]['circle'];
                        let bounds = circle.getBounds();

                        if (bounds.contains(pos)) {
                            currentLocation = location;
                            locatedInsideACircle = true;
                            if ("infection_rate" in markersAndCirclesList[i]) {
                                typeLocation = "infectedZone";
                            }
                            else {
                                typeLocation = "safeZone";
                            }
                        }
                    }

                    let currentZone;
                    if (typeLocation == "infectedZone") {
                        currentZone = locationData[currentLocation].fields.zone_text;
                    }
                    else if (typeLocation == "safeZone") {
                        currentZone = safezoneData[currentLocation].fields.zone_text;
                    }
                    let infectionSum = 0;
                    let numSubzones = 0;

                    for (let i=0; i<markersAndCirclesList.length; i++) {
                        let zone = markersAndCirclesList[i]['zone'];
                        let infectionIndiv = markersAndCirclesList[i]['infection_rate'];
                        if (currentZone == zone) {
                            infectionSum += infectionIndiv;
                            numSubzones++;
                        }
                    }

                    let zoneInfection = Math.round(infectionSum / numSubzones * 100) / 100 + "%";
                    $("#global").replaceWith(zoneInfection);

                    if (currentZone == "ccny") {
                        currentZone = "City College of New York";
                    }
                    else if (currentZone == "bayside") {
                        currentZone = "Bayside";
                    }
                    $("#zoneText").replaceWith(currentZone);
                    if (locatedInsideACircle) {
                        let matchesWon;
                        let matchesLost;
                        let locationOutput;
                        let localRate;
                        if (typeLocation == "infectedZone") {
                            matchesWon = locationData[currentLocation].fields.matches_won;
                            matchesLost = locationData[currentLocation].fields.matches_lost;
                            let totalMatches = matchesWon + matchesLost;
                            let infectionRate = Math.round(matchesLost / totalMatches * 100 * 100) / 100;
                            localRate = infectionRate + "%";
                        }
                        else if (typeLocation == "safeZone") {
                            matchesWon = safezoneData[currentLocation].fields.matches_won;
                            matchesLost = safezoneData[currentLocation].fields.matches_lost;
                            localRate = "You are in a safe zone";
                        }
                        locationOutput = currentLocation;
                        $("#subzoneText").replaceWith(locationOutput);
                        $("#local").replaceWith(localRate);
                    }
                    else {
                        let resultOutput = "You are not inside an infected area. Please move inside a red circle and try again.";
                        $("#zoneText").replaceWith(resultOutput);
                    }
                });

                // Check to see if user is inside a circle
                $("#checkLocationButton").click(function() {
                    let locatedInsideACircle = false;
                    let currentLocation;
                    for (let i=0; i<markersAndCirclesList.length; i++) {
                        let location = markersAndCirclesList[i]['location'];
                        let marker = markersAndCirclesList[i]['marker'];
                        let circle = markersAndCirclesList[i]['circle'];
                        let bounds = circle.getBounds();
                        if (bounds.contains(pos)) {
                            currentLocation = location;
                            locatedInsideACircle = true;
                        }
                    }

                    if (locatedInsideACircle) {
                        let locationOutput = "<p>You are at " + currentLocation + ".</p>";
                        $("#infoWindow").append(locationOutput);
                        $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                    }
                    else {
                        let resultOutput = "<p>You are not inside an infected area. Please move inside a red circle and try again.</p>";
                        $("#infoWindow").append(resultOutput);
                        $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                    }
                });

                $(".RPSButton").click(function() {
                    let locatedInsideACircle = false;
                    let currentLocation;
                    let typeLocation = "";
                    for (let i=0; i<markersAndCirclesList.length; i++) {
                        let location = markersAndCirclesList[i]['location'];
                        let marker = markersAndCirclesList[i]['marker'];
                        let circle = markersAndCirclesList[i]['circle'];
                        let bounds = circle.getBounds();
                        if (bounds.contains(pos)) {
                            currentLocation = location;
                            locatedInsideACircle = true;
                            if ("infection_rate" in markersAndCirclesList[i]) {
                                typeLocation = "infectedZone";
                            }
                            else {
                                typeLocation = "safeZone";
                            }
                        }
                    }

                    if (locatedInsideACircle) {
                        if (typeLocation == "infectedZone") {
                            let locationOutput = "<p>Fighting infection at " + currentLocation + "</p>";
                            $("#infoWindow").append(locationOutput);
                            $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);

                            let choices = {'rockButton': 'quarantine', 'paperButton': 'cure', 'scissorsButton': 'rescue'};
                            let choice = choices[this.id];

                            playGame(choice);

                            let randomChance = Math.random();
                            if (randomChance<.5) {
                                let event_1 = Math.random();
                                let eventOutput;
                                if (event_1<=.25) {
                                    eventOutput = "<p>A new shipment of antidotes arrived! Infection rate decreased.</p>"
                                }
                                else if (event_1>.25 && event_1<=.5){
                                    eventOutput = "<p>You receive a call informing you a nearby safe haven was overtaken. Infection rate increased.</p>"
                                }
                                $("#infoWindow").append(eventOutput);
                                $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                            }

                            // Fix crsf issue (403 error)
                            function getCookie(name) {
                                var cookieValue = null;
                                if (document.cookie && document.cookie !== '') {
                                    var cookies = document.cookie.split(';');
                                    for (var i = 0; i < cookies.length; i++) {
                                        var cookie = jQuery.trim(cookies[i]);
                                        // Does this cookie string begin with the name we want?
                                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                            break;
                                        }
                                    }
                                }
                                return cookieValue;
                            }

                            var csrftoken = getCookie('csrftoken');

                            function csrfSafeMethod(method) {
                                    // these HTTP methods do not require CSRF protection
                                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                            }

                            $.ajaxSetup({
                                beforeSend: function(xhr, settings) {
                                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                                    }
                                }
                            });

                            let minigamePlayedURL = "/game/" + currentLocation + "/";
                            if (outcome == 1) {
                                // Player won minigame
                                minigamePlayedURL += "win/";
                                $.ajax({
                                    type: "POST",
                                    url: minigamePlayedURL,
                                    success: function() {

                                    }
                                });
                            }
                            else if (outcome == -1) {
                                // Player lost minigame
                                minigamePlayedURL += "lose/";
                                $.ajax({
                                    type: "POST",
                                    url: minigamePlayedURL,
                                    success: function() {

                                    }
                                });
                            }
                        }
                        else if (typeLocation == "safeZone") {
                            let resultOutput = "<p>You are in a safezone. There is no infection to fight here.</p>";
                            $("#infoWindow").append(resultOutput);
                            $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                        }
                    }
                    else {
                        let resultOutput = "<p>You are not inside an infected area. Please move inside a red circle and try again.</p>";
                        $("#infoWindow").append(resultOutput);
                        $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                    }
                });
                
                // Use antidote button click
                $("#useAntidoteButton").click(function() {
                    let locatedInsideACircle = false;
                    let currentLocation;
                    let typeLocation = "";
                    for (let i=0; i<markersAndCirclesList.length; i++) {
                        let location = markersAndCirclesList[i]['location'];
                        let marker = markersAndCirclesList[i]['marker'];
                        let circle = markersAndCirclesList[i]['circle'];
                        let bounds = circle.getBounds();
                        if (bounds.contains(pos)) {
                            currentLocation = location;
                            locatedInsideACircle = true;
                            if ("infection_rate" in markersAndCirclesList[i]) {
                                typeLocation = "infectedZone";
                            }
                            else {
                                typeLocation = "safeZone";
                            }
                        }
                    }

                    if (locatedInsideACircle) {
                        if (typeLocation == "infectedZone") {

                            $.getJSON('/game/database/current_profile_json/', function(currentUserData) {
                                let numAntidotesCurrentUser = currentUserData['num_antidotes'];
                                if (numAntidotesCurrentUser > 0) {
                                    let numPlayerAntidotesText = $("#numAntidotesText").text();
                                    let numPlayerAntidotes = numPlayerAntidotesText.match(/\d+/)[0];
                                    numPlayerAntidotes--;

                                    // Update number of antidotes text on screen
                                    let newPlayerAntidoteText = "Number of antidotes: " + numPlayerAntidotes;
                                    $("#numAntidotesText").text(newPlayerAntidoteText);

                                    // Fix crsf issue (403 error)
                                    function getCookie(name) {
                                        var cookieValue = null;
                                        if (document.cookie && document.cookie !== '') {
                                            var cookies = document.cookie.split(';');
                                            for (var i = 0; i < cookies.length; i++) {
                                                var cookie = jQuery.trim(cookies[i]);
                                                // Does this cookie string begin with the name we want?
                                                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                                    break;
                                                }
                                            }
                                        }
                                        return cookieValue;
                                    }

                                    var csrftoken = getCookie('csrftoken');

                                    function csrfSafeMethod(method) {
                                            // these HTTP methods do not require CSRF protection
                                            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                                    }

                                    $.ajaxSetup({
                                        beforeSend: function(xhr, settings) {
                                            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                                                xhr.setRequestHeader("X-CSRFToken", csrftoken);
                                            }
                                        }
                                    });

                                    // Update number of antidotes in current player and safezone models
                                    let antidoteUsedURL = "/game/" + currentLocation + "/antidoteUsed/";
                               
                                    $.ajax({
                                        type: "POST",
                                        url: antidoteUsedURL,
                                        success: function() {

                                        }
                                    });

                                    infoWindowOutput = "<p>Antidote used.</p>" +
                                                   "<p>You have " + numPlayerAntidotes + " antidotes now.</p>";
                                }
                                else {
                                    infoWindowOutput = "<p>You have no more antidotes. Please go to a safezone to pick up more antidotes.</p>";
                                }
                                $("#infoWindow").append(infoWindowOutput);
                                $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                            });


                            let infoWindowOutput = "<p>Antidote used.</p>";
                            $("#infoWindow").append(infoWindowOutput);
                            $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                        }
                        else if (typeLocation == "safeZone") {
                            let resultOutput = "<p>You are in a safezone. You cannot use an antidote in a safezone.</p>";
                            $("#infoWindow").append(resultOutput);
                            $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                        }
                    }
                    else {
                        let resultOutput = "<p>You are not inside an infected area. You cannot use an antidote here.</p>";
                        $("#infoWindow").append(resultOutput);
                        $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                    }
                });

                // Get antidote button click
                $("#getAntidoteButton").click(function() {
                    let locatedInsideACircle = false;
                    let currentLocation;
                    let typeLocation = "";
                    let antidotesInStock = 0;
                    for (let i=0; i<markersAndCirclesList.length; i++) {
                        let location = markersAndCirclesList[i]['location'];
                        let marker = markersAndCirclesList[i]['marker'];
                        let circle = markersAndCirclesList[i]['circle'];
                        let bounds = circle.getBounds();
                        if (bounds.contains(pos)) {
                            currentLocation = location;
                            locatedInsideACircle = true;
                            antidotesInStock = markersAndCirclesList[i]['antidotes_in_stock'];
                            if ("infection_rate" in markersAndCirclesList[i]) {
                                typeLocation = "infectedZone";
                            }
                            else {
                                typeLocation = "safeZone";
                            }
                        }
                    }

                    if (locatedInsideACircle) {
                        if (typeLocation == "safeZone") {
                            let infoWindowOutput = "";
                            if (antidotesInStock > 0) {
                                let numPlayerAntidotesText = $("#numAntidotesText").text();
                                let numPlayerAntidotes = numPlayerAntidotesText.match(/\d+/)[0];
                                numPlayerAntidotes++;

                                // Update number of antidotes text on screen
                                let newPlayerAntidoteText = "Number of antidotes: " + numPlayerAntidotes;
                                $("#numAntidotesText").text(newPlayerAntidoteText);

                                // Fix crsf issue (403 error)
                                function getCookie(name) {
                                    var cookieValue = null;
                                    if (document.cookie && document.cookie !== '') {
                                        var cookies = document.cookie.split(';');
                                        for (var i = 0; i < cookies.length; i++) {
                                            var cookie = jQuery.trim(cookies[i]);
                                            // Does this cookie string begin with the name we want?
                                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                                break;
                                            }
                                        }
                                    }
                                    return cookieValue;
                                }

                                var csrftoken = getCookie('csrftoken');

                                function csrfSafeMethod(method) {
                                        // these HTTP methods do not require CSRF protection
                                        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                                }

                                $.ajaxSetup({
                                    beforeSend: function(xhr, settings) {
                                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                                        }
                                    }
                                });

                                // Update number of antidotes in current player and safezone models
                                let antidoteReceivedURL = "/game/" + currentLocation + "/antidoteReceived/";
                           
                                $.ajax({
                                    type: "POST",
                                    url: antidoteReceivedURL,
                                    success: function() {

                                    }
                                });

                                infoWindowOutput = "<p>Antidote received.</p>" +
                                                   "<p>You have " + numPlayerAntidotes + " antidotes now.</p>";
                            }
                            else {
                                infoWindowOutput = "<p>This safezone is out of antidotes at the moment. Please check again at a later time.</p>";
                            }
                            $("#infoWindow").append(infoWindowOutput);
                            $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                        }
                        else if (typeLocation == "infectedZone") {
                            let resultOutput = "<p>You are in an infected zone. Please head over to a safe zone to pick up antidotes.</p>";
                            $("#infoWindow").append(resultOutput);
                            $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                        }
                    }
                    else {
                        let resultOutput = "You are not in any zone. Please head over to a safe zone to pick up antidotes.</p>";
                        $("#infoWindow").append(resultOutput);
                        $("#infoWindow").animate({scrollTop: $("#infoWindow").prop("scrollHeight")}, 500);
                    }
                });

            });
        });
    });

    // This is for getting coords on mouseclick, only used in development
    google.maps.event.addListener(map, 'click', function(event) {
      console.log(event.latLng.lat());
      console.log(event.latLng.lng());
  });

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    if (infoWindow) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    }
    return "Geolocation failed.";
}
