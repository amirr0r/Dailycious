import { $ } from './bling'
import axios from 'axios'

const mapOptions = {
  center: { lat: 48.8, lng: 2.32 },
  zoom: 10
}

const loadPlaces = (map, lat = 48.8 , lng = 2.32) => {
	axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
	    .then(res => {
		  const places = res.data
	      if (!places.length) {
	        alert('no places found!')
	        return
	      }
	      // create a bounds
	      const bounds = new google.maps.LatLngBounds()
	      const infoWindow = new google.maps.InfoWindow()

	      const markers = places.map(place => {
	        const [placeLng, placeLat] = place.location.coordinates
	        const position = { lat: placeLat, lng: placeLng }
	        const marker = new google.maps.Marker({ map, position })

	        bounds.extend(position)
	        marker.place = place
	        
	        return marker
	      })

	      // when someone clicks on a marker, show the details of that place
	      markers.forEach(marker => marker.addListener('click', () => {
	        const html = `
	          <div class="popup">
	            <a href="/store/${marker.place.slug}">
	              <img src="/uploads/${marker.place.photo || 'store.png'}" alt="${marker.place.name}" />
	              <p>${marker.place.name} - ${marker.place.location.address}</p>
	            </a>
	          </div>
	        `
	        infoWindow.setContent(html)
	        infoWindow.open(map, marker)
	      }))

	      // then zoom the map to fit all the markers perfectly
	      map.setCenter(bounds.getCenter())
	      map.fitBounds(bounds)
	    })
}

const makeMap = mapDiv => {
	if (mapDiv) {
		const map = new google.maps.Map(mapDiv, mapOptions)
		loadPlaces(map)
		const input = $('[name="geolocate"]')
		const autocomplete = new google.maps.places.Autocomplete(input)
		
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace()
			loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
		})
	}
}

export default makeMap