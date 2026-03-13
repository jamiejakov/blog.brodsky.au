# AGENTS.md

This repository hosts a personal blog at [blog.brodsky.au](https://blog.brodsky.au).

## Tech stack

- **Astro** – Static site framework and primary templating
- **React** – Used for interactive components (e.g. theme toggle, navigation)
- **Tailwind CSS** – Styling
- **Vercel** – Hosting and deployment
- **pnpm** – Package manager (use `pnpm`, not npm)

## YouTube embeds

Bare YouTube URLs become embeds; markdown links `[text](https://youtube.com/...)` stay as links. A custom plugin at `scripts/remark-youtube-explicit.js` converts only standalone URLs (on their own line), not inline links.

## Instructions

The role of this file is to describe common mistakes and
confusion points that agents might encounter as they work in
this project. If you ever encounter something in the project
that surprises you, please alert the developer working with you
and indicate that this is the case in the AgentMD file to help
prevent future agents from having the same issue.
