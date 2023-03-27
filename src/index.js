import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

function ulAdded({ flags, name }) {
  return `<p>
        <img src="${flags.svg}" alt="flag of ${name.official}" width = "50" height = "25">  <span>   ${name.official}</span>
       </p>`;
}

function divAdded({ flags, name, capital, population, languages }) {
  return `<h1><img src="${flags.svg}" alt="flag of ${
    name.official
  }" width = "30" height = "25"> <span>${name.official}</span></h1>
      <p><span>Capital: </span>${capital}</p>
      <p><span>Population: </span>${population}</p>
      <p><span>Languages: </span>${Object.values(languages)}</p>`;
}

refs.input.addEventListener('input', debounce(searcCountry, DEBOUNCE_DELAY));

function searcCountry() {
  const countryToFind = refs.input.value.trim();
  if (!countryToFind) {
    refs.ul.innerHTML = '';
    refs.div.innerHTML = '';
    return;
  }
  fetchCountries(countryToFind)
    .then(countrys => {
      if (countrys.length === 1) {
        const markup = countrys.map(country => divAdded(country));
        refs.div.innerHTML = markup.join('');
        refs.ul.innerHTML = '';
      }
      if (countrys.length >= 2) {
        const listMarkup = countrys.map(country => ulAdded(country));
        refs.ul.innerHTML = listMarkup.join('');
        refs.div.innerHTML = '';
      }

      if (countrys.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.div.innerHTML = '';
        refs.ul.innerHTML = '';
        return;
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.div.innerHTML = '';
      refs.ul.innerHTML = '';
      return error;
    });
}
