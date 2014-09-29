var APIKey = 'AIzaSyDy_QYL6jpteqajvI1N7xNTiNRTtgVm0PE';

window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);

//normalize navigator.getUserMedia
navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var geocoder;
var map;
var zipcode;


var initializeMap = function(zipcode) {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(zipcode);
	var mapOptions = {
		zoom: 8,
		center: latlng
	}

	map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

	//passes zipcode input to codeAddress function
	codeAddress();	

};

var codeAddress = function() {
	// var zipcode = document.getElementById('zipcode').value;
	
	geocoder.geocode( { 'address': zipcode}, function(results, status){
		map.setCenter(results[0].geometry.location);
		if (status == google.maps.GeocoderStatus.OK) {
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});	
		} else {
			alert('Geocode unsuccessful because '+ status);
		}
	});
};

//what happens when you input your zip and click the feed me button
var feedMe = function(zipcode) {
	//hides all other divs from page
	$('#congratsWrapper, #transparentOverlayTwo, #videoContainer, #righthandContainer').addClass('hideBox');

	//creates map div
	var mapDiv = $('<div/>');
	//gives map div an id of #map-canvas
	mapDiv.attr('id', 'mapCanvas');

	$('body').append(mapDiv);

	//calls initialize map function when the mapDiv has loaded:
	google.maps.event.addDomListener(mapDiv, 'append', initializeMap(zipcode));
	
	console.log('hey');
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

	            // if(experimentType === MASK_EXPERIMENT) {
	            drawMasks(faces);
	            // } else {
	            //     highlightFaces(faces);

	            //     if(originalFace && faces.length > 0) {
	            //         scaleContent(faces[0]);
	            //     }

	            //     if( ! originalFace && faces.length === 1) {
	            //         originalFace = faces[0];
	            //     }
	            // }

	            // Log process time
	            // console.log(+new Date() - startTime);

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
		zipcode = document.getElementById('zipcode').value;
		console.log(zipcode.value);
		
		feedMe(zipcode);
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

	//when you click the turn me button, alert if checkbox isn't clicked
	//if checkbox IS clicked, call hidePopup(); function
	$(button).on('click', function(){
		if(checkbox.checked == false) {
			alert('You have not accepted the terms and conditions.');
		} 
		if(checkbox.checked == true) {
			hidePopup();
		}
	});
};

window.onload = init();