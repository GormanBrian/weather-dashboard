let base = "api.openweathermap.org/data/2.5/forecast?";

let apiKey = "";
let baseUrl = "http://api.openweathermap.org/";

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

    let geoUrl = createUrl("geo/1.0/direct", `q=${cityName}`, "limit=1");
  });
});
