# Ali Assad · Portfolio

Live: https://aliassad.github.io/portfolio/

A static, build-free portfolio in a terminal/code theme with Apple-style scroll storytelling.

## Highlights
- Scroll-driven about scene: the portrait expands to full screen while the statement reveals word by word
- Sticky experience stage that swaps company plates (Saturn Experts, AutoCenter, Arbisoft, Bayt.com/VFairs, Swenggco) as you scroll
- Skill logo pills that filter experience and projects by technology
- Animated SVG illustration for every project, plus a live architecture diagram
- Orbiting tech icons, particle network, count-up stats with progress rings
- Terminal (`help`) and command palette (`Ctrl/Cmd+K` or `/`)
- Respects `prefers-reduced-motion`; responsive down to mobile

## Structure
```
index.html
css/  base.css  sections.css  fx.css
js/   core.js  hero.js  sections.js  terminal.js
profile.webp
```
Company logos are loaded from each company's site with text fallbacks. Open `index.html` through any static server to preview.
