import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");

let searchCountryName = '';

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
    e.preventDefault();
    searchCountryName = inputEl.value.trim();
    if (searchCountryName === '') {
    clearAll();
    return;
    } else
        fetchCountries(searchCountryName).then(countryNames => {
            if (countryNames.length < 2) {
                renderCountryCard(countryNames);
            } else if (countryNames.length < 10 && countryNames.length > 1) {
                renderCountryList(countryNames);
            } else {
                clearAll();
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            }
        }).catch(() => {
            clearAll();
            Notiflix.Notify.failure('Oops, there is no country with that name');
        }); 
}

function renderCountryCard(country) {
    clearAll();
  const c = country[0];
  const renderCard = `<div class="country-card">
  <div class="country-card__hero">
    <img src="${c.flags.svg}" alt="Flag" width="60" height="40" />
    <h2 class="country-card__name">${c.name.official}</h2>
  </div>
  <p class="country-card__text">
    Capital: <span class="value">${c.capital}</span>
  </p>
  <p class="country-card__text">
    Population: <span class="value">${c.population}</span>
  </p>
  <p class="country-card__text">
    Languages:
    <span class="value">${Object.values(c.languages).join(',')}</span>
  </p>
</div>`;
  countryInfoEl.innerHTML = renderCard;
}

function renderCountryList(country) {
    clearAll();
    const renderList = country.map(
        c => `<li class="country-list__item">
  <img src="${c.flags.svg}" alt="Flag" width="50" height="30" />
  <h2 class="country-list__name">${c.name.official}</h2>
  </li>`
    ).join('');
    countryListEl.innerHTML = renderList;
}

function clearAll() {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
}