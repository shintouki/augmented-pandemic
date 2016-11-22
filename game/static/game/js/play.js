"use strict";

function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
      // center: {lat: 40.82, lng: -73.9493},
      zoom: 17
    });
    // var marker = new google.maps.Marker({
    //   position: {lat: 40.82, lng: -73.9493},
    //   map: map
    // });
    let infoWindow = new google.maps.InfoWindow({map: map});

    // Current location
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			// console.log(position.coords.latitude);
			// console.log(position.coords.longitude);
			let pos = {
			  lat: position.coords.latitude,
			  lng: position.coords.longitude
		};

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
    	['Sophie Davis Building', 40.82097473120442, -73.9500904083252]
    ];

    let marker;

    for (let i=0; i<ccnyMarkers.length; i++) {
    	let position = new google.maps.LatLng(ccnyMarkers[i][1], ccnyMarkers[i][2]);
    	marker = new google.maps.Marker({
            position: position,
            map: map,
            title: ccnyMarkers[i][0]
        });
    }

    // This is for getting coords on mouseclick, only used in development
    google.maps.event.addListener(map, 'click', function(event) {
	    console.log(event.latLng.lat());
	    console.log(event.latLng.lng());
	});


    // var marker = new google.maps.Marker({
    //       position: {lat: 42.8216357, lng: -73.9476224},
    //       map: map
    //     });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
	                      'Error: The Geolocation service failed.' :
	                      'Error: Your browser doesn\'t support geolocation.');
}