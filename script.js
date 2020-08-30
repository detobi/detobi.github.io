
window.onload=function(){
	var merrywrap=document.getElementById("merrywrap")
	var box=document.getElementsByClassName("giftbox")[0];	
  var step=1;
  var stepMinutes=[2000,2000,1000,1000];
  function init(){
		box.addEventListener("touchstart",openBox,false);
		box.addEventListener("mousedown",openBox,false); 
		box.addEventListener("touchstart", handleEvent);
		box.addEventListener("mousedown", handleEvent);
  }
  function stepClass(step){
    merrywrap.className='merrywrap';
    merrywrap.className='merrywrap step-'+step;
  }
  function openBox(){
    if(step===1){
	  box.removeEventListener("touchstart",openBox,false);
    box.removeEventListener("mousedown",openBox,false);
    var card = document.getElementsByClassName("card");
  
    var cardAnimation = anime({
    targets: card,
    opacity: 1,
    duration: 200,
    delay: 2150
  });
 
    }  
    stepClass(step); 
    if(step===3){ 
    } 
    if(step===4){
        reveal();
       return;
    }     
    setTimeout(openBox,stepMinutes[step-1]);
    step++;  
  }
   
  init();
}


var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cH;
var cW;
var bgColor = "#bcd9ff";
var animations = [];
var circles = [];


function removeAnimation(animation) {
  var index = animations.indexOf(animation);
  if (index > -1) animations.splice(index, 1);
  box.removeEventListener("touchstart", handleEvent);
	box.removeEventListener("mousedown", handleEvent);
}

function calcPageFillRadius(x, y) {
  var l = Math.max(cW / 2 - 0, cW / 2);
  var h = Math.max(cH / 2 - 0, cH / 2);
  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function handleEvent(e) {
    if (e.touches) { 
      e.preventDefault();
      e = e.touches[0];
    }
    var currentColor = "#bcd9ff";
    var nextColor = "#ae68cc";
    var targetR = calcPageFillRadius(cW / 2, cH / 2);
    var rippleSize = Math.min(200, (cW * .4));
    var minCoverDuration = 750;
    
    var pageFill = new Circle({
      x: cW / 2,
      y: cH / 2,
      r: 0,
      fill: nextColor
    });
    var fillAnimation = anime({
      targets: pageFill,
      r: targetR,
      duration:  Math.max(targetR / 2 , minCoverDuration ),
	  easing: "easeOutQuart",
	  delay: 2100,
      complete: function(){
        bgColor = pageFill.fill;
        removeAnimation(fillAnimation);
      }
    });
    
    var ripple = new Circle({
      x: cW / 2,
      y: cH / 2,
      r: 0,
      fill: currentColor,
      stroke: {
        width: 3,
        color: currentColor
      },
      opacity: 1
    });
    var rippleAnimation = anime({
      targets: ripple,
      r: rippleSize,
      opacity: 0,
      easing: "easeOutExpo",
	  duration: 900,
	  delay: 2100,
      complete: removeAnimation
    });
    
    var particles = [];
    for (var i=0; i<32; i++) {
      var particle = new Circle({
        x: cW / 2,
        y: cH / 2,
        fill: currentColor,
        r: anime.random(24, 48)
      })
      particles.push(particle);
    }
    var particlesAnimation = anime({
      targets: particles,
      x: function(particle){
        return particle.x + anime.random(rippleSize, -rippleSize);
      },
      y: function(particle){
        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
      },
      r: 0,
      easing: "easeOutExpo",
	  duration: anime.random(1000,1300),
	  delay: 2100,
      complete: removeAnimation
    });
    animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

function extend(a, b){
  for(var key in b) {
    if(b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

var Circle = function(opts) {
  extend(this, opts);
}

Circle.prototype.draw = function() {
  ctx.globalAlpha = this.opacity || 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.stroke) {
    ctx.strokeStyle = this.stroke.color;
    ctx.lineWidth = this.stroke.width;
    ctx.stroke();
  }
  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  ctx.closePath();
  ctx.globalAlpha = 1;
}

var animate = anime({
  duration: Infinity,
  delay: 2100,
  update: function() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cW, cH);
    animations.forEach(function(anim) {
      anim.animatables.forEach(function(animatable) {
        animatable.target.draw();
      });
    });
  }
});

var resizeCanvas = function() {
  cW = window.innerWidth;
  cH = window.innerHeight;
  c.width = cW * devicePixelRatio;
  c.height = cH * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
};

(function init() {
  resizeCanvas();
  if (window.CP) {
    // CodePen's loop detection was causin' problems
    // and I have no idea why, so...
    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
  }
  window.addEventListener("resize", resizeCanvas);
  addClickListeners();
  if (!!window.location.pathname.match(/fullcpgrid/)) {
    startFauxClicking();
  }
})();
