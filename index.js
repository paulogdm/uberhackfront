const STR_MY_LOCATION = 'Minha localização atual'

const app = new Vue({
  el: '#vueapp',
  data: {
    strTo: null,
    strFrom: null,
    lat: -23.5664031,
    lng: -46.701877,
    map: null,
    directionsService: null,
    directionsDisplay: null,
    showReport: false,
    trainFlag: false,
    busFlag: false,
    isMultiple: false,
    draw: false
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

    clear: function () {
      this.directionsDisplay.setMap(null)
      this.directionsDisplay = null
    },

    report : function () {
      new google.maps.Marker({
        position: {
          lat: this.lat,
          lng: this.lng
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: 'red',
          fillOpacity: 0.0,
          strokeColor: 'red',
          strokeOpacity: 0.6
        },
        draggable: true,
        map: this.map
      })

      this.busFlag = false;
      this.trainFlag = false;
      this.showReport = false;

      this.isMultiple = true
    },

    traceSingleRoute: function () {

      if (this.draw) this.clear()
      else this.draw = true

      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      this.directionsDisplay.setMap(this.map);

      const origin = this.strFrom === STR_MY_LOCATION
      || !this.strFrom
      ? {lat: this.lat, lng: this.lng}
      : this.strFrom

      const destination = this.strTo || {
        lat: -23.55586272,
        lng: -46.66257014
      }

      this.directionsService.route({
        origin,
        destination,
        travelMode: 'TRANSIT'
      }, (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response)
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
    },

    traceMultipleRoute: function () {

      if (this.draw) this.clear()
      else this.draw = true

      const directionsService = new google.maps.DirectionsService;
      const directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(this.map);

      const origin = this.strFrom === STR_MY_LOCATION
      || !this.strFrom
      ? {lat: this.lat, lng: this.lng}
      : this.strFrom

      const destination = this.strTo || {
        lat: -23.55586272,
        lng: -46.66257014
      }

      directionsService.route({
        origin,
        destination,
        travelMode: 'TRANSIT',
        provideRouteAlternatives: true
      }, (response, status) => {
        if (status === 'OK') {
          response.routes.map((route, idx) => {
            new google.maps.DirectionsRenderer({
              map: this.map,
              directions: response,
              routeIndex: idx
            })
          })
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
