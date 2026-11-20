# Ali Assad: portfolio

Live at https://aliassad.github.io/portfolio/

A single-file, dependency-free interactive portfolio (plain HTML, CSS and JavaScript), served by GitHub Pages with no build step.

## Interactive features

- **Live system graph** in the hero: click anywhere to send request packets through the stack; nodes react to the cursor.
- **Variable-font name** that thickens and narrows as the cursor approaches.
- **Stack explorer**: pick a technology to highlight every role and project that used it.
- **Horizontal career timeline** pinned to the scroll on desktop (vertical on mobile).
- **Project cards** with 3D tilt that open into detail dialogs.
- **Terminal**: try `help`, `whoami`, `impact`, `projects`, `open 1`, `sudo hire ali`.
- **Command palette**: press `Ctrl K` / `⌘K` or `/`.
- Short boot sequence (once per session, skippable), magnetic buttons, cursor halo, scroll progress.
- Respects `prefers-reduced-motion`, works with a keyboard, and adapts down to mobile.

## Editing content

All roles, projects and stack groups live in the `ROLES`, `PROJECTS` and `GROUPS` arrays near the top of the `<script>` in `index.html`. Change them there and every section, filter, the terminal and the command palette update together.
