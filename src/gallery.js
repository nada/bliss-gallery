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
  constructor(element, options) {
    this.element = element;
    this.slider = $('[data-slider]', this.element);
    this.slides = $.$('[data-slide]', this.element);
    this.thumbsContainer = $('[data-thumbs]', this.element);
    this.playPause = $('[data-playpause]', this.element);

    this.options = $.extend({
      interval: 5000,
      autoPlay: true,
      createThumbs: true,
    }, options);

    this._current = null;
    this._interval = null;

    this._setWidthsAndPositions();

    this.element.dataset.hideControls = (this.slides.length <= 1);

    this.options.createThumbs && this._createThumbs();

    this.thumbs = $.$('[data-thumb]', this.element);

    this._setEventListeners();

    this.reveal(0);

    this.autoPlay = this.options.autoPlay;
  }

  move(direction) {
    this.autoPlay = false;
    this.reveal(this._current + direction);
  }

  get autoPlay() {
    return (this._interval != null);
  }

  set autoPlay(enable) {
    if (enable) {
      this.element.dataset.playing = true;
      if (!this._interval) {
        this._interval = setInterval(
          () => this.reveal(this._current + 1),
          this.options.interval);
      }
    } else {
      this.element.dataset.playing = false;
      if(this._interval) {
       clearInterval(this._interval);
       this._interval = null;
     }
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

  _setEventListeners() {
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        this.autoPlay = false;
        this.reveal(index);
      });
    });

    // add 'click' to left and right arrow
    $.$('[data-go]', this.element)._.addEventListener('click', (e) => {
      e.preventDefault();
      this.autoPlay = false;
      this.reveal(this._current + parseInt(e.currentTarget.dataset.go, 10));
    });

    this.playPause && this.playPause.addEventListener('click', (e) => {
      e.preventDefault();
      this.autoPlay = !this.autoPlay;
    });

    let events = new SwipeDetector(this.element).emitter;
    events.on('left', () => {
      this.autoPlay = false;
      this.reveal(this._current + 1);
    });
    events.on('right', () => {
      this.autoPlay = false;
      this.reveal(this._current - 1);
    });

    window.addEventListener('resize', () => {
      this._setWidthsAndPositions();
      this.reveal(this._current);
    });
  }

  _createThumbs() {
    if (this.thumbsContainer) {
      if (this.slides.length > 1) {
        this.slides.forEach(() => {
          this.thumbsContainer.appendChild($.create({
            tag: 'a',
            href: '',
            'data-thumb': '',
          }));
        });
      }
    } else {
      console.warn('bliss-gallery: no element with [data-thumbs] found.');
    }

  }
}
