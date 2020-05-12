function resizeIFrameToFitContent() {
  var iFrame = document.getElementById("caramaintogel");
  iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
  iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}

window.addEventListener("DOMContentLoaded", (event) => {
  window.addEventListener("resize", resizeIFrameToFitContent);
  document.getElementById("caramaintogel").onload = resizeIFrameToFitContent;
  resizeIFrameToFitContent();
});
