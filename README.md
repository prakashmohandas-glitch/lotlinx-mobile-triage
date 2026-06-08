# Lotlinx Mobile — Inventory Triage (built app)

Runnable build of the approved **Dossier Split (Layout B)** direction from the design
handoff. Single-phone, full flow, production-intent — the prototype's 3-up comparison and
the live "Tweaks" panel are removed and the demo defaults are baked in as design decisions.

## Run

No build step. Serve the folder over HTTP and open it:

```bash
cd lotlinx-mobile
python3 -m http.server 4137
# open http://localhost:4137
```

(Opening `index.html` via `file://` won't work — the `<script type="text/babel" src>` files
must be fetched over HTTP.)

## Flow

1. **Today** dashboard — hero KPI, three mini-KPIs, inventory-movement cards, sticky CTA.
   Tap the CTA or swipe it up to enter the deck.
2. **Swipe deck** — one card per VIN. **Swipe left = snooze**, **swipe right = take the
   recommended action**, or tap one of the four action buttons for a specific action.
   Header shows progress; the undo button (top-right) reverts the last decision.
3. **All caught up** — tallies actions vs. snoozes with a per-action breakdown.

## Structure

| File | Responsibility |
|---|---|
| `index.html` | Fonts, global styles, responsive phone frame, script loading |
| `app/data.jsx` | Health palette, action catalog, KPIs, inventory movement, 8 seed vehicles |
| `app/atoms.jsx` | Logo, Chevron, action icons, delta pill, health pill/dot, transition row |
| `app/parts.jsx` | The vehicle card (Dossier B) + its pieces (photo, evidence chips, rec, actions) |
| `app/kpi.jsx` | "Today" dashboard |
| `app/deck.jsx` | Swipe engine, drag overlays, toast, undo, summary |
| `app/app.jsx` | Screen shell (KPI ⇄ deck slide transition) + mount |

## Baked-in design decisions (were tweakable in the prototype)

photo band **40%** · health marker **top bar** · evidence **chips** · headline **plain** ·
VIN detail row **on** · actions **row of 4** · accent **brand red `#ED1C2E`** ·
card radius **24px** · bottom bar **swipe-only**.

## Production TODO (placeholders to wire up)

- **Data:** replace `app/data.jsx` figures with live inventory + media APIs.
- **Photos:** swap the Unsplash placeholders for real VIN photography (striped
  "VEHICLE PHOTO" fallback already handles load failures).
- **Logo:** replace the CSS lockup in `Logo` with the official Lotlinx SVG.
- **Icons:** swap the inline SVGs for the codebase's icon set.
- **Toolchain:** this uses in-browser Babel for zero-setup parity with the handoff. For
  production, port these components into the app's real React build (precompiled JSX) —
  the component boundaries here map 1:1.
