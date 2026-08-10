# Design System Specification: Commercial Industrial Excellence

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Blueprint"**
This design system moves away from the cluttered, "urgent" aesthetic of residential HVAC (heavy on bright yellows and stock photos of smiling technicians) toward a sophisticated, high-end commercial identity. The vision is "The Architectural Blueprint"—an experience defined by precision, structural depth, and corporate authority. 

We break the standard web template by utilizing **intentional asymmetry** and **tonal layering**. Layouts should feel engineered rather than decorated, using generous white space to signify premium service and overlapping elements to mimic the complexity of industrial HVAC systems.

---

## 2. Colors: Tonal Depth & Industrial Accents
Our palette is rooted in a "Deep Professional Blue" and "Bright Red," but we apply them with surgical precision to maintain a high-end feel.

### The Palette
- **Primary (`#112581`):** The foundation of authority. Used for hero backgrounds and heavy typographic elements.
- **Secondary (`#00658d`):** A sophisticated cyan-blue for technical details and sub-navigation.
- **Tertiary/Error (`#ba1a1a`):** Use sparingly. This red is not for "danger" but for "high-intensity focus"—limited to primary action buttons and critical status indicators.

### The "No-Line" Rule
To achieve a modern editorial look, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background shifts. For example, a `surface-container-low` section should transition directly into a `surface` section. This creates a seamless, fluid user journey that feels more like a high-end magazine than a generic website.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials:
- **Base Layer:** `surface` (`#fbf8ff`)
- **Inset Elements:** `surface-container-low` (`#f5f2fb`)
- **Elevated Cards:** `surface-container-lowest` (`#ffffff`) 
- **The Glass & Gradient Rule:** For floating navigation or mobile menus, use `surface_bright` with a 70% opacity and a `20px` backdrop-blur. Apply a subtle linear gradient from `primary` to `primary_container` on large hero buttons to give them a "machined" metallic finish.

---

## 3. Typography: Authoritative Precision
We use a dual-font strategy to balance industrial strength with modern readability.

- **Display & Headlines (Manrope):** Chosen for its geometric, technical structure. Large `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to feel like architectural signage.
- **Body & Labels (Inter):** The industry standard for clarity. Inter provides the "Modern" feel requested, ensuring technical specifications and service details are highly legible.

**Typographic Hierarchy:**
- **Display-LG:** Editorial hero statements.
- **Headline-MD:** Service categories and section headers.
- **Label-MD:** Technical data points and "all-caps" sub-headers to convey "Industrious" reliability.

---

## 4. Elevation & Depth
In this system, depth is a tool for organization, not just decoration.

### The Layering Principle
Depth is achieved by stacking surface tiers. To make a "Request Service" card pop, do not use a border; place the `surface-container-lowest` card on a `surface-container-high` background.

### Ambient Shadows
Shadows must mimic natural light filtering through a commercial skylight.
- **Standard Lift:** `0px 12px 32px rgba(27, 27, 33, 0.06)`. 
- The shadow color is a tinted version of `on-surface`, never pure black, ensuring the shadow feels like a natural extension of the UI.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use a **Ghost Border**: `outline-variant` (`#c6c5d4`) at **15% opacity**. It should be barely felt, only sensed.

---

## 5. Components

### Primary CTA: "Request Service"
- **Style:** `primary` background with a subtle gradient to `primary_container`.
- **Shape:** `md` roundedness (0.375rem) to maintain a crisp, professional edge.
- **Hover:** Shift to `secondary` to signify technical readiness.
- **Typography:** `label-md` in all-caps with 0.05em tracking.

### Service Cards
- **Construction:** Use `surface-container-lowest` on a `surface` background.
- **Layout:** Forbid the use of divider lines. Use `1.5rem` of vertical padding and `title-md` for headers.
- **Interaction:** On hover, the card should scale slightly (1.02) and the shadow opacity should increase from 6% to 10%.

### Instagram Feed Gallery (The "Industrial Grid")
- **Layout:** An asymmetric masonry grid. Avoid the standard 3-column square grid.
- **Styling:** Images should have `0.25rem` (DEFAULT) roundedness.
- **Overlay:** A semi-transparent `primary` gradient overlay on hover, revealing the caption in `label-sm` (Inter, White).

### Input Fields
- **States:** Use `surface-container-highest` for the field background.
- **Focus:** Instead of a thick border, use a 2px bottom-bar in `secondary`.

---

## 6. Do's and Don'ts

### Do
- **DO** use heavy typographic contrast (e.g., a huge `display-md` next to a small `label-md`).
- **DO** use the Red (`tertiary`) only for the final conversion point (The "Request Service" button).
- **DO** leverage "Blue-on-Blue" layering (Primary container on a Primary background) for technical specification blocks.

### Don't
- **DON'T** use 100% black text; use `on-surface` (`#1b1b21`) for a softer, premium contrast.
- **DON'T** use rounded corners above `0.75rem` (xl). Anything "pill-shaped" feels too consumer/residential. Keep it sharp and industrious.
- **DON'T** use stock photography of families. Focus on macro shots of HVAC hardware, steel, and blueprints to reinforce the commercial/corporate focus.