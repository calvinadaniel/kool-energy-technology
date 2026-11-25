(function () {
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

  // offsetTop ignores transforms, so this stays correct while entrance animations run.
  function layoutTop(el) {
    var top = 0;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    return top;
  }

  function scrollToAnchor(id) {
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    var margin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
    window.scrollTo({ top: layoutTop(target) - margin, behavior: 'instant' });
    target.focus({ preventScroll: true });
  }

  function isBoostedBodySwap(event) {
    return event.detail && event.detail.target === document.body;
  }

  function swapAnchor(event) {
    var pathInfo = event.detail.pathInfo;
    var anchor = pathInfo && pathInfo.anchor;
    return anchor && document.getElementById(anchor) ? anchor : null;
  }

  function onBoostedSwap(event) {
    if (!isBoostedBodySwap(event)) return;
    if (!swapAnchor(event)) restoreFocus();
    announceRoute();
  }

  function onBoostedSettle(event) {
    if (!isBoostedBodySwap(event)) return;
    var anchor = swapAnchor(event);
    if (!anchor) return;
    // Runs after htmx's own anchor scroll, which measures mid-animation positions.
    window.setTimeout(function () {
      scrollToAnchor(anchor);
    }, 0);
  }

  document.addEventListener('htmx:afterSwap', onBoostedSwap);
  document.addEventListener('htmx:afterSettle', onBoostedSettle);
  window.addEventListener('load', function () {
    if (location.hash) scrollToAnchor(decodeURIComponent(location.hash.slice(1)));
  });
})();
