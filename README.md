# Soul Keeper

A CLI tool that helps developers create, manage and sync their soul.md files.

## Installation

```bash
npm install -g soul-keeper
```

## Usage

### `soul init`
Create your base soul.md with interactive guided prompts. The tool asks about:
- Name and location
- Technical background and experience level
- Core development values
- Preferred tools and tech stack
- Working style preferences
- Current projects
- AI collaboration preferences

### `soul show`
Display your soul.md in the terminal with nice formatting.

```bash
soul show              # Show base soul
soul show <project>    # Show project-specific soul
```

### `soul edit`
Open soul.md in your default editor.

```bash
soul edit              # Edit base soul
soul edit <project>    # Edit project-specific soul
```

### `soul extend <project>`
Create a project-specific soul extension that inherits from your base soul. This captures what's unique about a specific project.

### `soul push`
Git add, commit and push your soul.md to GitHub.

```bash
soul push              # Push base soul
soul push <project>    # Push project-specific soul
```

### `soul list`
Show all soul files (base + project extensions).

### `soul status`
Show which soul files exist and when they were last updated.

## Soul Files Location

All soul files are stored in `~/.soul/` by default:
- Base soul: `~/.soul/soul.md`
- Project souls: `~/.soul/<project>-soul.md`

## Commands Overview

| Command | Description |
|---------|-------------|
| `soul init` | Create your base soul.md |
| `soul show` | Display soul.md with formatting |
| `soul edit` | Open soul.md in your editor |
| `soul extend <project>` | Create project-specific soul |
| `soul push` | Git add, commit and push to GitHub |
| `soul list` | List all soul files |
| `soul status` | Show soul file status |
| `soul --version` | Show version |
| `soul --help` | Show help |

## Requirements

- Node.js 14.0 or higher
- Git (for the push command)
- A code editor (for the edit command)

## License

ISC
