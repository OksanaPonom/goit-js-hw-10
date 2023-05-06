import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  countryInfo.innerHTML = '';
  list.innerHTML = '';
  const country = input.value.trim();
  if (!country) {
    Notify.warning('Please enter the name of the country');
    return;
  }

  fetchCountries(country)
    .then(country => {
      if (country.length === 1) {
        renderCountry(country);
      } else {
        renderList(country);
      }
    })
    .catch(error => {
      if (country.length !== 1) {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function renderList(country) {
  if (country.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  let markup = country
    .map(elem => {
      return `<li>
    <img src=${elem.flags.svg} height="20px" width="40px">
    <p class='text'>${elem.name.official}</p>
    </li>`;
    })
    .join('');
  list.innerHTML = markup;
}

function renderCountry(country) {
  if (country.length === 1) {
    list.innerHTML = '';
    const newMarkup = `
    <div class="country-name">
    <img src="${country[0].flags.svg}" alt="${
      country[0].name.official
    } height="30px" width="60px" >
    <h1>${country[0].name.official}</h1>
    </div>
    <ul>
      <li><b>Capital:</b> ${country[0].capital}</li>
      <li><b>Population:</b> ${country[0].population}</li>
      <li><b>Languages:</b> ${Object.values(country[0].languages)}</li>
    </ul>
  `;
    countryInfo.innerHTML = newMarkup;
  }
}
