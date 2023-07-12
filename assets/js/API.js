let apiKey = "ea4f737616d8a7b0106129cadbff084c";
let baseUrl = "http://api.openweathermap.org/";

/**
 * Creates a generic OWM API URL
 * @param {string} resource Location of the API resource
 * @param  {...string} options Additional option
 * @returns {string} Constructed OWM API URL
 */
function createUrl(resource, ...options) {
  let url = baseUrl + resource;
  if (options.length > 0) {
    url += "?";
    options.forEach((option, index) => {
      if (index !== 0) url += "&";
      url += option;
    });
  }
  url += "&appid=" + apiKey;
  return url;
}

/**
 * Creates an OWM API URL for the Geocoding service based on city name
 * @param {string} city Name of the city
 * @param {number} [limit=1] Number of results to return
 * @param  {...string} options Additional option
 * @returns Constructed Geocoding API URL
 */
function createGeoUrl(city, limit = 1, ...options) {
  return createUrl("geo/1.0/direct", `q=${city}`, `limit=${limit}`, ...options);
}

/**
 * Creates an OWM API URL for the 5-Day Forecast based on geodetic coordinates
 * @param {number} lat Latitudinal coordinate
 * @param {number} lon Longitudinal coordinate
 * @param  {...any} options Additional option
 * @returns Constructed 5-Day Forecast API URL
 */
function createForecastUrl(lat, lon, ...options) {
  return createUrl("data/2.5/forecast", `lat=${lat}`, `lon=${lon}`, ...options);
}

/**
 * Generic response handler
 * @param {function} response Promise with response parameter
 * @returns Error if response is not ok, otherwise json of response
 */
const handleResponse = (response) => {
  if (!response.ok) throw new Error(response.status);
  return response.json();
};

/**
 * Fetches the coordinates of a city and returns a promise
 * @param {string} city Name of the city
 * @returns Promise with data or error
 */
async function fetchCoordinates(city) {
  let url = createGeoUrl(city);
  return fetch(url)
    .then(handleResponse)
    .then((data) => {
      if (data.length === 0) throw new Error("Invalid city name");
      return {
        lat: data[0].lat,
        lon: data[0].lon,
        state: data[0].state,
      };
    });
}

/**
 * Fetches the 5-day forecast for the coordinates and returns a promise
 * @param {number} lat Latitudinal geodetic coordinate
 * @param {number} lon Longitudinal geodetic coordinate
 * @param {string} units Metric or imperial
 * @returns Promise with data or error
 */
async function fetchForecast(lat, lon, units) {
  let url = createForecastUrl(lat, lon, units);
  return fetch(url).then(handleResponse);
}
