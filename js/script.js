var APIKey = 'AIzaSyDy_QYL6jpteqajvI1N7xNTiNRTtgVm0PE';

window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);

//normalize navigator.getUserMedia
navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

// var geocoder;
// var map;
// var zipcode;
// var infowindow;
// var city;

// var initializeMap = function(zipcode) {
    
// 	geocoder = new google.maps.Geocoder();
// 	var latlng = new google.maps.LatLng(zipcode);
// 	var mapOptions = {
// 		zoom: 12,
// 		center: latlng
// 	}

// 	//renders new map into mapCanvas div
// 	map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

// 	// //calls codeAddress function
// 	codeAddress();	

// 	var getCity = function(response) {
// 		$.ajax({
// 			url: 'http://ZiptasticAPI.com/' + zipcode,
// 			dataType : 'jsonp',
// 			success : function(response){
// 				console.log(response);
// 				city = response.city;
// 			}
// 		});
// 	};




// 	var request = {
//     			location: city,
//     			radius: 500,
//     			types: ['lodging']
//   				};

//   			infowindow = new google.maps.InfoWindow();

//   			var service = new google.maps.places.PlacesService(map);

//   			service.nearbySearch(request, callback);	

// };


// var callback = function(results, status) {
//   if (status == google.maps.places.PlacesServiceStatus.OK) {
//     for (var i = 0; i < results.length; i++) {
//       createMarker(results[i]);
//     }
//   }
// };

// var codeAddress = function() {
// 	// var zipcode = document.getElementById('zipcode').value;
	
// 	geocoder.geocode( { 'address': zipcode}, function(results, status){
// 		map.setCenter(results[0].geometry.location);
// 		if (status == google.maps.GeocoderStatus.OK) {
// 			var marker = new google.maps.Marker({
// 				map: map,
// 				position: results[0].geometry.location
// 			});	

// 		} else {
// 			alert('Geocode unsuccessful because '+ status);
// 		}
// 	});
// };

// var map;
// var infoWindow;
// var service;

// var initializeMap = function(zipcode) {
//   map = new google.maps.Map(document.getElementById('map-canvas'), {
//     center: new google.maps.LatLng(zipcode),
//     zoom: 6,
//     styles: [
//       {
//         stylers: [
//           { visibility: 'simplified' }
//         ]
//       },
//       {
//         elementType: 'labels',
//         stylers: [
//           { visibility: 'off' }
//         ]
//       }
//     ]
//   });

//   infoWindow = new google.maps.InfoWindow();
//   service = new google.maps.places.PlacesService(map);

//   google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
// }

// function performSearch() {
//   var request = {
//     bounds: map.getBounds(),
//     keyword: 'crowded'
//   };
//   service.radarSearch(request, callback);
// }

// function callback(results, status) {
//   if (status != google.maps.places.PlacesServiceStatus.OK) {
//     alert(status);
//     return;
//   }
//   for (var i = 0, result; result = results[i]; i++) {
//     createMarker(result);
//   }
// }

// function createMarker(place) {
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location,
//     icon: {
//       // Star
//       path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
//       fillColor: '#ffff00',
//       fillOpacity: 1,
//       scale: 1/4,
//       strokeColor: '#bd8d2c',
//       strokeWeight: 1
//     }
//   });

//   google.maps.event.addListener(marker, 'click', function() {
//     service.getDetails(place, function(result, status) {
//       if (status != google.maps.places.PlacesServiceStatus.OK) {
//         alert(status);
//         return;
//       }
//       infoWindow.setContent(result.name);
//       infoWindow.open(map, marker);
//     });
//   });
// }

var map;
var infowindow;

var initializeMap = function(city) {

  var resultData;
  var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': city }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            return resultData = results[0].geometry.location.lat() + "," +results[0].geometry.location.lng();
          } else {
            alert("Something got wrong " + status);
          }
        });

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: resultData,
    zoom: 15
  });

  var request = {
    location: resultData,
    radius: 500,
    types: ['store']
  };
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

//what happens when you input your city and click the feed me button
var feedMe = function(city) {
	//hides all other divs from page
	$('#congratsWrapper, #transparentOverlayTwo, #videoContainer, #righthandContainer').addClass('hideBox');

	//creates map div
	var mapDiv = $('<div/>');
	var closeMap = $('<div/>');
	//gives map div an id of #map-canvas
	mapDiv.attr('id', 'mapCanvas');

	closeMap.attr('id', 'mapX').html('<p>X</p>');
	$('#mapHere').append(closeMap);
	$('#mapHere').append(mapDiv);



	//calls initialize map function when the mapDiv has loaded:
	google.maps.event.addDomListener(mapDiv, 'append', initializeMap(city));
	
	console.log('feedMe done');

	$(closeMap).on('click', function(){
		$('#mapHere').addClass('hideBox');
		$('#videoContainer').removeClass('hideBox').removeClass('videoLeft').addClass('centerVideo');
	});
};

//loads video to canvas and detects faces
var loadVideo = function() {
	if (typeof navigator.getUserMedia === "function") {

	    (function() {

	        var video = document.createElement('video'),
	            // content = document.querySelector('.transforming-content'),
	            canvas = document.querySelector('canvas'),
	            context = canvas.getContext('2d'),
	            mask = new Image(),
	            originalFace,
	            gUMOptions = {video: true, toString: function(){ return "video"; }};

	        video.setAttribute('autoplay', true);
	        mask.src = "images/teeth.png";
	        context.fillStyle = "rgba(0, 0, 200, 0.5)";
	        navigator.getUserMedia(gUMOptions, handleWebcamStream, errorStartingStream);

	        function handleWebcamStream(stream) {

	            video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
	            processWebcamVideo();
	        }

	        function errorStartingStream() {
	            alert('Uh-oh, the webcam didn\'t start. Do you have a webcam? Did you give it permission? Refresh to try again.');
	        }

	        function processWebcamVideo() {

	            var startTime = +new Date(),
	                changed = false,
	                scaleFactor = 1,
	                faces;

	            context.drawImage(video, 0, 0, canvas.width, canvas.height);
	            faces = detectFaces();

	            drawMasks(faces);
	            
	            // And repeat.
	            setTimeout(processWebcamVideo, 50);
	        }

	        function detectFaces() {

	            return ccv.detect_objects({canvas : (ccv.pre(canvas)), cascade: cascade, interval: 2, min_neighbors: 1});
	        }


	        function drawMasks(faces) {
	            if(!faces) {
	                return false;
	            }

	            for (var i = 0; i < faces.length; i++) {
	                var face = faces[i];
	                context.drawImage(mask, face.x * 0.9, face.y * 0.9, face.width * 1.3, face.height * 1.3);
	            }
	        }

	    })();
	}
};

//after a delay, loads congratulations popup on screen and calls feedMe() function
//if feedMe button is clicked
var congratulations = function() {
	$('#congrats, #transparentOverlayTwo').delay(5000).fadeIn();
	console.log('congratulations');

	var feed = document.getElementById('feedButton');
	
	$(feed).on('click', function(){
		city = document.getElementById('zipcode').value;
		
		feedMe(city);
	});
};


//hides the first popup and calls loadVideo and congratulations functions
var hidePopup = function() {
	$('#popupBox, #transparentOverlay').addClass('hideBox');
	
	vampButton = document.getElementById('vamp');
	$(vampButton).on('click', function(){
		console.log('click');
		loadVideo();
		congratulations();
	});
}


var init = function() {
	console.log('ready!!');

	//terms and conditions checkbox
	var checkbox = document.getElementById('checkbox');
	//"turn me" button
	var button = document.getElementById('button');

	var name = document.getElementById('name');

	var reason = document.getElementById('reason');

	//when you click the turn me button, alert if checkbox isn't clicked
	//if checkbox IS clicked, call hidePopup(); function
	$(button).on('click', function(){
		if(checkbox.checked == false || name.value == null || reason.value == null) {
			alert('YOU HAVE NOT COMPLIED WITH OUR DEMANDS, MORTAL. Please make sure all identifying information has been provided and try again.');
		} 
		else if(checkbox.checked == true) {
			hidePopup();
		}
	});
};

window.onload = init();