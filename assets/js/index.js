let celsius = "Celsius";
let fahrenheit = "Fahrenheit";
let units = celsius;

$(function () {
  // Listen for units switch change
  $("#units-switch").on("change", function () {
    units = $(this).is(":checked") ? celsius : fahrenheit;
    $("units-switch-label").text(units);
  });

  $("#search-form").on("submit", async function (event) {
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
            let currentForecast = {
              city: {
                ...forecastResult.city,
                state: coordinatesResult.state,
              },
              list: forecastResult.list,
            };
          })
          .catch((forecastError) => {
            console.log(forecastError);
          });
      })
      .catch((coordinatesError) => {
        console.log(coordinatesError);
      });
  });
});
