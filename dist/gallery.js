'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gallery = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.modulo = modulo;
exports.clamp = clamp;
exports.applyTransform = applyTransform;

var _swipedetector = require('swipedetector');

require('blissfuljs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.Bliss;

function modulo(p, q) {
  // A modulo function which actually returns a value with the sign of the
  // divisor.
  var remainder = p % q;
  if (q > 0) return (remainder + q) % q;else return (remainder - q) % q;
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function applyTransform(element, transform) {
  element.style.webkitTransform = element.style.MozTransform = element.style.msTransform = element.style.OTransform = element.style.transform = transform;
}

var Gallery = exports.Gallery = function () {
  function Gallery(element, options) {
    var _this = this;

    _classCallCheck(this, Gallery);

    this.element = element;
    this.slider = $('[data-slider]', this.element);
    this.slides = $.$('[data-slide]', this.element);
    this.thumbs = $.$('[data-thumb]', this.element);

    this.options = $.extend({
      interval: 5000,
      autoPlay: false
    }, options);

    this._current = null;
    this._interval = null;

    this._setWidthsAndPositions();
    this.reveal(0);

    this.thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function (e) {
        e.preventDefault();
        _this.autoPlay(false);
        _this.reveal(index);
      });
    });

    // add 'click' to left and right arrow
    $.$('[data-go]', this.element)._.addEventListener('click', function (e) {
      e.preventDefault();
      _this.autoPlay(false);
      _this.reveal(_this._current + parseInt(e.currentTarget.dataset.go, 10));
    });

    var events = new _swipedetector.SwipeDetector(this.element).emitter;
    events.on('left', function () {
      _this.autoPlay(false);
      _this.reveal(_this._current + 1);
    });
    events.on('right', function () {
      _this.autoPlay(false);
      _this.reveal(_this._current - 1);
    });

    window.addEventListener('resize', function () {
      _this._setWidthsAndPositions();
      _this.reveal(_this._current);
    });

    if (this.options.autoPlay) {
      this.autoPlay(true);
    }
  }

  _createClass(Gallery, [{
    key: 'move',
    value: function move(direction) {
      this.autoPlay(false);
      this.reveal(this._current + direction);
    }
  }, {
    key: 'autoPlay',
    value: function autoPlay(enable) {
      var _this2 = this;

      if (enable) {
        if (!this._interval) {
          this._interval = setInterval(function () {
            return _this2.reveal(_this2._current + 1);
          }, this.options.interval);
        }
      } else if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }
    }
  }, {
    key: 'reveal',
    value: function reveal(index) {
      this.thumbs[this._current] && this.thumbs[this._current].removeAttribute('data-current');
      this._current = modulo(index, this.slides.length);
      applyTransform(this.slider, 'translate3d(-' + this.width * this._current + 'px, 0, 0)');
      this.thumbs[this._current] && this.thumbs[this._current].setAttribute('data-current', '');
    }
  }, {
    key: '_setWidthsAndPositions',
    value: function _setWidthsAndPositions() {
      var _this3 = this;

      this.width = parseFloat(getComputedStyle(this.element).getPropertyValue('width'));
      this.slider.style.width = this.width * this.slides.length + 'px';
      this.slides.forEach(function (slide) {
        slide.style.width = _this3.width + 'px';
      });
    }
  }]);

  return Gallery;
}();