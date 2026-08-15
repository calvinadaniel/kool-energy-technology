/**
 * LightWidget Instagram feed
 *
 * After connecting @koolenergytechnology at https://lightwidget.com
 * (Business/Creator + Graph API connection), paste the widget hash here.
 * Embed URL …/widgets/abc123.html → id is "abc123"
 */
window.KOOL_LIGHTWIDGET_ID = '6aa6d08f75965e87bb64ec8979329053';

(function () {
  function mountFeed() {
    var mount = document.getElementById('instagram-feed');
    if (!mount || mount.getAttribute('data-mounted') === '1') return;

    var id = String(window.KOOL_LIGHTWIDGET_ID || '').trim();
    if (!id) {
      mount.innerHTML =
        '<div class="instagram-feed-pending">' +
        '<p>Connect the live Instagram feed: create a grid widget at ' +
        '<a href="https://lightwidget.com/" target="_blank" rel="noopener">LightWidget</a> ' +
        'with <strong>@koolenergytechnology</strong> (Business/Creator), then set ' +
        '<code>KOOL_LIGHTWIDGET_ID</code> in <code>assets/instagram-feed.js</code>.</p>' +
        '<a class="btn-primary inline-block mt-4" href="https://www.instagram.com/koolenergytechnology/" ' +
        'target="_blank" rel="noopener">View posts on Instagram</a>' +
        '</div>';
      mount.setAttribute('data-mounted', '1');
      return;
    }

    var frame = document.createElement('iframe');
    frame.className = 'lightwidget-widget';
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('allowtransparency', 'true');
    frame.setAttribute('title', 'Kool Energy Technology on Instagram');
    frame.style.cssText = 'width:100%;border:0;overflow:hidden;min-height:28rem;';
    mount.innerHTML = '';
    mount.appendChild(frame);
    mount.setAttribute('data-mounted', '1');

    var widgetUrl = 'https://cdn.lightwidget.com/widgets/' + encodeURIComponent(id) + '.html';
    var existing = document.querySelector('script[src*="lightwidget.js"]');

    function setSrc() {
      if (!frame.getAttribute('src')) frame.src = widgetUrl;
    }

    function loadWhenVisible() {
      if (!('IntersectionObserver' in window)) {
        setSrc();
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            io.disconnect();
            setSrc();
            break;
          }
        }
      }, { rootMargin: '120px 0px', threshold: 0.01 });
      io.observe(frame);
    }

    if (existing) {
      loadWhenVisible();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
    script.onload = loadWhenVisible;
    script.onerror = loadWhenVisible;
    document.head.appendChild(script);
  }

  mountFeed();
  document.body.addEventListener('htmx:afterSettle', mountFeed);
})();
