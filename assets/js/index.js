let celsius = "Celsius";
let fahrenheit = "Fahrenheit";

$(() => {
  let WeatherAPI = new OpenWeatherMapAPI();

  /**
   * Displays the 5-day weather forecast in the DOM
   * @param {Object} city Open Weather Map city object
   * @param {Array<Object>} list List of timestamped weather reports
   */
  const displayForecast = (city, list) => {
    // Display 5-day forecast and city information
    // console.log(city);
    console.log(list);
  };

  /**
   * Checks if the units switch is checked
   * @returns {boolean} True if checked, false if unchecked
   */
  const isUnitsChecked = () => $("#units-switch").is(":checked");

  // Listen for units switch change and updates label
  $("#units-switch").on("change", function () {
    $("#units-switch-label").text(isUnitsChecked() ? celsius : fahrenheit);
  });

  /**
   * Gets the coordinates and then forecast results from API,
   * call display functions based on response status
   * @param {Event} event Form submit event
   */
  const handleSearchFormSubmit = async (event) => {
    event.preventDefault();

    let cityName = $("#city-name").val();

    await WeatherAPI.fetchCoordinates(cityName)
      .then((coordinatesResult) => {
        let forecastUrl = WeatherAPI.constructForecastUrl(
          coordinatesResult[0].lat,
          coordinatesResult[0].lon,
          "units=" + (isUnitsChecked() ? "metric" : "imperial")
        );

        WeatherAPI.fetchForecast(forecastUrl)
          .then((forecastResult) => {
            console.log(forecastResult.list);
            displayForecast(
              {
                ...forecastResult.city,
                state: coordinatesResult[0].state,
              },
              forecastResult.list
            );
          })
          .catch((forecastError) => {
            console.log(forecastError);
          });
      })
      .catch((coordinatesError) => {
        console.log(coordinatesError);
      });
  };

  // Listen for search form submission
  $("#search-form").on("submit", handleSearchFormSubmit);
});
