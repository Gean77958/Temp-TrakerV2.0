const claveApi='ddb1d644c6a049859e9200327251704';
const idioma = 'es';
const ciudad = 'Huancayo';

const apiClimaActual = `https://api.weatherapi.com/v1/current.json?
q=${ciudad}&lang=${idioma}&key=${claveApi}`;

const response = await fetch(apiClimaActual);
let data = await response.json();

console.log(data.location.localtime);