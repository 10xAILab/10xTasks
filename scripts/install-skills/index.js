import { existsSync, mkdirSync, readdirSync, statSync, symlinkSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageDir = join(__dirname, '..')

const aiTools = [
  { name: 'Claude Code', globalDir: '.claude/skills' },
  { name: 'Cursor', globalDir: '.cursor/skills' },
  { name: 'Codex', globalDir: '.codex/skills' },
  { name: 'OpenCode', globalDir: '.opencode/skills' },
  { name: 'Gemini CLI', globalDir: '.gemini/skills' },
]

const skillsDir = join(packageDir, 'skills')

function getHomeDir() {
  return process.env.HOME || process.env.USERPROFILE || '/root'
}

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }
}

function createSymlink(target, linkPath) {
  const linkDir = dirname(linkPath)
  ensureDir(linkDir)

  if (existsSync(linkPath)) {
    return false
  }

  try {
    symlinkSync(target, linkPath, 'dir')
    return true
  } catch (error) {
    console.error(`Failed to create symlink for ${linkPath}: ${error.message}`)
    return false
  }
}

function installSkills() {
  console.log('\n🎯 Installing 10X Skills...\n')

  if (!existsSync(skillsDir)) {
    console.log('⚠️  No skills directory found. Skipping installation.')
    return
  }

  const skills = readdirSync(skillsDir).filter((item) => {
    return statSync(join(skillsDir, item)).isDirectory()
  })

  if (skills.length === 0) {
    console.log('⚠️  No skills found. Skipping installation.')
    return
  }

  const homeDir = getHomeDir()
  let installedCount = 0
  const installedPaths = []

  for (const tool of aiTools) {
    console.log(`📦 Installing skills for ${tool.name}...`)
    const toolPath = join(homeDir, tool.globalDir)

    for (const skill of skills) {
      const targetPath = join(skillsDir, skill)
      const linkPath = join(toolPath, skill)

      const success = createSymlink(targetPath, linkPath)

      if (success) {
        console.log(`  ✓ ${skill} → ${linkPath}`)
        installedPaths.push(linkPath)
        installedCount++
      } else {
        console.log(`  ○ ${skill} (already exists or skipped)`)
      }
    }
  }

  console.log(`\n✅ Successfully installed ${installedCount} skill(s)!`)
  console.log('\n📂 Skills installed at:')
  for (const path of installedPaths) {
    console.log(`   ${path}`)
  }
  console.log('\n✨ Skills are now available globally for all AI tools.')
}

installSkills()
