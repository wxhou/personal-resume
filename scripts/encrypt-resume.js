// 用法（在仓库根目录、用户自己的终端执行）：
//   read -s RESUME_PASSWORD; export RESUME_PASSWORD
//   node scripts/encrypt-resume.js
// 可选：--out <path> 指定输出（默认 public/resume.enc.json）
// 敏感字段从 .env.local 读取：RESUME_PHONE / RESUME_LOCATION / RESUME_SALARY
import { existsSync } from 'node:fs'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEFAULT_OUT = resolve(ROOT, 'public/resume.enc.json')
const ENV_FILE = resolve(ROOT, '.env.local')
const ITERATIONS = 600000
const AAD = new TextEncoder().encode('resume-v1')
const REQUIRED_ENV = ['RESUME_PHONE', 'RESUME_LOCATION', 'RESUME_SALARY']

function fail(message) {
  console.error(`[encrypt-resume] ${message}`)
  process.exit(1)
}

function parseArgs(argv) {
  const idx = argv.indexOf('--out')
  if (idx === -1) return { out: DEFAULT_OUT }
  const value = argv[idx + 1]
  if (!value) fail('--out 需要一个路径')
  return { out: resolve(process.cwd(), value) }
}

function requireText(value, name) {
  if (typeof value !== 'string' || value.trim() === '') fail(`缺少必填字段：${name}`)
  return value.trim()
}

function base64(bytes) {
  return Buffer.from(bytes).toString('base64')
}

async function main() {
  if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE)

  const password = process.env.RESUME_PASSWORD
  if (!password) fail('缺少 RESUME_PASSWORD（写入 .env.local，或用 read -s 输入后 export）')
  // 下限 4 位；更短等于没有保护
  if (password.length < 4) fail('RESUME_PASSWORD 至少 4 个字符')

  const { personalInfo, skills, experience, workProjects, evaluations, personalLinks } =
    await import('../src/data/resume.js')

  const envValues = Object.fromEntries(REQUIRED_ENV.map((key) => [key, process.env[key]]))
  const missing = REQUIRED_ENV.filter((key) => !String(envValues[key] ?? '').trim())
  if (missing.length) fail(`缺少必填字段：${missing.join(', ')}（请写入 .env.local 或当前终端环境）`)

  const data = {
    personalInfo: {
      ...personalInfo,
      phone: requireText(envValues.RESUME_PHONE, 'RESUME_PHONE'),
      location: requireText(envValues.RESUME_LOCATION, 'RESUME_LOCATION'),
      salary: requireText(envValues.RESUME_SALARY, 'RESUME_SALARY'),
    },
    skills,
    experience,
    workProjects,
    evaluations,
    personalLinks,
  }

  const plaintext = new TextEncoder().encode(JSON.stringify(data))
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'],
  )
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: AAD }, key, plaintext,
  )

  const payload = {
    v: 1,
    kdf: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    salt: base64(salt),
    iv: base64(iv),
    data: base64(ciphertext),
  }

  const { out } = parseArgs(process.argv.slice(2))
  await mkdir(dirname(out), { recursive: true })
  const tmp = `${out}.tmp`
  await writeFile(tmp, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  await rename(tmp, out)

  console.log(`[encrypt-resume] ${ITERATIONS} 次 PBKDF2，已写入 ${out}`)
}

main().catch((err) => fail(err.message))
