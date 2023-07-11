let apiKey = "";
let baseUrl = "http://api.openweathermap.org/";

/**
 * Creates an OWM API URL
 * @param {string} resource Location of the API resource
 * @param  {...string} options Additional options
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
 * @param {number} limit Number of results to return
 * @param  {...string} options Additional options
 * @returns Constructed Geocoding API URL
 */
function createGeoUrl(city, limit = 1, ...options) {
  return createUrl("geo/1.0/direct", `q=${city}`, `limit=${limit}`, ...options);
}

/**
 * Creates an OWM API URL for the 5-Day Forecast based on geodetic coordinates
 * @param {number} lat Latitudinal coordinate
 * @param {number} lon Longitudinal coordinate
 * @param  {...any} options Additional options
 * @returns Constructed 5-Day Forecast API URL
 */
function createForecastUrl(lat, lon, ...options) {
  return createUrl("data/2.5/forecast", lat, lon, ...options);
}

$(function () {
  // Listen for units switch change
  $("#units-switch").on("change", function () {
    $(this)
      .siblings("label")
      .text($(this).is(":checked") ? "Celsius" : "Fahrenheit");
  });

  $("#search-form").on("submit", function (event) {
    event.preventDefault();

    let cityName = $("#city-name").val();

    let geoUrl = createGeoUrl(cityName, 1);
  });
});
