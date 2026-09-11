function reviewsCarousel() {
  return {
    pageIndex: 0,
    pageCount: 1,
    canPrev: false,
    canNext: true,
    pageLabel: '',
    timer: null,
    reducedMotion: false,

    init() {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.measure();
      this.onScroll();
      this.resume();

      this._onResize = () => {
        this.measure();
        this.onScroll();
      };
      window.addEventListener('resize', this._onResize);

      this._onKeydown = (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      };
      this.$el.addEventListener('keydown', this._onKeydown);

      return () => {
        this.pause();
        window.removeEventListener('resize', this._onResize);
        this.$el.removeEventListener('keydown', this._onKeydown);
      };
    },

    measure() {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      const card = viewport.querySelector('.review-card');
      if (!card) return;
      const styles = getComputedStyle(viewport.querySelector('.reviews-track'));
      const gap = parseFloat(styles.columnGap || styles.gap) || 20;
      const visible = Math.max(
        1,
        Math.round((viewport.clientWidth + gap) / (card.offsetWidth + gap))
      );
      const total = viewport.querySelectorAll('.review-card').length;
      this.pageCount = Math.max(1, Math.ceil(total / visible));
      this._step = (card.offsetWidth + gap) * visible;
    },

    onScroll() {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      if (!this._step) this.measure();
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const left = viewport.scrollLeft;
      this.pageIndex = this._step
        ? Math.min(this.pageCount - 1, Math.round(left / this._step))
        : 0;
      this.canPrev = left > 4;
      this.canNext = left < maxScroll - 4;
      this.pageLabel = `Page ${this.pageIndex + 1} of ${this.pageCount}`;
    },

    scrollToPage(page) {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      this.measure();
      const clamped = Math.max(0, Math.min(page, this.pageCount - 1));
      const target = clamped * this._step;
      viewport.scrollTo({
        left: target,
        behavior: this.reducedMotion ? 'auto' : 'smooth',
      });
      this.pageIndex = clamped;
      this.pageLabel = `Page ${this.pageIndex + 1} of ${this.pageCount}`;
      this.canPrev = this.pageIndex > 0;
      this.canNext = this.pageIndex < this.pageCount - 1;
    },

    goToPage(page) {
      this.scrollToPage(page);
    },

    prev() {
      if (this.pageIndex <= 0) {
        this.scrollToPage(this.pageCount - 1);
      } else {
        this.scrollToPage(this.pageIndex - 1);
      }
    },

    next() {
      if (this.pageIndex >= this.pageCount - 1) {
        this.scrollToPage(0);
      } else {
        this.scrollToPage(this.pageIndex + 1);
      }
    },

    pause() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    resume() {
      this.pause();
      if (this.reducedMotion) return;
      this.timer = setInterval(() => this.next(), 7000);
    },
  };
}

window.reviewsCarousel = reviewsCarousel;
