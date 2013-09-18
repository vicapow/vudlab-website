(function() {
  var requestAnimationFrame = window.requestAnimationFrame 
    || window.mozRequestAnimationFrame 
    || window.webkitRequestAnimationFrame 
    || window.msRequestAnimationFrame
  window.requestAnimationFrame = requestAnimationFrame
})()
