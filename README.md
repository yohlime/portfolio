# Portfolio

Welcome to my personal website and portfolio! This project is a customized version based on the [Software Developer Folio](https://github.com/saadpasta/developerFolio/tree/5491fc077c8f0f02beedf77eec1c555b3b126b32) template by [Saad Pasta](https://github.com/saadpasta).

## Overview

This repository contains the code for my personal website and portfolio, showcasing my projects, skills, achievements, and more.

## Getting Started

To get a copy of this project up and running on your local machine, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/yohlime/portfolio.git ${LOCAL_PATH}
   cd ${LOCAL_PATH}
   ```

2. Install dependencies:

   ```bash
   pnpm i
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

## Customization

- Personalize page content in /src/data/portfolio.ts to suit your needs.
- Modify the sections, social media links, skills, and other details according to your preferences.

## Blog (markdown folder)

Blog posts are plain markdown files in a folder — an Obsidian vault is just one
example — read at request time (no rebuild needed to publish). Configure the
paths with environment variables:

| Variable | Description | Default |
| --- | --- | --- |
| `BLOG_CONTENT_PATH` | Directory holding the blog `*.md` files | `./content/blog` |
| `SHOW_DRAFTS` | Set to `true` to preview `draft: true` posts | `false` |

Frontmatter fields: `title`, `description`, `date` (publish), `updated` (last
modified), `slug` (optional override), `draft`, `tags`, `cover`, `coverAlt`.
`date` falls back to `created`/`published`, then the file's mtime. `updated`
falls back to `modified`/`lastmod`, then to `date` when a publish date is set
(so backdated posts don't show a false "Updated"), otherwise the file's mtime.
`updated` drives the sitemap `lastmod` and `article:modified_time`.

Both standard markdown (`[text](note.md)`, `![alt](assets/img.png)`) and Obsidian
syntax (`[[note]]`, `[[note|alias]]`, `![[image.png]]`) are supported. Images can
live anywhere inside the content folder — colocated with the note, in a subfolder,
or an `assets/` folder — and are served (and sharp-optimized) from
`/blog-assets/...`. The assets root is always the content folder.

Locally, either set `BLOG_CONTENT_PATH` or place your markdown folder at
`./content/blog`. To preview any folder (e.g. an Obsidian vault), point the env
var at it — inline or in `.env` (use an absolute path):

```bash
BLOG_CONTENT_PATH=/home/me/Documents/obsidian/blogs pnpm dev
```

### Self-hosting with Docker

`docker-compose.yml` runs two services sharing a read-only content volume:
`app` (production) on `:4321` and `preview` (`SHOW_DRAFTS=true`) on `:4322`.

```bash
BLOG_SOURCE_DIR=~/notes/blog docker compose up --build app
```

## Attribution

This project is a customized version based on the [Software Developer Folio](https://github.com/saadpasta/developerFolio/tree/5491fc077c8f0f02beedf77eec1c555b3b126b32) template by [Saad Pasta](https://github.com/saadpasta). I appreciate Saad Pasta's work in providing this template.

## License

This project is licensed under the GPL-3.0 License. For more details, see the [LICENSE](./LICENSE) file.

---

For more information on the original template and its contributors, refer to the [Software Developer Folio repository](https://github.com/saadpasta/developerFolio).
