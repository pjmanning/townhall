---
name: Townhall
description: >
  Light-first civic transparency identity. Cool stone paper ground, deep ink text,
  one spruce teal accent, Fraunces display with Source Sans 3 body. Reads as a
  clear public ledger — not a SaaS brochure or a newspaper pastiche.
mode: light-first

colors:
  # Brand ramp — the source of truth. shadcn variables map onto these.
  void: '#eef2f5' # page ground (cool stone, not cream)
  basalt: '#f7f9fb' # raised surface
  slate: '#e2e8ee' # secondary surface
  line: '#c9d3dd' # hairline borders
  lime: '#1a6b5c' # primary spruce accent — one per view
  limeDeep: '#145247' # accent for pressed / deep links
  ion: '#3d6f99' # secondary accent, charts
  ember: '#c04538' # destructive only
  chalk: '#142033' # primary text (ink)
  fog: '#5b6b7c' # secondary text

  dark:
    void: '#0e1620'
    basalt: '#15202c'
    slate: '#1c2a3a'
    line: '#2a3b4f'
    lime: '#3cb89e'
    limeDeep: '#2a8f7a'
    ion: '#7eb0d6'
    ember: '#e07064'
    chalk: '#e8eef4'
    fog: '#93a4b5'

typography:
  display:
    family: Fraunces
    weights: [500, 600, 700]
    tracking: -0.02em
    usage: h1, h2, h3, wordmark, key figures
  body:
    family: Source Sans 3
    weights: [300, 400, 500, 600, 700]
    usage: body copy, UI labels, buttons
  mono:
    family: IBM Plex Mono
    weights: [400, 500]
    usage: kickers, eyebrows, metadata, tabular nums
  scale:
    hero: 6rem–7rem / 0.94
    h1: 2.25rem–3.75rem / 1.05
    h2: 1.875rem–2.25rem / 1.1
    h3: 1.25rem / 1.3
    body: 1rem / 1.65
    small: 0.875rem / 1.6
    kicker: 0.6875rem / tracking 0.22em / uppercase

spacing:
  unit: 0.25rem
  section: 6rem
  sectionTight: 3.5rem
  shell: min(76rem, 100% - 2.5rem)
  gutter: 1.25rem

rounded:
  sm: 0.25rem
  md: 0.375rem
  lg: 0.625rem
  xl: 0.875rem
  full: 9999px

elevation:
  flat: none
  panel: '1px border + blur(10px) + 82% surface opacity'
  glow: '0 0 0 1px rgb(26 107 92 / 0.16), 0 18px 50px -24px rgb(26 107 92 / 0.28)'

motion:
  budget: 3 intentional motions on the landing page
  easing: cubic-bezier(0.16, 1, 0.3, 1)
  duration: 0.55s–0.85s
  stagger: 0.09s
  reducedMotion: required — every animation checks useReducedMotion()

components:
  button:
    variants: [default, outline, ghost, secondary, destructive, link]
    sizes: [sm, default, lg, icon]
    radius: md
    primary: spruce fill, light text, one per view
  card:
    surface: basalt
    border: 1px line
    radius: xl
    padding: 1.5rem–2.5rem
  input:
    surface: void
    border: 1px line
    focus: 2px spruce ring
    radius: md
  chip:
    surface: slate
    type: mono, uppercase, tracking 0.14em
    radius: full
  panel:
    class: nj-panel
    usage: overlay surfaces that sit on the atmosphere wash
---

# Townhall Design System

## Overview

Townhall is local-government transparency for a small town. The visual idea is a
**public ledger on cool stone paper**: spruce teal for the one signal that
matters, Fraunces for civic display type, Source Sans 3 for readable body copy.

Keep chrome thin. Prefer tables and lists over card grids. Spend color only on
progress, status, and the primary CTA.
