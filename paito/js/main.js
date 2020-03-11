/* // works out the X, Y position of the click inside the canvas from the X, Y position on the page
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

function init_drawing() {
  var canvas = "draw";
  // get references to the canvas element as well as the 2D drawing context
  var sigCanvas = $("#" + canvas)[0];
  var context = sigCanvas.getContext("2d");
  context.strokeStyle = "#4144f1";
  context.lineJoin = "round";
  context.lineWidth = 1.5;

  // This will be defined on a TOUCH device such as iPad or Android, etc.
  var is_touch_device = "ontouchstart" in document.documentElement;

  if (is_touch_device) {
    // create a drawer which tracks touch movements
    var drawer = {
      isDrawing: false,
      touchstart: function(coors) {
        context.beginPath();
        context.moveTo(coors.x, coors.y);
        this.isDrawing = true;
      },
      touchmove: function(coors) {
        if (this.isDrawing) {
          context.lineTo(coors.x, coors.y);
          context.stroke();
        }
      },
      touchend: function(coors) {
        if (this.isDrawing) {
          this.touchmove(coors);
          this.isDrawing = false;
        }
      }
    };

    // create a function to pass touch events and coordinates to drawer
    function draw(event) {
      // get the touch coordinates.  Using the first touch in case of multi-touch
      var coors = {
        x: event.targetTouches[0].pageX,
        y: event.targetTouches[0].pageY
      };

      // Now we need to get the offset of the canvas location
      var obj = sigCanvas;

      if (obj.offsetParent) {
        // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
        do {
          coors.x -= obj.offsetLeft;
          coors.y -= obj.offsetTop;
        } while (
          // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
          // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
          (obj = obj.offsetParent) != null
        );
      }

      // pass the coordinates to the appropriate handler
      drawer[event.type](coors);
    }

    // attach the touchstart, touchmove, touchend event listeners.
    sigCanvas.addEventListener("touchstart", draw, false);
    sigCanvas.addEventListener("touchmove", draw, false);
    sigCanvas.addEventListener("touchend", draw, false);

    // prevent elastic scrolling
    sigCanvas.addEventListener(
      "touchmove",
      function(event) {
        event.preventDefault();
      },
      false
    );
  } else {
    // start drawing when the mousedown event fires, and attach handlers to
    // draw a line to wherever the mouse moves to
    $("#" + canvas).mousedown(function(mouseEvent) {
      var position = getPosition(mouseEvent, sigCanvas);
      context.moveTo(position.X, position.Y);
      context.beginPath();
      // attach event handlers
      $(this)
        .mousemove(function(mouseEvent) {
          drawLine(mouseEvent, sigCanvas, context);
        })
        .mouseup(function(mouseEvent) {
          finishDrawing(mouseEvent, sigCanvas, context);
        })
        .mouseout(function(mouseEvent) {
          finishDrawing(mouseEvent, sigCanvas, context);
        });
    });
  }
}

// draws a line to the x and y coordinates of the mouse event inside
// the specified element using the specified context
function drawLine(mouseEvent, sigCanvas, context) {
  var position = getPosition(mouseEvent, sigCanvas);

  context.lineTo(position.X, position.Y);
  context.stroke();
}

// draws a line from the last coordiantes in the path to the finishing
// coordinates and unbind any event handlers which need to be preceded
// by the mouse down event
function finishDrawing(mouseEvent, sigCanvas, context) {
  // draw the line to the finishing coordinates
  drawLine(mouseEvent, sigCanvas, context);
  context.closePath();
  // unbind any events which could draw
  $(sigCanvas)
    .unbind("mousemove")
    .unbind("mouseup")
    .unbind("mouseout");
}

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
*/

function addRow(data) {
  var row = $("<tr>");
  for (var i = 0; i < 7; i++) {
    var cell = $("<td>");
    var generated_number = $("<td>").addClass("text-muted");
    data[i].split("").forEach(function(value, idx, arr) {
      cell.append("<span class='number'>" + value + "</span>");
      if (idx == arr.length - 1) {
        //generated_number.text(digitSum(arr[idx] + arr[idx - 1]));
      }
    });
    row.append(cell).append(generated_number);
  }
  $("#paito > tbody").append(row);
}

function digitSum(number) {
  if (isNaN(number)) return "";
  if (number == 0) return 0;
  return number % 9 == 0 ? 9 : number % 9;
}

$(function() {
  axios
    .get("data/texas_day.json")
    .then(function(response) {
      response.data.forEach(function(value) {
        addRow(value);
      });
      $("#draw")
        .show()
        //.offset($("#paito > tbody").offset())
        .height($("#paito").height())
        .width($("#paito").width())
        .css({ top: 0, left: 0, marginTop: -$("#paito").height() })
        .hide();
      var ctx = $("#draw")[0].getContext("2d");
      ctx.canvas.height = $("#paito > tbody").height();
      ctx.canvas.width = $("#paito > tbody").width();
      //init_drawing();
    })
    .catch(function(error) {
      console.log(error);
    });
  $("#clear_canvas").click(function() {
    var canvas = $("#draw")[0];
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $("#paito span.number").css("background-color", "");
  });
  $("#draw_toggle").click(function() {
    $(this)
      .children()
      .each(function() {
        $(this).toggle();
      });
    $("#draw").toggle();
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
    $(this).css(
      "background-color",
      $("#current_color").css("background-color")
    );
  });
});
