var bounds = null;

var startX = 0;
var startY = 0;
var mouseX = 0;
var mouseY = 0;
var isDrawing = false;
var existingLines = [];

function draw() {
  var canvas = $("#draw")[0];
  var ctx = canvas.getContext("2d");

  ctx.beginPath();

  for (var i = 0; i < existingLines.length; ++i) {
    var line = existingLines[i];
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
  }

  ctx.stroke();

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
      startX = e.clientX - bounds.left;
      startY = e.clientY - bounds.top;

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
        endY: mouseY
      });

      isDrawing = false;
    }

    draw();
  }
}

function onmousemove(e) {
  mouseX = e.clientX - bounds.left;
  mouseY = e.clientY - bounds.top;

  if (isDrawing) {
    draw();
  }
}

function init_drawing() {
  canvas = document.getElementById("draw");
  canvas.onmousedown = onmousedown;
  canvas.onmouseup = onmouseup;
  canvas.onmousemove = onmousemove;

  bounds = canvas.getBoundingClientRect();
  ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#4144f1";
  ctx.lineJoin = "round";
  ctx.lineWidth = 1.5;

  draw();
}
