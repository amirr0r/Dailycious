const autocomplete = (input, latInput, lngInput) => {
  if (input) {
    const dropdown = new google.maps.places.Autocomplete(input)
    dropdown.addListener('place_changed', () => {
      const place = dropdown.getPlace()
      latInput.value = place.geometry.location.lat()
      lngInput.value = place.geometry.location.lng()
    })
    // when the user hits on enter, we don't want to submit the form so ..
    input.on('keydown', e => e.keyCode === 13 ? e.preventDefault() : '')
  }
}

export default autocomplete