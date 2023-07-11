$(function () {
  // Listen for units switch change
  $("#units-switch").on("change", function () {
    $(this)
      .siblings("label")
      .text($(this).is(":checked") ? "Fahrenheit" : "Celsius");
  });
});
