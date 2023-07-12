/**
 * Generic API class with helper functions
 */
class API {
  #apiKey;

  /**
   * Constructor for generic API
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

  /**
   * Parses through an array and creates a new array of objects with selected keys
   * @param {Array<Object>} data Data array with full objects
   * @param {Array<string>} keys Keys to select from data objects
   * @param {boolean} [strict=true] Throws an error if any object is missing a specified key
   * @param {boolean} [hasAKey=true] Throws an error if any object does not have at least one specified key
   * @param {string} [noDataMessage="Data is empty"] Error message when data array is empty
   * @param {string} [missingKeyMessage="Object is missing key"] Error message when an object is missing a key
   * @param {string} [noKeysMessage="Object does not have any keys"] Error message when an object is missing all keys
   * @param {string} [noObjectsMessage="No objects with keys exist"] Error message when no objects exist with selected keys
   * @returns {Array<Object> | Error} Array of reduced objects or throws an error
   */
  getDataObjectsWithKeys(
    data,
    keys,
    strict = true,
    hasAKey = true,
    noDataMessage = "Data is empty",
    missingKeyMessage = "Object is missing key",
    noKeysMessage = "Object does not have any keys",
    noObjectsMessage = "No objects with keys exist"
  ) {
    if (data.length === 0) throw new Error(noDataMessage);
    if (keys.length === 0) return data;

    let dataArray = [];
    data.forEach((item, index) => {
      let currObj = {};
      keys.forEach((key) => {
        if (item.hasOwnProperty(key)) currObj[key] = item[key];
        else if (strict)
          throw new Error(
            missingKeyMessage + "\nItem: " + index + " has no key: " + key
          );
      });
      if (Object.keys(currObj).length > 0) dataArray.push(currObj);
      else if (hasAKey) throw new Error(noKeysMessage);
    });

    if (dataArray.length === 0) throw new Error(noObjectsMessage);
    return dataArray;
  }
}

/**
 * Open Weather Map API class
 */
class OpenWeatherMapAPI extends API {
  /**
   * Constructor for Open Weather Map API
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
        return super.getDataObjectsWithKeys(
          data,
          ["lat", "lon", "state"],
          "Invalid city name"
        );
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
