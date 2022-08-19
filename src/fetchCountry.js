function fetchCountryName(countryName) {
  const options = 'fields=name,capital,population,flags,languages';
  const url = `https://restcountries.com/v3.1/name/${countryName}?${options}`;
  return fetch(url).then(response => {
    if (!response.ok) {
      console.log(response.status);
      throw new Error('Oops, there is no country with that name');
    }
    return response.json();
  });
}

export { fetchCountryName };
