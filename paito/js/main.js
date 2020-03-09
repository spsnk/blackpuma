$(function() {
  axios
    .get("data/texas_day.json")
    .then(function(response) {
      console.log(response);
      response.data.forEach(value => {
        addRow(value);
        console.log(value);
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

function addRow(data) {
  let row = $("<tr>");
  for (let i = 0; i < 7; i++) {
    let cell = $("<td>");
    cell.text(data[i]);
    row.append(cell);
  }
  $("#paito > tbody").append(row);
}
