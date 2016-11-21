function initMap() {
		    var map = new google.maps.Map(document.getElementById('map'), {
		      // center: {lat: 40.82, lng: -73.9493},
		      zoom: 15
		    });
	        // var marker = new google.maps.Marker({
	        //   position: {lat: 40.82, lng: -73.9493},
	        //   map: map
	        // });
	        var infoWindow = new google.maps.InfoWindow({map: map});

	        if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = {
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
    	}
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }