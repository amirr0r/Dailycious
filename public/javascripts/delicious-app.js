import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

const address = $('#address')
const lng = $('#lng')
const lat = $('#lat')
autocomplete(address, lat, lng)
