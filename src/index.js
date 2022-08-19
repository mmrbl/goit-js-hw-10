import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountryName } from './fetchCountry';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс
input.addEventListener(
  'input',
  debounce(evt => {
    const textInput = evt.target.value.trim();
    // Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.
    if (textInput === '') {
      clearInfo();
      return;
    }
    fetchCountryName(textInput).then(showResult).catch(error);
  }, DEBOUNCE_DELAY)
);

function showResult(countries) {
  if (countries.length <= 10) {
    markupPage(countries);
  } else if (countries.length === 1) {
    markupCard(countries[0]);
  } else {
    overflow();
  }
}

// Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається з прапора та назви країни.
function markupPage(countries) {
  const markup = countries
    .map(country => {
      return `<ul class="country__list" style="list-style: none">
        <li class="country__item" style="display: flex">
          <img class="country__image" src="${country.flags.svg}" alt="Flag" width="50" heigth="50">
          <span style="font-size: 25px; font-weight: bold; margin-left: 10px">${country.name.official}</span>
        </li>
      </ul>`;
    })
    .join('');
  countryList.innerHTML = '';
  countryInfo.innerHTML = markup;
}

// Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.
function markupCard(country) {
  const countries = Object.values(country.languages).join(', ');
  const markup = `<div class="country__card">
    <div class="country__head">
      <img class="country__image" src="${country.flags.svg}" alt="Flag" width="150" height="150" >
      <h1 class="country__title">${country.name.official}</h1>
    </div>
    <div class="country__information">
      <b>Capital: </b>
      <p>${country.capital}</p>
    </div>
    <div class="country__information">
      <b>Population: </b>
      <p>${country.population}</p>
    </div>
    <div class="country__information">
      <b>Languages: </b>
      <p>${countries}</p>
    </div>
  </div>`;

  countryInfo.innerHTML = '';
  countryList.innerHTML = markup;
}

function clearInfo() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

//Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою
function overflow() {
  clearInfo();
  Notify.warning('Too many matches found. Please enter a more specific name.');
}

function error(error) {
  clearInfo();
  Notify.failure(error.message);
}
