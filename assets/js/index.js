let metric = "metric";
let imperial = "imperial";

$(() => {
  let WeatherAPI = new OpenWeatherMapAPI();

  /**
   * Displays the 5-day weather forecast in the DOM
   * @param {Object} city Open Weather Map city object
   * @param {Array<Object>} list List of timestamped weather reports
   */
  const displayForecast = (city, list) => {
    $("#forecast").html("");
    console.log(list);

    const forecastCard = ({ dt_txt, weather, main, wind }) =>
      $("<div>")
        .addClass("card", "col-2")
        .append($("<h3>").addClass("").text(dayjs(dt_txt).format("M/D/YYYY")))
        .append(
          $("<img>")
            .addClass("rounded mx-auto d-block")
            .attr(
              "src",
              `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`
            )
        )
        .append($("<p>").addClass("").text(main.temp))
        .append($("<p>").addClass("").text(main.humidity))
        .append($("<p>").addClass("").text(wind.speed));

    list.forEach((day) => {
      $("#forecast").append(forecastCard(day));
    });
  };

  /**
   * Checks if the units switch is checked
   * @returns {boolean} True if checked, false if unchecked
   */
  const units = () => ($("#units-switch").is(":checked") ? metric : imperial);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Listen for units switch change and updates label
  $("#units-switch").on("change", function () {
    $("#units-switch-label").text(capitalizeFirstLetter(units()));
  });

  /**
   * Gets the coordinates and then forecast results from API,
   * call display functions based on response status
   * @param {Event} event Form submit event
   */
  const handleSearchFormSubmit = async (event) => {
    event.preventDefault();

    let cityName = $("#city-name").val();

    WeatherAPI.setForecastIncrement(3, 8);
    await WeatherAPI.fetchCoordinates(cityName)
      .then(async (coordinatesResult) => {
        await WeatherAPI.fetchForecast(
          "forecast",
          coordinatesResult[0].lat,
          coordinatesResult[0].lon,
          "units=" + units()
        )
          .then((forecastResult) => {
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
