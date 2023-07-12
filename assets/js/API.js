/**
 * Generic API class with helper functions
 */
class API {
  #apiKey;

  /**
   * Constructor for generic API object
   * @param {string} baseUrl API base URL
   * @param {string} [apiKeyName=""] Parameter name of the api key
   * @param {string} [apiKey=""] API key
   */
  constructor(baseUrl, apiKeyName = "", apiKey = "") {
    this.baseUrl = baseUrl;
    this.apiKeyName = apiKeyName;
    this.#apiKey = apiKey;
  }

  /**
   * Creates a generic OWM API URL
   * @param {string} resource Location of the API resource
   * @param  {...string} options Additional option
   * @returns {string} Constructed OWM API URL
   */
  createUrl(resource, ...options) {
    let url = this.baseUrl + resource;

    let params = [...options];
    if (this.#apiKey !== "") params.push(this.apiKeyName + this.#apiKey);

    if (params.length > 0) {
      url += "?";
      params.forEach((option, index) => {
        if (index !== 0) url += "&";
        url += option;
      });
    }
    return url;
  }

  /**
   * Generic response handler
   * @param {Response} response Promise with response parameter
   * @returns Error if response is not ok, otherwise response body as JSON
   */
  handleResponse(response) {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  }
}

/**
 * Open Weather Map API class
 */
class OpenWeatherMapAPI extends API {
  /**
   * Constructor for OWM API
   */
  constructor() {
    super(
      "http://api.openweathermap.org/",
      "appid=",
      "ea4f737616d8a7b0106129cadbff084c"
    );
  }

  /**
   * Creates an OWM API URL for the Geocoding service based on city name
   * @param {string} city Name of the city
   * @param {number} [limit=1] Number of results to return
   * @param  {...string} options Additional option
   * @returns Constructed Geocoding API URL
   */
  createGeoUrl = (city, limit = 1, ...options) =>
    super.createUrl(
      "geo/1.0/direct",
      `q=${city}`,
      `limit=${limit}`,
      ...options
    );

  /**
   * Creates an OWM API URL for the 5-Day Forecast based on geodetic coordinates
   * @param {number} lat Latitudinal coordinate
   * @param {number} lon Longitudinal coordinate
   * @param  {...any} options Additional option
   * @returns Constructed 5-Day Forecast API URL
   */
  createForecastUrl = (lat, lon, ...options) =>
    super.createUrl(
      "data/2.5/forecast",
      `lat=${lat}`,
      `lon=${lon}`,
      ...options
    );

  /**
   * Fetches the coordinates of a city and returns a promise
   * @param {string} city Name of the city
   * @returns Promise with data or error
   */
  fetchCoordinates = async (city) => {
    let url = this.createGeoUrl(city);
    return fetch(url)
      .then(super.handleResponse)
      .then((data) => {
        if (data.length === 0) throw new Error("Invalid city name");
        return {
          lat: data[0].lat,
          lon: data[0].lon,
          state: data[0].state,
        };
      });
  };

  /**
   * Fetches the 5-day forecast for the coordinates and returns a promise
   * @param {number} lat Latitudinal geodetic coordinate
   * @param {number} lon Longitudinal geodetic coordinate
   * @param {string} units Metric or imperial
   * @returns Promise with data or error
   */
  fetchForecast = async (lat, lon, units) => {
    let url = this.createForecastUrl(lat, lon, units);
    return fetch(url).then(super.handleResponse);
  };
}
