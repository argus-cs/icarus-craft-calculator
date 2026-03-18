# Icarus HUD Visual Redesign

**Goal:** Reskin the Icarus Craft Calculator to match the in-game HUD aesthetic (inventory, crafting, mission briefing screens) while keeping all existing layout, navigation, and functionality intact.

**Scope:** CSS/visual only. No layout changes, no navigation changes, no logic changes.

**Reference:** Icarus in-game UI (inventory screen, crafting menu, mission briefing).

---

## Color Palette

Replace the current dark blue + amber theme with the game's military green + khaki gold.

| Token | Current | New | Usage |
|-------|---------|-----|-------|
| --color-bg-primary | #0f172a | #1c2118 | Page background |
| --color-bg-card | #1e293b | rgba(0,0,0,0.35) | Card/panel backgrounds |
| --color-bg-input | #334155 | rgba(30,35,22,0.8) | Input fields, icon slots |
| --color-border | #334155 | rgba(140,135,60,0.2) | Default borders |
| --color-border-active | (new) | rgba(140,135,60,0.5) | Active/prominent borders |
| --color-accent | #fbbf24 | #c8c070 | Primary accent (quantities, labels, active states) |
| --color-text-primary | #f1f5f9 | #d0cc90 | Primary text |
| --color-text-secondary | #94a3b8 | rgba(140,135,60,0.5) | Secondary text |
| --color-text-muted | #64748b | rgba(140,135,60,0.35) | Muted/disabled text |
| --color-select | (new) | rgba(80,180,220,0.6) | Selected item border (cyan) |
| --color-select-bg | (new) | rgba(80,180,220,0.08) | Selected item background |

## Typography

- **Section labels** (REQUIRED ELEMENTS, CRAFTING STATION, category tabs): uppercase, letter-spacing: 1-1.5px, font-weight: 700, font-size: 10-11px
- **Item names**: font-weight: 600-700, standard case
- **Tier/category subtext**: uppercase, letter-spacing: 0.8px, muted color
- **Font family**: system-ui (same as current)

## Visual Elements

### Border Radius
Remove all border-radius. The game UI uses sharp corners exclusively.
- All components: `border-radius: 0`

### Section Headers
Replace plain text labels with olive gradient bar (like MISSION SETTINGS in the game):
```
background: linear-gradient(90deg, rgba(140,135,60,0.3) 0%, rgba(140,135,60,0.05) 100%);
padding: 5px 10px;
```
Applied to: "MATERIAIS NECESSARIOS", "ESTACAO DE CRAFT" labels in ItemDetail, MaterialDrawer.

### Corner Brackets
Add corner accent marks on key panels (like mission briefing panels):
```
position: relative with ::before/::after pseudo-elements
width: 7px, height: 7px
border: 2px solid rgba(140,135,60,0.5)
```
Applied to: Item info panel in ItemDetail and MaterialDrawer header.

### Icon Slots
Style icon containers like game inventory slots:
```
background: rgba(30,35,22,0.8);
border: 1px solid rgba(140,135,60,0.2);
border-radius: 0;
```

### Item Selection
When hovering/active, use cyan highlight like the game's crafting grid:
```
border-color: rgba(80,180,220,0.6);
background: rgba(80,180,220,0.08);
box-shadow: 0 0 8px rgba(80,180,220,0.15);
```

### Header Bar
Top header styled like the game's tab bar:
```
background: linear-gradient(180deg, rgba(140,135,60,0.35) 0%, rgba(140,135,60,0.15) 100%);
border-bottom: 1px solid rgba(140,135,60,0.5);
```

### Category Tabs
Active tab: accent color text + border-bottom accent (khaki gold, not amber).
Inactive tabs: muted color.

### Quantity Selector
Style like the game's `< 1 >` selector:
```
Buttons: border with olive background
Center: dark background, bold accent text
Sharp corners, no border-radius
```

### Drawer
- Border-top: 2px solid rgba(140,135,60,0.6) (gold line at top)
- Handle bar: rgba(140,135,60,0.35) (khaki, not gray)
- Same section bars and corner brackets as detail page

## Files to Modify

1. **app/assets/css/main.css** — Replace all CSS custom properties
2. **app/components/SearchBar.vue** — Update border/bg classes
3. **app/components/CategoryFilter.vue** — Update active/inactive classes
4. **app/components/ItemCard.vue** — Sharp corners, slot-style icon, hover cyan
5. **app/components/ItemList.vue** — Minimal changes
6. **app/components/ItemDetail.vue** — Section bars, corner brackets, quantity selector style
7. **app/components/QuantityInput.vue** — Game-style `< 1 >` selector
8. **app/components/MaterialRow.vue** — Sharp corners, slot-style icon
9. **app/components/MaterialDrawer.vue** — Gold top border, handle bar color, corner brackets
10. **app/components/StationBadge.vue** — Sharp corners, slot-style icon
11. **app/app.vue** — Background color update
12. **app/pages/index.vue** — Header gradient style
13. **app/pages/items/[id].vue** — Header gradient style

## What Does NOT Change

- Component structure and props
- Page routing and navigation
- Search position (stays at top)
- Category filter position (stays at top, below search)
- Drawer behavior (swipe, nav stack, body scroll lock)
- Composables (useItems, useCraftCalculator, useStations)
- Scraper and data
- Tests
