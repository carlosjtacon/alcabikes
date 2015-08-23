var map = null;
var markerMe = null;
var bikeParkLayer = null;
var geoJsonBike = null;

$(document).ready(function()
{
	map = L.map('map').setView([40.4932, -3.3622], 13);

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var bikeparkStyle = {
            radius: 5,
            fillColor: "blue",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        };

	$.getJSON("parking.geojson", function(result){
		geoJsonBike = result;
        bikeParkLayer = L.geoJson(result, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, bikeparkStyle);
                }
            }).addTo(map);
        // bikeParkLayer = L.featureLayer(result).addTo(map);
    });

});


function markMe(position)
{
	console.log(position.coords.latitude);
	console.log(position.coords.longitude);
	markerMe = L.circle([position.coords.latitude, position.coords.longitude], 50, {
    	color: 'red',
    	fillColor: '#f03',
    	fillOpacity: 0.5
	}).addTo(map);

	map.setView([position.coords.latitude, position.coords.longitude], 14);

	var nearestPark = turf.nearest(markerMe.toGeoJSON(), geoJsonBike);
	nearestPark.properties['marker-size'] = 'large';

	var nearestParkStyle = {
        radius: 8,
        fillColor: "green",
        color: "#0F0",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };


    nearestParkLayer = L.geoJson(nearestPark, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, nearestParkStyle);
        }
    }).addTo(map);
}

function showError(error)
{    
    var message = null;  
    
	if (error.core == error.PERMISSION_DENIED)
		message = "El usuario no ha concedido los privilegios de geolocalización.";  
	else if (error.core == error.POSITION_UNAVAILABLE)
		message = "Posicion no disponible.";  
	else if (error.core == error.TIMEOUT)
		message = "Demasiado tiempo intentando obtener la localización del usuario.";  
	else 
		message = "No se ha podido geolocalizar con la configuración de su navegador.";  

	$('#locate').addClass("pure-button pure-button-error");
	alert(message);
}  

function geoMe()
{
	if (map !== null)
	{
		 if (navigator.geolocation)
		 { 
		 	if (markerMe !== null)
				map.removeLayer(markerMe);

			var queryOptions  = {timeout:5000, maximumAge:20000, enableHighAccurace:false};
  			navigator.geolocation.getCurrentPosition(markMe, showError, queryOptions);	
		}
		else
		{
			$('#locate').addClass("pure-button pure-button-error");	
			alert("La geolocalizción HTML5 no esta disponible en su navegador.");
		}
	}
}