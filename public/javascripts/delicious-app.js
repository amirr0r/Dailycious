import '../sass/style.scss'

import { $, $$ } from './modules/bling'
import autocomplete from './modules/autocomplete'
import typeAhead from './modules/typeAhead'
import makeMap from './modules/map'
import ajaxHeart from './modules/heart'

const address = $('#address')
const lng = $('#lng')
const lat = $('#lat')

autocomplete(address, lat, lng)
typeAhead($('.search'))

makeMap($('#map'))

$$('form.heart').on('submit', ajaxHeart)