let celsius = "Celsius";
let fahrenheit = "Fahrenheit";
let units = celsius;

$(function () {
  function displayForecast(city, list) {
    // Display 5-day forecast and city information
  }

  /**
   * Updates units switch label on toggle
   */
  function handleUnitsSwitchChange() {
    units = $(this).is(":checked") ? celsius : fahrenheit;
    $("units-switch-label").text(units);
  }

  // Listen for units switch change
  $("#units-switch").on("change", handleUnitsSwitchChange);

  /**
   * Gets the coordinates and then forecast results from API,
   * call display functions based on response status
   * @param {Event} event Form submit event
   */
  async function handleSearchFormSubmit(event) {
    event.preventDefault();

    let cityName = $("#city-name").val();

    await fetchCoordinates(cityName)
      .then((coordinatesResult) => {
        fetchForecast(
          coordinatesResult.lat,
          coordinatesResult.lon,
          units === celsius ? "metric" : "imperial"
        )
          .then((forecastResult) => {
            displayForecast(
              {
                ...forecastResult.city,
                state: coordinatesResult.state,
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
  }

  // Listen for search form submission
  $("#search-form").on("submit", handleSearchFormSubmit);
});
