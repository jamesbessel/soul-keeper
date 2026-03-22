#!/usr/bin/env node
const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const ora = require('ora');

const SOUL_DIR = path.join(os.homedir(), '.soul');
const SOUL_FILE = path.join(SOUL_DIR, 'soul.md');

const program = new Command();

function ensureSoulDir() {
  if (!fs.existsSync(SOUL_DIR)) {
    fs.mkdirSync(SOUL_DIR, { recursive: true });
  }
}

async function initSoul() {
  console.log(chalk.bold.cyan('\n✨ Welcome to Soul Keeper!\n'));
  console.log(chalk.gray('Let\'s create your soul.md file with some questions.\n'));

  ensureSoulDir();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?',
      validate: input => input.trim() !== '' || 'Please enter your name'
    },
    {
      type: 'input',
      name: 'role',
      message: 'What is your current role/title?',
      validate: input => input.trim() !== '' || 'Please enter your role'
    },
    {
      type: 'list',
      name: 'experience',
      message: 'What is your experience level?',
      choices: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (6-10 years)', 'Staff/Principal (10+ years)', 'CTO/VP of Engineering']
    },
    {
      type: 'checkbox',
      name: 'background',
      message: 'What is your technical background? (Select all that apply)',
      choices: [
        'Frontend Development',
        'Backend Development',
        'Full Stack Development',
        'DevOps/SRE',
        'Data Engineering',
        'Machine Learning/AI',
        'Mobile Development',
        'Embedded Systems',
        'Game Development',
        'Security',
        'Cloud Architecture',
        'Database Administration'
      ]
    },
    {
      type: 'checkbox',
      name: 'values',
      message: 'What are your core development values? (Select 3-5)',
      choices: [
        'Code Quality & Best Practices',
        'Testing & Reliability',
        'Documentation & Knowledge Sharing',
        'Performance Optimization',
        'Security First',
        'User Experience',
        'Agile & Iterative Development',
        'Technical Debt Management',
        'Collaboration & Teamwork',
        'Continuous Learning',
        'Simplicity & Minimalism',
        'Innovation & Experimentation'
      ],
      validate: answers => {
        if (answers.length < 3) return 'Please select at least 3 values';
        if (answers.length > 5) return 'Please select no more than 5 values';
        return true;
      }
    },
    {
      type: 'checkbox',
      name: 'techStack',
      message: 'What technologies do you work with? (Select all that apply)',
      choices: [
        'JavaScript/TypeScript',
        'Python',
        'Java/Kotlin',
        'Go',
        'Rust',
        'C/C++',
        'Ruby',
        'PHP',
        'Swift/Objective-C',
        'React',
        'Vue.js',
        'Angular',
        'Node.js',
        'Django/Flask',
        'Spring Boot',
        'PostgreSQL',
        'MongoDB',
        'Redis',
        'Docker/Kubernetes',
        'AWS',
        'GCP',
        'Azure',
        'GraphQL',
        'REST APIs'
      ]
    },
    {
      type: 'input',
      name: 'preferredTools',
      message: 'What are your preferred tools/IDEs? (e.g., VS Code, IntelliJ, Vim)'
    },
    {
      type: 'list',
      name: 'workStyle',
      message: 'How do you prefer to work?',
      choices: [
        'Deep focus - long uninterrupted blocks',
        'Pomodoro - frequent short breaks',
        'Flexible - mix of both',
        'Async first - minimal meetings',
        'Collaborative - pair programming friendly'
      ]
    },
    {
      type: 'input',
      name: 'currentProjects',
      message: 'What are you currently working on? (brief description)',
      validate: input => input.trim() !== '' || 'Please describe your current projects'
    },
    {
      type: 'list',
      name: 'aiPreference',
      message: 'How do you feel about AI coding assistants?',
      choices: [
        'Essential - use daily for most tasks',
        'Helpful - use for specific tasks',
        'Neutral - depends on the task',
        'Skeptical - prefer to write code myself',
        'Against - do not use AI assistants'
      ]
    },
    {
      type: 'checkbox',
      name: 'aiUseCases',
      message: 'What do you use AI assistants for? (Select all that apply)',
      choices: [
        'Code generation',
        'Debugging & troubleshooting',
        'Code review',
        'Documentation',
        'Learning new technologies',
        'Architecture suggestions',
        'Testing',
        'Refactoring'
      ],
      when: answers => ['Essential', 'Helpful', 'Neutral'].includes(answers.aiPreference)
    },
    {
      type: 'input',
      name: 'communicationStyle',
      message: 'How would you describe your communication style?'
    },
    {
      type: 'input',
      name: 'additionalInfo',
      message: 'Anything else you\'d like to include in your soul.md?',
      default: 'None'
    }
  ]);

  const spinner = ora('Creating your soul.md...').start();

  const soulContent = generateSoulMarkdown(answers);

  fs.writeFileSync(SOUL_FILE, soulContent);

  spinner.succeed(chalk.green('soul.md created successfully!'));
  console.log(chalk.bold.cyan('\n🔮 Your soul is ready!\n'));
  console.log(chalk.white('Your soul is stored centrally at:'));
  console.log(chalk.gray(`  ${SOUL_FILE}\n`));
  console.log(chalk.white('This makes it available from ANY project on your Mac.\n'));
  console.log(chalk.bold.white('Next steps:'));
  console.log(chalk.gray('  soul show                → view your soul'));
  console.log(chalk.gray('  soul extend <project>    → create a project soul'));
  console.log(chalk.gray('  soul push                → sync to GitHub'));
  console.log(chalk.gray('  soul --help              → see all commands\n'));
}

function generateSoulMarkdown(answers) {
  const now = new Date().toISOString().split('T')[0];
  
  let markdown = `# My Soul.md\n\n`;
  markdown += `> Last updated: ${now}\n\n`;
  markdown += `## Identity\n\n`;
  markdown += `- **Name:** ${answers.name}\n`;
  markdown += `- **Role:** ${answers.role}\n`;
  markdown += `- **Experience:** ${answers.experience}\n\n`;
  
  markdown += `## Technical Background\n\n`;
  markdown += answers.background.map(b => `- ${b}`).join('\n');
  markdown += `\n\n`;
  
  markdown += `## Core Values\n\n`;
  markdown += answers.values.map(v => `- ${v}`).join('\n');
  markdown += `\n\n`;
  
  markdown += `## Tech Stack\n\n`;
  markdown += answers.techStack.map(t => `- ${t}`).join('\n');
  markdown += `\n\n`;
  markdown += `**Preferred Tools:** ${answers.preferredTools || 'Not specified'}\n\n`;
  
  markdown += `## Working Style\n\n`;
  markdown += `- **Work Pattern:** ${answers.workStyle}\n`;
  markdown += `- **Communication:** ${answers.communicationStyle || 'Not specified'}\n\n`;
  
  markdown += `## Current Projects\n\n`;
  markdown += `${answers.currentProjects}\n\n`;
  
  markdown += `## AI Collaboration\n\n`;
  markdown += `- **Attitude:** ${answers.aiPreference}\n`;
  if (answers.aiUseCases && answers.aiUseCases.length > 0) {
    markdown += `- **Use Cases:**\n`;
    answers.aiUseCases.map(u => `  - ${u}`).join('\n');
  }
  markdown += `\n\n`;
  
  if (answers.additionalInfo && answers.additionalInfo !== 'None') {
    markdown += `## Additional Notes\n\n`;
    markdown += `${answers.additionalInfo}\n`;
  }
  
  return markdown;
}

async function showSoul(project) {
  let filePath;
  
  if (project) {
    filePath = path.join(SOUL_DIR, `${project}-soul.md`);
  } else {
    filePath = SOUL_FILE;
  }
  
  if (!fs.existsSync(filePath)) {
    if (project) {
      console.log(chalk.red(`Project soul file not found: ${project}-soul.md`));
    } else {
      console.log(chalk.red('soul.md not found. Run "soul init" to create one.'));
    }
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(chalk.bold.cyan('\n╭──────────────────────────────────────╮\n'));
  console.log(chalk.bold.cyan('│            ') + chalk.bold.white('Your Soul') + chalk.bold.cyan('                   │\n'));
  console.log(chalk.bold.cyan('╰──────────────────────────────────────╯\n'));
  
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.startsWith('# ')) {
      console.log(chalk.bold.cyan(line));
    } else if (line.startsWith('## ')) {
      console.log(chalk.bold.yellow(line));
    } else if (line.startsWith('> ')) {
      console.log(chalk.gray(line));
    } else if (line.startsWith('- **')) {
      const match = line.match(/^- \*\*([^*]+):\*\* (.+)/);
      if (match) {
        console.log(chalk.white('  ') + chalk.green('●') + chalk.white(' ') + chalk.bold(match[1]) + ': ' + chalk.white(match[2]));
      } else {
        console.log(chalk.white('  ') + chalk.cyan('○') + ' ' + chalk.white(line.substring(2)));
      }
    } else if (line.startsWith('- ')) {
      console.log(chalk.white('  ') + chalk.cyan('○') + ' ' + chalk.white(line.substring(2)));
    } else if (line.startsWith('  - ')) {
      console.log(chalk.gray('    ') + chalk.yellow('▸') + ' ' + chalk.gray(line.substring(4)));
    } else if (line.trim() === '') {
      console.log('');
    } else {
      console.log(chalk.white(line));
    }
  });
  console.log('');
}

async function editSoul(project) {
  let filePath;
  
  if (project) {
    filePath = path.join(SOUL_DIR, `${project}-soul.md`);
  } else {
    filePath = SOUL_FILE;
  }
  
  if (!fs.existsSync(filePath)) {
    if (project) {
      console.log(chalk.red(`Project soul file not found: ${project}-soul.md`));
    } else {
      console.log(chalk.red('soul.md not found. Run "soul init" to create one.'));
    }
    return;
  }
  
  const editor = process.env.EDITOR || (process.platform === 'darwin' ? 'open' : 'nano');
  
  const spinner = ora('Opening editor...').start();
  
  exec(`${editor} "${filePath}"`, (error) => {
    spinner.stop();
    if (error) {
      console.log(chalk.yellow(`Could not open editor. Please edit manually: ${filePath}`));
    }
  });
}

async function createSymlink(projectFile, project) {
  const symlinkPath = path.join(process.cwd(), 'soul.md');
  let symlinkCreated = false;
  let gitignoreUpdated = false;
  
  if (fs.existsSync(symlinkPath)) {
    const stats = fs.lstatSync(symlinkPath);
    if (stats.isSymbolicLink()) {
      fs.unlinkSync(symlinkPath);
      symlinkCreated = true;
    } else {
      const { replace } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'replace',
          message: 'A soul.md already exists here. Replace with symlink?',
          default: false
        }
      ]);
      
      if (!replace) {
        console.log(chalk.yellow('Skipped symlink creation.'));
        return { symlinkCreated: false, gitignoreUpdated: false };
      }
      fs.unlinkSync(symlinkPath);
      symlinkCreated = true;
    }
  } else {
    symlinkCreated = true;
  }
  
  if (symlinkCreated) {
    fs.symlinkSync(projectFile, symlinkPath);
  }
  
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  let gitignoreContent = '';
  
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  if (!gitignoreContent.includes('soul.md')) {
    fs.appendFileSync(gitignorePath, '\nsoul.md\n');
    gitignoreUpdated = true;
  }
  
  return { symlinkCreated, gitignoreUpdated };
}

async function extendSoul(project) {
  if (!project) {
    console.log(chalk.red('Please specify a project name: soul extend <project>'));
    return;
  }
  
  const projectFile = path.join(SOUL_DIR, `${project}-soul.md`);
  
  if (fs.existsSync(projectFile)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Project soul for "${project}" already exists. Overwrite?`,
        default: false
      }
    ]);
    
    if (!overwrite) {
      console.log(chalk.yellow('Aborted.'));
      return;
    }
  }
  
  console.log(chalk.bold.cyan(`\n✨ Creating project soul for: ${project}\n`));
  console.log(chalk.gray('Let\'s capture what makes this project unique.\n'));
  
  const baseSoulExists = fs.existsSync(SOUL_FILE);
  let baseSoulContent = '';
  if (baseSoulExists) {
    baseSoulContent = fs.readFileSync(SOUL_FILE, 'utf8');
  }
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: project,
      validate: input => input.trim() !== '' || 'Please enter project name'
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'Brief description of the project:',
      validate: input => input.trim() !== '' || 'Please describe the project'
    },
    {
      type: 'checkbox',
      name: 'techStack',
      message: 'Tech stack for this project: (Select all that apply)',
      choices: [
        'JavaScript/TypeScript',
        'Python',
        'Java/Kotlin',
        'Go',
        'Rust',
        'C/C++',
        'Ruby',
        'PHP',
        'Swift/Objective-C',
        'React',
        'Vue.js',
        'Angular',
        'Node.js',
        'Django/Flask',
        'Spring Boot',
        'PostgreSQL',
        'MongoDB',
        'Redis',
        'Docker/Kubernetes',
        'AWS',
        'GCP',
        'Azure',
        'GraphQL',
        'REST APIs'
      ]
    },
    {
      type: 'checkbox',
      name: 'teamSize',
      message: 'Team size:',
      choices: ['Solo', '2-5', '6-10', '11-20', '20+']
    },
    {
      type: 'checkbox',
      name: 'roles',
      message: 'Your role(s) in this project:',
      choices: [
        'Tech Lead',
        'Backend Developer',
        'Frontend Developer',
        'Full Stack Developer',
        'DevOps Engineer',
        'Data Engineer',
        'Security Engineer',
        'Product Manager',
        'Architect'
      ]
    },
    {
      type: 'input',
      name: 'uniqueAspects',
      message: 'What\'s unique about this project? (challenges, architecture, etc.)',
      validate: input => input.trim() !== '' || 'Please describe unique aspects'
    },
    {
      type: 'input',
      name: 'projectValues',
      message: 'Project-specific values or priorities:'
    },
    {
      type: 'checkbox',
      name: 'aiUseCases',
      message: 'AI usage in this project:',
      choices: [
        'Code generation & autocomplete',
        'Code review & quality',
        'Documentation',
        'Testing & QA',
        'Debugging',
        'Architecture planning',
        'Not used in this project'
      ]
    },
    {
      type: 'input',
      name: 'additionalNotes',
      message: 'Any additional notes for this project:',
      default: 'None'
    }
  ]);
  
  const spinner = ora('Creating project soul...').start();
  
  const projectContent = generateProjectSoulMarkdown(project, answers, baseSoulContent);
  
  fs.writeFileSync(projectFile, projectContent);
  
  spinner.succeed(chalk.green(`Project soul created: ${projectFile}`));
  
  const { createLink } = await inquirer.prompt([{
    type: 'confirm',
    name: 'createLink',
    message: 'Create soul.md symlink here? (lets AI coding assistants find your soul automatically)',
    default: true
  }]);
  
  if (createLink) {
    const { symlinkCreated, gitignoreUpdated } = await createSymlink(projectFile, project);
    if (symlinkCreated) {
      console.log(chalk.green(`✔ Symlink created: ./soul.md → ${projectFile}`));
    }
    if (gitignoreUpdated) {
      console.log(chalk.green('✔ Added soul.md to .gitignore'));
    }
  }
  
  console.log(chalk.cyan(`\nUse "soul show ${project}" to view it or "soul edit ${project}" to modify it.\n`));
}

function generateProjectSoulMarkdown(project, answers, baseSoulContent) {
  const now = new Date().toISOString().split('T')[0];
  
  let markdown = `# ${answers.projectName} - Project Soul\n\n`;
  markdown += `> Based on base soul.md | Created: ${now}\n\n`;
  markdown += `## Project Overview\n\n`;
  markdown += `- **Project:** ${answers.projectName}\n`;
  markdown += `- **Description:** ${answers.projectDescription}\n`;
  markdown += `- **Team Size:** ${answers.teamSize.join(', ')}\n`;
  markdown += `- **Role(s):** ${answers.roles.join(', ')}\n\n`;
  
  markdown += `## Tech Stack\n\n`;
  if (answers.techStack.length > 0) {
    markdown += answers.techStack.map(t => `- ${t}`).join('\n');
  } else {
    markdown += `- Not specified\n`;
  }
  markdown += `\n\n`;
  
  markdown += `## What Makes This Project Unique\n\n`;
  markdown += `${answers.uniqueAspects}\n\n`;
  
  markdown += `## Project Values\n\n`;
  markdown += `${answers.projectValues || 'Same as base soul'}\n\n`;
  
  markdown += `## AI Collaboration in This Project\n\n`;
  if (answers.aiUseCases.includes('Not used in this project')) {
    markdown += `- AI assistants not used in this project\n`;
  } else {
    answers.aiUseCases.map(u => `- ${u}`).join('\n');
    markdown += answers.aiUseCases.map(u => `- ${u}`).join('\n');
  }
  markdown += `\n\n`;
  
  if (answers.additionalNotes && answers.additionalNotes !== 'None') {
    markdown += `## Additional Notes\n\n`;
    markdown += `${answers.additionalNotes}\n`;
  }
  
  markdown += `\n---\n\n`;
  markdown += `## Base Soul (for reference)\n\n`;
  if (baseSoulContent) {
    const baseLines = baseSoulContent.split('\n').slice(2);
    markdown += baseLines.join('\n');
  } else {
    markdown += `*No base soul found. This project soul is standalone.*\n`;
  }
  
  return markdown;
}

async function pushSoul(project) {
  let filePath;
  
  if (project) {
    filePath = path.join(SOUL_DIR, `${project}-soul.md`);
  } else {
    filePath = SOUL_FILE;
  }
  
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red(`soul file not found: ${filePath}`));
    return;
  }
  
  const projectName = project ? `${project} project ` : '';
  const fileName = path.basename(filePath);
  
  const git = simpleGit(SOUL_DIR);
  
  const spinner = ora('Checking Git repository...').start();
  
  try {
    const isRepo = await git.checkIsRepo();
    
    if (!isRepo) {
      spinner.stop();
      console.log(chalk.red('\nNo git repository in ~/.soul/'));
      console.log(chalk.yellow('\nTo set up git tracking:'));
      console.log(chalk.gray('  cd ~/.soul'));
      console.log(chalk.gray('  git init'));
      console.log(chalk.gray('  git remote add origin <your-repo-url>'));
      console.log(chalk.yellow('\nThen run "soul push" again.\n'));
      return;
    }
    
    spinner.text = 'Adding soul file...';
    await git.add(fileName);
    
    spinner.text = 'Checking for changes...';
    const status = await git.status();
    
    if (status.staged.length === 0 && status.not_added.length === 0) {
      spinner.succeed(chalk.yellow('No changes to commit.'));
      return;
    }
    
    spinner.text = 'Committing...';
    await git.commit(`Update ${fileName}`);
    
    spinner.text = 'Checking remote...';
    const remotes = await git.getRemotes();
    
    if (remotes.length === 0) {
      spinner.stop();
      console.log(chalk.red('\nNo remote configured.'));
      console.log(chalk.yellow('\nAdd a remote:'));
      console.log(chalk.gray(`  cd ${SOUL_DIR}`));
      console.log(chalk.gray('  git remote add origin <your-repo-url>'));
      console.log(chalk.yellow('\nThen run "soul push" again.\n'));
      return;
    }
    
    spinner.text = 'Pushing to remote...';
    await git.push();
    
    const remoteUrl = (await git.remote(['get-url', remotes[0].name])).trim();
    
    spinner.succeed(chalk.green(`\n${projectName}soul pushed successfully!`));
    console.log(chalk.green(`✔ Pushed to: ${remoteUrl}`));
    console.log(chalk.gray('  Your soul is now available on any machine via soul pull\n'));
  } catch (error) {
    spinner.stop();
    if (error.message.includes('no upstream')) {
      console.log(chalk.red('\nNo upstream branch configured.'));
      console.log(chalk.yellow('\nSet upstream and push:'));
      console.log(chalk.gray(`  cd ${SOUL_DIR}`));
      console.log(chalk.gray('  git push -u origin main'));
      console.log(chalk.yellow('\nThen run "soul push" again.\n'));
    } else if (error.message.includes('Authentication failed') || error.message.includes('could not read')) {
      console.log(chalk.red('\nAuthentication failed.'));
      console.log(chalk.yellow('\nCheck your git credentials and try again.\n'));
    } else {
      console.log(chalk.red(`\nPush failed: ${error.message}\n`));
    }
  }
}

async function listSouls() {
  ensureSoulDir();
  
  const files = fs.readdirSync(SOUL_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      name: f,
      path: path.join(SOUL_DIR, f),
      stats: fs.statSync(path.join(SOUL_DIR, f))
    }))
    .sort((a, b) => a.stats.mtime - b.stats.mtime);
  
  if (files.length === 0) {
    console.log(chalk.yellow('\nNo soul files found.\n'));
    console.log(chalk.gray('Run "soul init" to create your base soul.md\n'));
    return;
  }
  
  console.log(chalk.bold.cyan('\n╭──────────────────────────────────────╮\n'));
  console.log(chalk.bold.cyan('│            ') + chalk.bold.white('Soul Files') + chalk.bold.cyan('                  │\n'));
  console.log(chalk.bold.cyan('╰──────────────────────────────────────╯\n'));
  
  files.forEach((file, index) => {
    const isBase = file.name === 'soul.md';
    const label = isBase ? chalk.green('BASE') : chalk.blue('PROJ');
    const projectName = isBase ? 'Base Soul' : file.name.replace('-soul.md', '');
    
    console.log(`  ${label} ${chalk.white(projectName)}`);
    console.log(`    ${chalk.gray(file.path)}`);
    console.log(`    ${chalk.gray('Modified:')} ${chalk.gray(file.stats.mtime.toLocaleString())}`);
    console.log('');
  });
  
  const baseCount = files.filter(f => f.name === 'soul.md').length;
  const projectCount = files.length - baseCount;
  
  console.log(chalk.gray(`  Total: ${baseCount} base, ${projectCount} project(s)\n`));
}

async function statusSoul() {
  ensureSoulDir();
  
  const baseSoul = { name: 'soul.md', exists: false };
  const projectSouls = [];
  
  if (fs.existsSync(SOUL_FILE)) {
    const stats = fs.statSync(SOUL_FILE);
    baseSoul.exists = true;
    baseSoul.stats = stats;
  }
  
  const files = fs.readdirSync(SOUL_DIR).filter(f => f.endsWith('-soul.md'));
  files.forEach(f => {
    const stats = fs.statSync(path.join(SOUL_DIR, f));
    projectSouls.push({
      name: f,
      project: f.replace('-soul.md', ''),
      exists: true,
      stats
    });
  });
  
  console.log(chalk.bold.cyan('\n╭──────────────────────────────────────╮\n'));
  console.log(chalk.bold.cyan('│            ') + chalk.bold.white('Soul Status') + chalk.bold.cyan('                 │\n'));
  console.log(chalk.bold.cyan('╰──────────────────────────────────────╯\n'));
  
  console.log(chalk.bold.white('  Base Soul'));
  if (baseSoul.exists) {
    console.log(`    ${chalk.green('✓')} ${chalk.white('Exists')} ${chalk.gray('|')} ${chalk.gray('Created:')} ${chalk.white(baseSoul.stats.birthtime.toLocaleDateString())} ${chalk.gray('|')} ${chalk.gray('Modified:')} ${chalk.white(baseSoul.stats.mtime.toLocaleDateString())}`);
  } else {
    console.log(`    ${chalk.red('✗')} ${chalk.red('Does not exist')} ${chalk.gray('|')} ${chalk.gray('Run "soul init" to create')}`);
  }
  console.log('');
  
  console.log(chalk.bold.white('  Project Souls'));
  if (projectSouls.length === 0) {
    console.log(`    ${chalk.gray('No project souls found')}`);
    console.log(`    ${chalk.gray('Run "soul extend <project>" to create one')}`);
  } else {
    projectSouls.forEach(p => {
      console.log(`    ${chalk.green('✓')} ${chalk.blue(p.project)} ${chalk.gray('|')} ${chalk.gray('Modified:')} ${chalk.white(p.stats.mtime.toLocaleDateString())}`);
    });
  }
  console.log('');
  
  console.log(chalk.gray(`  Location: ${SOUL_DIR}\n`));
}

async function linkSoul(project) {
  if (!project) {
    console.log(chalk.red('Please specify a project name: soul link <project>'));
    return;
  }
  
  const projectFile = path.join(SOUL_DIR, `${project}-soul.md`);
  
  if (!fs.existsSync(projectFile)) {
    console.log(chalk.red(`Project soul not found: ${projectFile}`));
    console.log(chalk.gray(`Run "soul extend ${project}" first to create it.\n`));
    return;
  }
  
  const symlinkPath = path.join(process.cwd(), 'soul.md');
  let symlinkCreated = false;
  let gitignoreUpdated = false;
  
  if (fs.existsSync(symlinkPath)) {
    const stats = fs.lstatSync(symlinkPath);
    if (stats.isSymbolicLink()) {
      const existingTarget = fs.readlinkSync(symlinkPath);
      if (existingTarget === projectFile) {
        console.log(chalk.yellow(`Already linked to: ${projectFile}`));
        return;
      }
      fs.unlinkSync(symlinkPath);
      symlinkCreated = true;
    } else {
      const { replace } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'replace',
          message: 'A soul.md already exists here. Replace with symlink?',
          default: false
        }
      ]);
      
      if (!replace) {
        console.log(chalk.yellow('Aborted.'));
        return;
      }
      fs.unlinkSync(symlinkPath);
      symlinkCreated = true;
    }
  } else {
    symlinkCreated = true;
  }
  
  if (symlinkCreated) {
    fs.symlinkSync(projectFile, symlinkPath);
  }
  
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  let gitignoreContent = '';
  
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  if (!gitignoreContent.includes('soul.md')) {
    fs.appendFileSync(gitignorePath, '\nsoul.md\n');
    gitignoreUpdated = true;
  }
  
  console.log(chalk.green(`✔ Project soul: ${projectFile}`));
  if (symlinkCreated) {
    console.log(chalk.green(`✔ Symlink created: ./soul.md → ${projectFile}`));
  }
  if (gitignoreUpdated) {
    console.log(chalk.green('✔ Added soul.md to .gitignore'));
  }
  console.log('');
}

program
  .name('soul')
  .description('Soul Keeper - Create, manage and sync your soul.md files')
  .version('1.0.0');

program
  .command('init')
  .description('Create your base soul.md with interactive prompts')
  .action(initSoul);

program
  .command('show')
  .description('Display your soul.md (use "soul show <project>" for project souls)')
  .argument('[project]', 'Project name to show project-specific soul')
  .action(showSoul);

program
  .command('edit')
  .description('Edit soul.md in your default editor')
  .argument('[project]', 'Project name to edit project-specific soul')
  .action(editSoul);

program
  .command('extend')
  .description('Create a project-specific soul extension')
  .argument('<project>', 'Project name')
  .action(extendSoul);

program
  .command('push')
  .description('Git add, commit and push soul.md to GitHub')
  .argument('[project]', 'Project name to push project-specific soul')
  .action(pushSoul);

program
  .command('list')
  .description('Show all soul files (base + project extensions)')
  .action(listSouls);

program
  .command('status')
  .description('Show which soul files exist and when they were last updated')
  .action(statusSoul);

program
  .command('link')
  .description('Create symlink to project soul in current directory')
  .argument('<project>', 'Project name')
  .action(linkSoul);

program.parse();
