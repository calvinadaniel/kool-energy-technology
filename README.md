# Kool Energy Technology — Website Mockup

Commercial HVAC marketing site under the Architectural Blueprint design system.

## Live site

GitHub Pages: https://calvinadaniel.github.io/kool-energy-technology/

Latest release: [v1.1.0](https://github.com/calvinadaniel/kool-energy-technology/releases/tag/v1.1.0)

## Local preview

```bash
npx live-server
```

Open the URL shown in the terminal (usually `http://127.0.0.1:8080`).

## Pages

| Path | Page |
|---|---|
| `/` | Home |
| `/services/` | Services |
| `/about/` | About |
| `/instagram/` | Instagram |
| `/service-request/` | Service Request |

## Tech stack

- Tailwind CSS v3 (CDN)
- HTMX 1.9 (CDN)
- Alpine.js 3.x (CDN)
- Google Fonts: Manrope + Inter
- Custom CSS: `assets/style.css`
- Instagram feed: [LightWidget](https://lightwidget.com/) (`assets/instagram-feed.js`)

## Instagram feed (LightWidget)

The `/instagram/` page embeds a LightWidget grid. Meta deprecated the Basic Display API, so the account owner must authorize LightWidget once:

1. Convert [@koolenergytechnology](https://www.instagram.com/koolenergytechnology/) to a **Professional** account (Business or Creator) if it is not already.
2. Create a free account at [lightwidget.com](https://lightwidget.com/) and connect Instagram with the **business / Graph API** connection (not the old consumer connection).
3. Create a **grid** widget (~9–12 posts, minimal chrome).
4. Copy the widget hash from the embed URL (`…/widgets/WIDGET_ID.html`) into `assets/instagram-feed.js`:

```js
window.KOOL_LIGHTWIDGET_ID = 'WIDGET_ID';
```

Until that ID is set, the page shows a short setup note and a link to the Instagram profile.
