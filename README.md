# Soul Keeper 🔮

> The CLI tool for developers who want their AI coding assistants to truly understand them.

[![npm version](https://img.shields.io/npm/v/soul-keeper.svg)](https://www.npmjs.com/package/soul-keeper)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## What is soul.md?

soul.md is a markdown file that gives your AI coding assistant a personality, values and working philosophy. Instead of re-explaining yourself every session, your AI always knows:

- How you like to work
- What tools and tech stack you prefer
- Your coding values and standards
- Your current projects and context

Think of it as a **constitution for your AI** — a persistent set of principles that makes every coding session more productive and personalized.

## What is Soul Keeper?

Soul Keeper is a CLI tool that helps you:

- **Create** a comprehensive soul.md through guided prompts
- **Manage** multiple souls — one base soul plus project-specific extensions
- **Sync** your soul files to GitHub so they're available everywhere
- **Display** your soul beautifully in the terminal

## Installation
```bash
npm install -g soul-keeper
```

## Quick Start
```bash
npm install -g soul-keeper
soul init
```

Soul Keeper automatically creates `~/.soul/` on first run.
No manual setup required.

# View your soul
soul show

# Check status
soul status
```

## Commands

| Command | Description |
|---------|-------------|
| `soul init` | Create your base soul.md with guided prompts |
| `soul show` | Display your soul.md with beautiful formatting |
| `soul show <project>` | Display a project-specific soul |
| `soul edit` | Open soul.md in your default editor |
| `soul edit <project>` | Edit a project-specific soul |
| `soul extend <project>` | Create a project-specific soul extension |
| `soul push` | Git add, commit and push soul.md to GitHub |
| `soul push <project>` | Push a project-specific soul |
| `soul list` | List all soul files |
| `soul status` | Show soul file status and last modified dates |

## Soul Inheritance

Soul Keeper supports a base + project soul model — similar to class inheritance in programming:
```
~/.soul/soul.md              ← your base soul (universal values)
~/.soul/myproject-soul.md    ← project soul (extends base)
~/.soul/schwab-soul.md       ← another project soul
```

Your base soul captures who you are as a developer. Project souls capture what's unique about each project — specific tech stack, architecture decisions, team conventions.

## Usage with AI Coding Assistants

### OpenCode
Place soul.md in your project root and OpenCode reads it automatically.

### Claude
Reference your soul.md at the start of each session:
```
Please read soul.md before we begin.
```

### Any AI Assistant
Simply include your soul.md content in your system prompt or at the start of conversations.

## Soul Files Location

All soul files are stored in `~/.soul/` by default:
```
~/.soul/
├── soul.md                  ← your base soul
├── myproject-soul.md        ← project specific
└── anotherproject-soul.md   ← another project
```

## How Soul Files Work

soul.md in your project is a **symlink** — a pointer to your 
project soul stored in ~/.soul/. Edit either location and 
both update instantly. There is only ever ONE file.

~/.soul/jbtest-soul.md    ← the real file
/your-project/soul.md     ← points to the real file



## Example soul.md
```markdown
# My Soul

## Who I am
- Full stack developer based in Michigan
- Prefer clean systems over clever hacks
- Learning modern Python development

## Core Values
- Security first, always
- Test before shipping
- Readable over clever

## Toolchain
- Python → uv for package management
- Hosting → Render
- Version control → GitHub

## Working with AI
- Claude for architecture and brainstorming
- OpenCode for implementation
- Always review AI output critically
```

## Why soul.md Matters

AI coding assistants are becoming core to modern development workflows. But every new session starts cold — the AI doesn't know your preferences, your stack, your values or your projects.

soul.md solves this by giving your AI a persistent identity that travels with you across every project and session.

## Contributing

Contributions welcome! Soul Keeper is open source and community driven.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'added amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Roadmap

- [ ] Web app for mobile soul editing
- [ ] Community soul library — browse and fork other developers' souls
- [ ] VS Code extension
- [ ] Auto-detect project type and suggest soul extensions
- [ ] Soul versioning and history

## Author

James Bessel — [@jamesbessel](https://github.com/jamesbessel)

## License

ISC — free for personal and commercial use.

---

*"Know thyself — then teach your AI."*
