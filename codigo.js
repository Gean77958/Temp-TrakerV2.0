const claveApi = 'ddb1d644c6a049859e9200327251704';
const idioma = 'es';
let unidades = 'c'; // c = Celsius, f = Fahrenheit
const inpCiudad = document.getElementById('input-ciudad');
const ctx = document.getElementById('graficoTemp');
let chart = null;

async function obtenerClima() {
  const ciudad = inpCiudad.value || 'Huancayo';
  const apiClimaActual = `https://api.weatherapi.com/v1/current.json?q=${ciudad}&lang=${idioma}&key=${claveApi}`;
  const apiPronostico = `https://api.weatherapi.com/v1/forecast.json?q=${ciudad}&lang=${idioma}&days=5&key=${claveApi}`;

  try {
    const resActual = await fetch(apiClimaActual);
    const dataActual = await resActual.json();
    const resForecast = await fetch(apiPronostico);
    const dataForecast = await resForecast.json();
    mostrarClima(dataActual);
    mostrarPronostico(dataForecast);
    graficar(dataForecast);
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    alert("No se pudo obtener el clima. Revisa tu conexión o el nombre de la ciudad.");
  }
}

function mostrarClima(data) {
  const temp = unidades === 'c' ? data.current.temp_c : data.current.temp_f;
  const viento = unidades === 'c' ? data.current.wind_kph + ' km/h' : data.current.wind_mph + ' mph';

  document.querySelector('.clima-icono').src = "https:" + data.current.condition.icon;
  document.querySelector('.clima-texto').innerHTML = data.current.condition.text;
  document.querySelector('.temp').innerHTML = temp + (unidades === 'c' ? '°C' : '°F');
  document.querySelector('.ciudad').innerHTML = data.location.name;
  document.querySelector('.humedad').innerHTML = data.current.humidity + '%';
  document.querySelector('.viento').innerHTML = viento;
}

function mostrarPronostico(data) {
    const contenedor = document.getElementById('pronostico');
    contenedor.innerHTML = '';
    data.forecast.forecastday.forEach(dia => {
      const fecha = new Date(dia.date);
      const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
      const tempMax = unidades === 'c' ? dia.day.maxtemp_c : dia.day.maxtemp_f;
      const tempMin = unidades === 'c' ? dia.day.mintemp_c : dia.day.mintemp_f;
  
      contenedor.innerHTML += `
        <div class="dia">
          <p>${nombreDia}</p>
          <img src="https:${dia.day.condition.icon}" alt="icono" width="48">
          <p>${Math.round(tempMax)}° / ${Math.round(tempMin)}°</p>
        </div>
      `;
    });
  }
  

function graficar(data) {
  const etiquetas = data.forecast.forecastday.map(d => d.date);
  const temperaturas = data.forecast.forecastday.map(d => unidades === 'c' ? d.day.avgtemp_c : d.day.avgtemp_f);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Temp promedio',
        data: temperaturas,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: '#fff',
        borderWidth: 2,
        pointBackgroundColor: '#fff'
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#fff' } } },
      scales: {
        y: { ticks: { color: '#fff' } },
        x: { ticks: { color: '#fff' } }
      }
    }
  });
}

function cambiarUnidades() {
  unidades = unidades === 'c' ? 'f' : 'c';
  document.getElementById('unidadBtn').textContent = unidades === 'c' ? 'Cambiar a °F' : 'Cambiar a °C';
  obtenerClima();
}
/*botones*/
function toggleModo() {
  document.body.classList.toggle('claro');
  const btn = document.getElementById('modoBtn');
  btn.textContent = document.body.classList.contains('claro') ? 'Modo Oscuro' : 'Modo Claro';
}

// Cargar clima por defecto al abrir
window.addEventListener('DOMContentLoaded', () => {
  obtenerClima();
});
const iconoActual = document.getElementById('icono-actual');
iconoActual.src = "https:" + data.current.condition.icon;
