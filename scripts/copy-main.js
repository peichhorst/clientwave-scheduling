import { copyFile, readdir } from 'fs/promises'
import path from 'path'

async function main() {
  const assetsDir = path.resolve(process.cwd(), 'dist', 'assets')
  const files = await readdir(assetsDir)
  const bundle = files.find(name => /^index-[^.]+\.js$/.test(name))
  if (!bundle) {
    throw new Error('Could not find build bundle in dist/assets')
  }
  await copyFile(path.join(assetsDir, bundle), path.resolve(process.cwd(), 'dist', 'main.js'))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
