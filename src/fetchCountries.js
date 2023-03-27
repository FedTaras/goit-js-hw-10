export default function fetchCountries(countryToFind) {
  const country = 'name,flags,capital,population,languages';
  return fetch(
    `https://restcountries.com/v3.1/name/${countryToFind}?fields=${country}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
