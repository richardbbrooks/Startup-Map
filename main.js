var _markersArray = [];
var _locationObjectArray = [];
var _markerCluster;
var _scrollPane;
var _scroll_api;

$(document).ready(function(){
	initializeMap();
	initializeData();
	_scrollPane = $('.scroll-pane');
	_scrollPane.jScrollPane();
	_scroll_api = _scrollPane.data('jsp');
});

function initializeMap() {
    initialLocation = new google.maps.LatLng(39.833333,-98.58);
    var mapOptions = {
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    _map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    
    _map.setCenter(initialLocation);
	clusterOptions = {maxZoom: 11};
    _markerCluster = new MarkerClusterer(_map, [], clusterOptions);
}

function addMarker(lat, lng, id, infoWindowContent) {	
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        animation: google.maps.Animation.DROP,
	id: id
    });
    var infowindow = new google.maps.InfoWindow({
        content: infoWindowContent
    })
    marker.infowindow = infowindow;
    google.maps.event.addListener(marker, 'click', function() {
    	displayInfoWindow(id);
    });
    _markerCluster.addMarker(marker);
    _markersArray.push(marker);
}
function displayInfoWindow(id){
	for (i in _markersArray){
		_markersArray[i].infowindow.close();	
	}
	foundMarker = findMarkerById(id);
	_map.panTo(foundMarker.getPosition());
	foundMarker.infowindow.open(_map, foundMarker);
	_map.panBy(160,-160);
}

function zoomToMarker(id){
    _map.panTo(findMarkerById(id).getPosition());
	_map.panBy(160,-160);
	displayInfoWindow(id);
}
function psuedoCenter(latlng){
	var sw = _map.getBounds().getSouthWest();
	
	var psuedoLat = ((latlng.lat() - _map.getCenter().lat()) / 2.0) + latlng.lat();
	var psuedoLng = ((latlng.lng() - _map.getCenter().lng()) / 2.0) + latlng.lat();
	
	return (new google.maps.LatLng(psuedoLat, psuedoLng)); 
}
function findMarkerById(id){
	for (i in _markersArray){
		if (_markersArray[i].id == id){
			return _markersArray[i];
		}
	}
	return -1;
}

function initializeData() {
	$.getJSON('companies.js',function(json){
		$.each(json, function(i, company){			
			//FOR PLACES WITHOUT LAT/LNG NEED TO REVERSE GEOCODE AT LEAST THE CITY
			if (company.offices[0] && company.offices[0].latitude && company.offices[0].longitude){
				addMarker(company.offices[0].latitude, company.offices[0].longitude, company.permalink, makePrettyInfoWindowText(company));	
				appendCompanyToList(company);
				_locationObjectArray.push(company);
			}
			else{
				console.log('No Lat/Lng', company.name);
			}
		});
	});
}

function makePrettyInfoWindowText(company) {
	var prettyString = '';
	prettyString += '<span id="companyname">'+company.name+'</span><br />';
	if (company.offices[0]){
		prettyString += '<span id="companylocation">';
		if (company.offices[0].city){
			prettyString += ' ' + company.offices[0].city;
		}
		if (company.offices[0].state_code) {
			prettyString += ' ' + company.offices[0].state_code;
		}
	}
	prettyString += '</p></span>';
	
	if (company.number_of_employees){
		prettyString += '<span id="employees">'+company.number_of_employees+' Employees</span>';
	}
	if (company.homepage_url) {
		prettyString += '<span id="companywebsite"><a href="'+company.homepage_url+'">'+company.homepage_url+'</a></span>';
	}
	return prettyString;	
}

function makePrettyCompanyParagraph(company) {
	var prettyString = '';
	prettyString += '<p id="'+company.permalink+'" class="company" onclick="zoomToMarker(\''+company.permalink+'\');">';
	prettyString += '<span id="companyname">'+company.name+'</span><br />';
	if (company.offices[0]){
		prettyString += '<span id="companylocation">';
		if (company.offices[0].city){
			prettyString += ' ' + company.offices[0].city;
		}
		if (company.offices[0].state_code && company.offices[0].city) {
			prettyString += ', ' + company.offices[0].state_code;
		}
        else if (company.offices[0].state_code){
            prettyString += ' ' + company.offices[0].state_code;
        }
	}
	else{
		prettyString += '&nbsp;';
	}
	prettyString += '</p></span>';
	return prettyString;	
}

function appendCompanyToList(company) {
	$('#companies').append(makePrettyCompanyParagraph(company));
	_scroll_api.reinitialise();
}

function toggleRightSidebar() {
	$('#rightpanel_content').toggle('slow');
}
function toggleAboutPanel() {
	$('#about-title').toggle('fast');
	$('#about').toggle('slow');
}
