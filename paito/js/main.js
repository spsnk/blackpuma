$(function() {
  axios
    .get("data/texas_day.json")
    .then(function(response) {
      response.data.forEach(value => {
        addRow(value);
      });
      $("#draw")
        .offset($("#paito > tbody").offset())
        .height($("#paito > tbody").height())
        .width($("#paito > tbody").width());
    })
    .catch(function(error) {
      console.log(error);
    });
});

function addRow(data) {
  let row = $("<tr>");
  for (let i = 0; i < 7; i++) {
    let cell = $("<td>");
    data[i].split("").forEach(value => {
      cell.append("<span class='number'>" + value + "</span>");
    });
    row.append(cell);
  }
  $("#paito > tbody").append(row);
}
