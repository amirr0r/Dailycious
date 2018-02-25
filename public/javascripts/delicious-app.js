import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';

const address = $('#address')
const lng = $('#lng')
const lat = $('#lat')

autocomplete(address, lat, lng)
typeAhead($('.search'))
