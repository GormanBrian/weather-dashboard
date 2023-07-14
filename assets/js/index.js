let metric = "metric";
let imperial = "imperial";

$(() => {
  let WeatherAPI = new OpenWeatherMapAPI();

  /**
   * Appends weather card elements
   * @param {Element} element Card element
   * @param {string} date Timestamp of the weather data
   * @param {string} icon Icon representing the weather conditions
   * @param {number} temp Temperature reading
   * @param {number} windSpeed Wind speed
   * @param {string} cardClasses Classes to apply to outer card
   * @param {string} headingClasses Classes to apply to heading
   * @returns Card element with informational elements appended
   */
  const card = (
    element,
    date,
    icon,
    temp,
    humidity,
    windSpeed,
    cardClasses,
    headingClasses
  ) =>
    element
      .addClass("card", cardClasses)
      .append($("<h3>").addClass(headingClasses).text(date.format("M/D/YYYY")))
      .append(
        $("<img>")
          .addClass("rounded mx-auto d-block")
          .attr("src", `https://openweathermap.org/img/wn/${icon}@4x.png`)
      )
      .append($("<p>").addClass("").text(temp))
      .append($("<p>").addClass("").text(humidity))
      .append($("<p>").addClass("").text(windSpeed));

  /**
   * Displays the current weather in the DOM
   * @param {Object} data Current weather report
   * @param {Array<Object>} data.weather Weather data
   * @param {string} data.weather[].icon Icon representing the weather conditions

   */
  const displayWeather = ({ weather, main, wind }) => {
    $("#city-info").html("");
    card(
      $("#city-info"),
      dayjs(),
      weather[0].icon,
      main.temp,
      main.humidity,
      wind.speed,
      "",
      ""
    );
  };

  /**
   * Displays the 5-day weather forecast in the DOM
   * @param {Array<Object>} list List of timestamped forecast reports
   * @param {string} list[].dt_txt Timestamp of the forecast report
   * @param {Array<Object>} list[].weather Weather data
   * @param {string} list[].weather[].icon Icon representing the weather conditions
   * @param {Object} main Main weather data
   * @param {Object} wind Wind data
   * @param {number} wind.speed Wind speed
   */
  const displayForecast = (list) => {
    $("#forecast").html("");
    list.forEach(({ dt_txt, weather, main, wind }) =>
      $("#forecast").append(
        card(
          $("<div>"),
          dayjs(dt_txt),
          weather[0].icon,
          main.temp,
          main.humidity,
          wind.speed,
          "",
          ""
        )
      )
    );
  };

  /**
   * Checks if the units switch is checked
   * @returns {boolean} True if checked, false if unchecked
   */
  const units = () => ($("#units-switch").is(":checked") ? metric : imperial);

  /**
   * Capitalizes the first letter in a string
   * @param {string} string String to be modified
   * @returns Argument string with first letter capitalized
   */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Listen for units switch change and updates label
  $("#units-switch").on("change", function () {
    $("#units-switch-label").text(capitalizeFirstLetter(units()));
  });

  /**
   * Gets the coordinates and then forecast results from API,
   * call display functions based on response status
   * @param {Event} event Form submit event
   */
  const handleSearch = async () => {
    let cityName = $("#city-name").val().trim();
    if (cityName === "") return;

    WeatherAPI.setForecastIncrement(3, 8);
    await WeatherAPI.fetchCoordinates(cityName)
      .then(async (coordinatesResult) => {
        // GET CURRENT WEATHER
        WeatherAPI.fetchWeather(
          "weather",
          coordinatesResult[0].lat,
          coordinatesResult[0].lon,
          "units=" + units()
        )
          .then((weatherResult) => {
            displayWeather(weatherResult);
          })
          .catch((weatherError) => {
            console.log(weatherError);
          });

        // GET FORECAST
        WeatherAPI.fetchForecast(
          coordinatesResult[0].lat,
          coordinatesResult[0].lon,
          "units=" + units()
        )
          .then((forecastResult) => {
            displayForecast(
              // {
              //   ...forecastResult.city,
              //   state: coordinatesResult[0].state,
              // },
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

    saveCity();
  };

  /**
   *
   */
  const saveCity = () => {
    let city = $("#city-name").val().trim();
    if (city === "") return;
    city = capitalizeFirstLetter(city);

    let cities = JSON.parse(localStorage.getItem("cities"));

    if (!cities.includes(city)) {
      cities.unshift(city);
      if (cities.length > 10) cities.pop();
    }

    localStorage.setItem("cities", JSON.stringify(cities));

    displayCities();
  };

  const displayCities = () => {
    let cities = JSON.parse(localStorage.getItem("cities"));
    let citiesList = $("#cities-list");
    citiesList.html("");

    if (cities.length === 0) return;

    cities.forEach((city) => {
      citiesList.append(
        $("<button>").on("click", () => {
          $("#city-name").val(city);
          handleSearch();
        })
      );
    });
  };

  displayCities();

  // Listen for search form submission
  $("#search-form").on("submit", (event) => {
    event.preventDefault();
    handleSearch();
  });
});
