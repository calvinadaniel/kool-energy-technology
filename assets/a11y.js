(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyReducedMotionVideo() {
    var videos = document.querySelectorAll('.hero-video');
    var i;
    for (i = 0; i < videos.length; i++) {
      if (reduceMotion.matches) {
        videos[i].pause();
        videos[i].removeAttribute('autoplay');
        videos[i].currentTime = 0;
      } else if (videos[i].paused) {
        videos[i].setAttribute('autoplay', '');
        videos[i].play().catch(function () {});
      }
    }
  }

  function restoreFocus() {
    var heading = document.querySelector('h1');
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }

  function announceRoute() {
    var live = document.getElementById('route-announcer');
    if (!live) {
      live = document.createElement('div');
      live.id = 'route-announcer';
      live.className = 'visually-hidden';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      document.body.insertBefore(live, document.body.firstChild);
    }
    live.textContent = '';
    window.setTimeout(function () {
      live.textContent = document.title;
    }, 50);
  }

  function onBoostedSwap(event) {
    if (!event.detail || event.detail.target !== document.body) return;
    applyReducedMotionVideo();
    restoreFocus();
    announceRoute();
  }

  document.addEventListener('htmx:afterSwap', onBoostedSwap);
  document.addEventListener('DOMContentLoaded', applyReducedMotionVideo);
  if (typeof reduceMotion.addEventListener === 'function') {
    reduceMotion.addEventListener('change', applyReducedMotionVideo);
  } else if (typeof reduceMotion.addListener === 'function') {
    reduceMotion.addListener(applyReducedMotionVideo);
  }
})();
