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

      this._onScrollEnd = () => {
        this._pendingIndex = null;
        this.onScroll();
      };
      this.$refs.viewport?.addEventListener('scrollend', this._onScrollEnd);

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
        if (this._anim) cancelAnimationFrame(this._anim);
        window.removeEventListener('resize', this._onResize);
        this.$refs.viewport?.removeEventListener('scrollend', this._onScrollEnd);
        this.$el.removeEventListener('keydown', this._onKeydown);
      };
    },

    cards() {
      const viewport = this.$refs.viewport;
      if (!viewport) return [];
      return [...viewport.querySelectorAll('.review-card')];
    },

    alignLeft(card) {
      const viewport = this.$refs.viewport;
      return card.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft;
    },

    measure() {
      const viewport = this.$refs.viewport;
      const cards = this.cards();
      if (!viewport || !cards.length) return;
      const stride = cards.length > 1
        ? this.alignLeft(cards[1]) - this.alignLeft(cards[0])
        : cards[0].offsetWidth;
      this._stride = Math.max(1, stride);
      this._visible = Math.max(1, Math.round(viewport.clientWidth / this._stride));
      this.pageCount = Math.max(1, Math.ceil(cards.length / this._visible));
      this._step = this._stride * this._visible;
    },

    nearestIndex() {
      const viewport = this.$refs.viewport;
      const cards = this.cards();
      if (!viewport || !cards.length) return 0;
      const current = viewport.scrollLeft;
      let index = 0;
      let best = Infinity;
      cards.forEach((card, i) => {
        const distance = Math.abs(this.alignLeft(card) - current);
        if (distance < best) {
          best = distance;
          index = i;
        }
      });
      return index;
    },

    lastPageIndex() {
      const viewport = this.$refs.viewport;
      const cards = this.cards();
      if (!viewport || !cards.length) return 0;
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      let index = 0;
      cards.forEach((card, i) => {
        if (this.alignLeft(card) <= maxScroll + 1) index = i;
      });
      return index;
    },

    scrollToCard(index) {
      const viewport = this.$refs.viewport;
      const cards = this.cards();
      if (!viewport || !cards.length) return;
      this.measure();
      const clamped = Math.max(0, Math.min(index, cards.length - 1));
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const target = Math.min(Math.max(0, this.alignLeft(cards[clamped])), maxScroll);
      this._pendingIndex = clamped;
      this._animateTo(target);
      this.pageIndex = Math.min(this.pageCount - 1, Math.floor(clamped / this._visible));
      this.pageLabel = `Page ${this.pageIndex + 1} of ${this.pageCount}`;
      this.canPrev = clamped > 0;
      this.canNext = clamped < this.lastPageIndex();
    },

    _animateTo(target) {
      const viewport = this.$refs.viewport;
      if (this._anim) cancelAnimationFrame(this._anim);
      // Chrome drops scrollTo({behavior:'smooth'}) on this mandatory snap
      // scroller, including while another smooth scroll is in flight.
      // An instant scrollLeft write lands on the snap point and sticks.
      viewport.style.scrollBehavior = 'auto';
      viewport.scrollLeft = target;
      this._pendingIndex = null;
      this.onScroll();
    },

    onScroll() {
      const viewport = this.$refs.viewport;
      if (!viewport) return;
      if (!this._step) this.measure();
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const left = viewport.scrollLeft;
      if (this._pendingIndex != null) {
        const card = this.cards()[this._pendingIndex];
        const target = card ? Math.min(Math.max(0, this.alignLeft(card)), maxScroll) : left;
        if (Math.abs(left - target) > 3) return;
        this._pendingIndex = null;
      }
      this.pageIndex = this._step
        ? Math.min(this.pageCount - 1, Math.round(left / this._step))
        : 0;
      this.canPrev = left > 4;
      this.canNext = left < maxScroll - 4;
      this.pageLabel = `Page ${this.pageIndex + 1} of ${this.pageCount}`;
    },

    goToPage(page) {
      this.measure();
      const clamped = Math.max(0, Math.min(page, this.pageCount - 1));
      this.scrollToCard(clamped * this._visible);
    },

    prev() {
      this.measure();
      const index = this._pendingIndex != null ? this._pendingIndex : this.nearestIndex();
      if (index <= 0) {
        this.scrollToCard(this.lastPageIndex());
      } else {
        this.scrollToCard(Math.max(0, index - this._visible));
      }
    },

    next() {
      this.measure();
      const index = this._pendingIndex != null ? this._pendingIndex : this.nearestIndex();
      const last = this.lastPageIndex();
      if (index >= last) {
        this.scrollToCard(0);
      } else {
        this.scrollToCard(Math.min(last, index + this._visible));
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
