const STR_MY_LOCATION = 'Minha localização atual'

const app = new Vue({
  el: '#vueapp',
  data: {
    strTo: null,
    strFrom: null,
    lat: -23.55586272,
    lng: -46.66257014,
    map: null,
    directionsService: null,
    directionsDisplay: null
  },
  methods : {
    initializeMaps: function () {
      this.map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {
          lat: this.lat,
          lng: this.lng
        },
        scrollwheel: true,
        disableDefaultUI: true,
        mapTypeId: 'roadmap',
        zoom: 13
      })
    },

    setStrFrom: function () {
      this.strFrom = STR_MY_LOCATION
    },

    setCenterMark: function (lat, lng) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: 'Me',
        map: this.map,
      })
      google.maps.event.addListener(marker, 'click', function () {
          this.map.panTo(marker.getPosition())
      })
    },
    traceRoute: function() {
      const directionsService = new google.maps.DirectionsService;
      const directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(this.map);

      directionsService.route({
        origin: {lat: this.lat, lng: this.lng},
        destination: {
          lat: -23.5664031,
          lng: -46.701877
        },
        travelMode: 'TRANSIT',
        provideRouteAlternatives: true
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections([response[1]])
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
    }
  },
  mounted: function () {
    this.initializeMaps()
    this.setCenterMark(this.lat, this.lng)
  }
})
