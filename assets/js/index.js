$(function () {
  // Listen for units switch change
  $("#units-switch").on("change", function () {
    $(this)
      .siblings("label")
      .text($(this).is(":checked") ? "Celsius" : "Fahrenheit");
  });

  $("#search-form").on("submit", async function (event) {
    event.preventDefault();

    let cityName = $("#city-name").val();

    let cityObj;

    await fetchCoordinates(cityName)
      .then((result) => {
        cityObj = result;
      })
      .catch((error) => {
        // Show alert with error message
      });
  });
});
