(function (angular) {
'use strict';	

angular.module('angularEvent', [])

.directive('snow', function($window) {
  return {    
    restrict: 'AE',
    link: function (scope, element) {
      var WIDTH, HEIGHT, con, g;
      var pxs = [];
      var rint = 50;
      var nb_elts = 100;
      var requestAnimationFrame = window.requestAnimationFrame ||
                          window.mozRequestAnimationFrame ||
                          window.webkitRequestAnimationFrame ||
                          window.msRequestAnimationFrame;
      var canvas = document.createElement("canvas");
      

      var wrapper = element.wrap("<div style='position: relative;'></div>");
      wrapper.after(canvas);

      var windowSize = function() {
        WIDTH = element[0].offsetWidth;
        HEIGHT = element[0].offsetHeight;
        canvas.setAttribute('width', WIDTH);
        canvas.setAttribute('height', HEIGHT);
      };

      canvas.setAttribute('style', "position: absolute; top:0px; left:0px");

      windowSize();

      $window.addEventListener("resize", function() {
         windowSize();
      });

      con = canvas.getContext('2d');
      for (var i = 0; i < nb_elts; i++) {
          pxs[i] = new Circle();
          pxs[i].reset();
      }
      requestAnimationFrame(draw);
      function draw() {
        con.clearRect(0, 0, WIDTH, HEIGHT);
        con.globalCompositeOperation = "lighter";
        for (var i = 0; i < pxs.length; i++) {
            pxs[i].fade();
            pxs[i].move();
            pxs[i].draw();
        }
        requestAnimationFrame(draw);
      }

      function Circle() {
        this.s = {ttl: 15000,xmax: 1,ymax: 2,rmax: 5,rt: 1,xdef: 960,ydef: 540,xdrift: 4,ydrift: 4,random: true,blink: true, yspeed: (Math.random() * 3) + 1};
        this.reset = function() {
            this.x = (this.s.random ? WIDTH * Math.random() : this.s.xdef);  // init pos X
            this.y = (this.s.random ? HEIGHT * Math.random() : this.s.ydef); // init pos Y
            this.r = ((this.s.rmax - 1) * Math.random()) + 1; // radius
            this.dx = (Math.random() * this.s.xmax) * (Math.random() < 0.5 ? -1 : 1); // move X
            this.dy = (Math.random() * this.s.ymax) * (Math.random() < 0.5 ? -1 : 1); // move Y
            this.hl = (this.s.ttl / rint) * (this.r / this.s.rmax);
            this.rt = Math.random() * this.hl;
            this.s.rt = Math.random() + 1;
            this.stop = Math.random() * 0.2 + 0.4;
            this.s.xdrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
            this.s.ydrift *= Math.random() * (Math.random() < 0.5 ? -1 : 1);
            this.yspeed = (Math.random() * 3) + 1;
        };
        this.fade = function() {
            this.rt += this.s.rt;
        };
        this.draw = function() {
            if (this.s.blink && (this.rt <= 0 || this.rt >= this.hl))
                this.s.rt = this.s.rt * -1;
            else if (this.rt >= this.hl)
                this.reset();
            var newo = 1 - (this.rt / this.hl);
            con.beginPath();
            con.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            con.closePath();
            var cr = this.r * newo;
            g = con.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
            g.addColorStop(0.0, 'rgba(249,254,254,' + newo + ')');
            g.addColorStop(this.stop, 'rgba(249,254,254,' + (newo * 0.2) + ')');
            g.addColorStop(1.0, 'rgba(249,254,254,0)');
            con.fillStyle = "rgb(249,254,254)";
            con.fill();
        };

        this.move = function() {
            this.x += (this.rt / this.hl) * this.dx;
            this.y += this.yspeed;//+= (this.rt / this.hl) * this.dy;
            if (this.x > WIDTH || this.x < 0)
                this.dx *= -1;
            if (this.y > HEIGHT || this.y < 0)
                this.y = 0;
        };
      }
    }
  };
});


})(angular);
