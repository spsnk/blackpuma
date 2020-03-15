function addRow(data) {
  var row = $("<tr>");
  for (var i = 0; i < 7; i++) {
    var cell = $("<td>");
    var generated_number = $("<td>").addClass("text-muted");
    var data_number = data[i].split("");
    data_number.forEach(function(value, idx, arr) {
      cell.append("<span class='number'>" + value + "</span>");
    });
    generated_number.text(
      digitSum(
        data_number[data_number.length - 1] +
          data_number[data_number.length - 2]
      )
    );
    row.append(cell).append(generated_number);
  }
  $("#paito > tbody").append(row);
}

function digitSum(number) {
  if (isNaN(number)) return "";
  if (number == 0) return 0;
  return number % 9 == 0 ? 9 : number % 9;
}

// Clear the canvas context using the canvas width and height
function clearCanvas(element) {
  var canvas = $(element)[0];
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// works out the X, Y position of the click inside the canvas from the X, Y position on the page
function getPosition(mouseEvent, sigCanvas) {
  var x, y;
  if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
    x = mouseEvent.pageX;
    y = mouseEvent.pageY;
  } else {
    x =
      mouseEvent.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    y =
      mouseEvent.clientY +
      document.body.scrollTop +
      document.documentElement.scrollTop;
  }

  return {
    X: x - sigCanvas.offsetLeft,
    Y: y - sigCanvas.offsetTop
  };
}

function draw() {
  var canvas = $("#draw")[0];
  var ctx = canvas.getContext("2d");
  clearCanvas("#draw");

  for (var i = 0; i < existingLines.length; ++i) {
    ctx.beginPath();
    var line = existingLines[i];
    var temp = ctx.strokeStyle;
    ctx.strokeStyle = line.color;
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.stroke();
    ctx.strokeStyle = temp;
  }

  if (isDrawing) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
  }
}

function onmousedown(e) {
  if (e.button === 0) {
    if (!isDrawing) {
      var position = getPosition(e, document.getElementById("draw"));
      startX = position.X;
      startY = position.Y;
      isDrawing = true;
    }
    draw();
  }
}

function onmouseup(e) {
  if (e.button === 0) {
    if (isDrawing) {
      existingLines.push({
        startX: startX,
        startY: startY,
        endX: mouseX,
        endY: mouseY,
        color: document.getElementById("draw").getContext("2d").strokeStyle
      });

      isDrawing = false;
    }

    draw();
  }
}

function onmousemove(e) {
  var position = getPosition(e, document.getElementById("draw"));
  mouseX = position.X;
  mouseY = position.Y;
  if (isDrawing) {
    draw();
  }
}

function init_drawing() {
  canvas = document.getElementById("draw");
  canvas.onmousedown = onmousedown;
  canvas.onmouseup = onmouseup;
  canvas.onmousemove = onmousemove;
  ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#4144f1";
  ctx.lineJoin = "round";
  ctx.lineWidth = 1.8;

  draw();
}

function get_data(market) {
  axios
    .get("data/" + market + ".json")
    .then(function(response) {
      $("#paito > tbody").empty();
      response.data.forEach(function(value) {
        addRow(value);
      });
      $("#draw")
        //.show()
        //.offset($("#paito > tbody").offset())
        .height($("#paito").height())
        .width($("#paito").width())
        .css({
          top: 0,
          left: 0,
          marginTop:
            -$("#paito").height() -
            $("#paito")
              .css("marginBottom")
              .replace(/[^-\d\.]/g, "")
        })
        .show();
      var ctx = $("#draw")[0].getContext("2d");
      ctx.canvas.height = $("#paito").height();
      ctx.canvas.width = $("#paito").width();
      init_drawing();
    })
    .catch(function(error) {
      console.log(error);
      $("#paito > tbody").empty();
      $("#draw").hide();
    })
    .then(function() {
      clearPaito();
    });
}

function clearPaito() {
  clearCanvas("#draw");
  $("#paito span.number").css("background-color", "");
  existingLines = [];
  numbersPressed = [];
}

var startX = 0;
var startY = 0;
var mouseX = 0;
var mouseY = 0;
var isDrawing = false;
var existingLines = [];
var numbersPressed = [];

$(function() {
  get_data("texas_day");
  $("#market_name").text("Texas Day");

  $("#clear_canvas").click(function() {
    clearPaito();
  });
  $("#undo_line").click(function() {
    existingLines.pop();
    draw();
  });
  $("#draw_toggle").click(function() {
    $(this)
      .children()
      .each(function() {
        $(this).toggle();
      });
    var zin = $("#paito").css("z-index");
    $("#paito").css("z-index", $("#draw").css("z-index"));
    $("#draw").css("z-index", zin);
  });
  $(".btn-color[data-color]").each(function() {
    $(this).css("background-color", this.dataset.color);
    $(this).click(function() {
      var canvas = $("#draw")[0];
      var ctx = canvas.getContext("2d");
      ctx.strokeStyle = this.dataset.color;
      $("#current_color").css("background-color", this.dataset.color);
    });
  });
  $("#paito").on("click", ".number", function() {
    numbersPressed.push($(this));
    $(this).css(
      "background-color",
      $("#current_color").css("background-color")
    );
  });
  $("button[data-market]").click(function() {
    $("#market_name").text($(this).text());
    get_data(this.dataset.market);
  });
});
