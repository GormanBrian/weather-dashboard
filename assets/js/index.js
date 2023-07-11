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
