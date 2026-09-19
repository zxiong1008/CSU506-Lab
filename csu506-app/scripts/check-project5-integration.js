const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'src', 'App.tsx')
const appSource = fs.readFileSync(filePath, 'utf8')

const requiredStrings = [
  "number: '05'",
  "Project5Requirements",
  "Project5Tool",
  "activeProject === '05'"
]

const missing = requiredStrings.filter((value) => !appSource.includes(value))

if (missing.length > 0) {
  console.error('Project 5 UI integration check failed. Missing:', missing.join(', '))
  process.exit(1)
}

console.log('Project 5 UI integration check passed.')
