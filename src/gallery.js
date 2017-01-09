import {SwipeDetector} from 'swipedetector';
import 'blissfuljs';
const $ = window.Bliss;

export function modulo(p, q) {
  // A modulo function which actually returns a value with the sign of the
  // divisor.
  let remainder = p % q;
  if (q > 0) return (remainder + q) % q;
  else return (remainder - q) % q;
}

export function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

export function applyTransform(element, transform) {
  element.style.webkitTransform =
  element.style.MozTransform =
  element.style.msTransform =
  element.style.OTransform =
  element.style.transform = transform;
}

export class Gallery {
  constructor(element) {
    this.element = element;
    this.slider = $('[data-slider]', this.element);
    this.slides = $.$('[data-slide]', this.element);
    this.thumbs = $.$('[data-thumb]', this.element);
    this._current = null;
    this._interval = null;

    this._setWidthsAndPositions();
    this.reveal(0);

    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        this.autoPlay(false);
        this.reveal(index);
      });
    });

    // add 'click' to left and right arrow
    $.$('[data-go]', this.element)._.addEventListener('click', (e) => {
      e.preventDefault();
      this.autoPlay(false);
      this.reveal(this._current + parseInt(e.currentTarget.dataset.go, 10));
    });

    let events = new SwipeDetector(this.element).emitter;
    events.on('left', () => {
      this.autoPlay(false);
      this.reveal(this._current + 1);
    });
    events.on('right', () => {
      this.autoPlay(false);
      this.reveal(this._current - 1);
    });

    window.addEventListener('resize', () => {
      this._setWidthsAndPositions();
      this.reveal(this._current);
    });
  }

  move(direction) {
    this.autoPlay(false);
    this.reveal(this._current + direction);
  }

  autoPlay(enable) {
    if (enable) {
      if (!this._interval) {
        this._interval = setInterval(
          () => this.reveal(this._current + 1),
          5000);
      }
    } else if(this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  reveal(index) {
    this.thumbs[this._current] && this.thumbs[this._current].removeAttribute('data-current');
    this._current = modulo(index, this.slides.length);
    applyTransform(this.slider, `translate3d(-${this.width * this._current}px, 0, 0)`);
    this.thumbs[this._current] && this.thumbs[this._current].setAttribute('data-current', '');
  }

  _setWidthsAndPositions() {
    this.width = parseFloat(getComputedStyle(this.element).getPropertyValue('width'));
    this.slider.style.width = `${this.width * this.slides.length}px`;
    this.slides.forEach(slide => {
      slide.style.width = `${this.width}px`;
    });
  }
}
