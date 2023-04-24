import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from './fetchCountries.js';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;


const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


input.addEventListener('input', debounce(onInputText, DEBOUNCE_DELAY));

function onInputText(evt) {
    const inputCountryName = evt.target.value.trim();
    if (inputCountryName) {
        fetchCountries(inputCountryName)
        .then(data => {
            if (data.length === 1) {
                countryList.innerHTML = '';
                countryInfo.innerHTML = createCountryInfoMarcup(data);
            } else if (data.length > 1 && data.length <=10) {
                countryInfo.innerHTML = '';
                countryList.innerHTML = createCountryListMarcup(data);
            }else {
                clearMarkup();
                Notify.info("Too many matches found. Please enter a more specific name.");
            }
        })
        .catch(() => {
            clearMarkup();
            Notify.failure("Oops, there is no country with that name")
        }
        )
    } else {
        clearMarkup();
    }
}

function createCountryListMarcup(arr) {
    return arr.map(({name: {official}, flags: {svg, alt}}) => 
    `<li class="country-item">
        <img src="${svg}" alt="${alt}" width="70px">${official}
    </li>`).join('');
}

function createCountryInfoMarcup(arr) {
    return arr.map(({name: {official}, capital, population, flags: {svg, alt}, languages}) =>
    `<div class = "country-header">
        <img src="${svg}" alt="${alt}" width="100px">
        <h2 class="counrty-name">${official}</h2>
    </div>
    <div class = "coutry-info">
        <h3>Capital:</h3>
        <p>${capital}</p>
    </div>
    <div class = "coutry-info">
        <h3>Population:</h3>
        <p>${population}</p>
    </div>
    <div class = "coutry-info">
        <h3>Languages:</h3>
        <p>${Object.values(languages)}</p>
    </div>`)
    .join('');
}

function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}