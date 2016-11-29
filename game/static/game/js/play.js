"use strict";

$(document).ready(function() {
    $("#checkLocation").click(function() {
        
    }); 
});

function initMap() {

    let map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.82, lng: -73.9493},
      zoom: 16
    }); 

    let infoWindow = new google.maps.InfoWindow({map: map});

    // Set center to current location and create infowindow for current location
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
            let pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            // Button for centering map
            $(document).ready(function() {
                $("#centerMap").click(function() {
                    map.setCenter(pos);
                }); 
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

    $.getJSON('/game/database/infection-rates/', function(data) {
        // Find infection rate

        let marker;
        let circle;

        for (let i=0; i<ccnyMarkers.length; i++) {
        	let position = new google.maps.LatLng(ccnyMarkers[i][1], ccnyMarkers[i][2]);
            let locationName = ccnyMarkers[i][0]
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

            // Create description boxes
            let infectionRate = data[locationName].fields.infection_rate;
            let infoWindowContent = 
            	'<div class="info_content">' +
    	        '<h4>' + locationName + '</h4>' +
    	        '<p>Infection rate: ' + infectionRate + '</p>' +
    			'</div>';

    	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(map, marker);
                }
            })(marker, i));
        }


        // Draw bayside Markers
        for (let i=0; i<baysideMarkers.length; i++) {
            let position = new google.maps.LatLng(baysideMarkers[i][1], baysideMarkers[i][2]);
            let locationName = baysideMarkers[i][0];
            let baysideRadius = 200;

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

            let infectionRate = data[locationName].fields.infection_rate;
            let infoWindowContent = 
                '<div class="info_content">' +
                '<h4>' + locationName + '</h4>' +
                '<p>Infection rate: ' + infectionRate + '</p>' +
                '</div>';

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(map, marker);
                }
            })(marker, i));
        }
    });

    // This is for getting coords on mouseclick, only used in development
    google.maps.event.addListener(map, 'click', function(event) {
	    console.log(event.latLng.lat());
	    console.log(event.latLng.lng());
	});

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
	                      'Error: The Geolocation service failed.' :
	                      'Error: Your browser doesn\'t support geolocation.');
}