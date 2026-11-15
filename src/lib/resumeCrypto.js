// 简历密文的浏览器解密层：密文格式见 scripts/encrypt-resume.js
const AAD = new TextEncoder().encode('resume-v1')
const DATA_KEYS = ['personalInfo', 'skills', 'experience', 'workProjects', 'evaluations', 'personalLinks']

export class ResumeUnlockError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'ResumeUnlockError'
  }
}

function base64ToBytes(text) {
  const binary = atob(text)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function assertPayload(payload) {
  const valid = payload
    && payload.v === 1
    && payload.kdf === 'PBKDF2-SHA256'
    && Number.isInteger(payload.iterations)
    && typeof payload.salt === 'string'
    && typeof payload.iv === 'string'
    && typeof payload.data === 'string'
  if (!valid) throw new ResumeUnlockError('简历数据格式无效')
}

function assertData(data) {
  const valid = data
    && typeof data === 'object'
    && data.personalInfo && typeof data.personalInfo === 'object'
    && DATA_KEYS.every((key) => key in data)
    && Array.isArray(data.workProjects)
    && Array.isArray(data.evaluations)
    && Array.isArray(data.personalLinks)
  if (!valid) throw new ResumeUnlockError('简历数据不完整')
}

async function fetchPayload() {
  let res
  try {
    res = await fetch(`${import.meta.env.BASE_URL}resume.enc.json`, { cache: 'no-store' })
  } catch (err) {
    throw new ResumeUnlockError('简历数据加载失败', { cause: err })
  }
  if (!res.ok) throw new ResumeUnlockError('简历数据加载失败')
  try {
    return await res.json()
  } catch (err) {
    throw new ResumeUnlockError('简历数据格式无效', { cause: err })
  }
}

/** 用密码解密简历数据；密码错误或密文损坏时抛出 ResumeUnlockError。 */
export async function unlockResume(password) {
  const payload = await fetchPayload()
  assertPayload(payload)

  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'],
  )
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: base64ToBytes(payload.salt), iterations: payload.iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )

  let plain
  try {
    plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(payload.iv), additionalData: AAD },
      key,
      base64ToBytes(payload.data),
    )
  } catch (err) {
    throw new ResumeUnlockError('密码不正确或数据损坏', { cause: err })
  }

  let data
  try {
    data = JSON.parse(new TextDecoder().decode(plain))
  } catch (err) {
    throw new ResumeUnlockError('简历数据格式无效', { cause: err })
  }
  assertData(data)
  return data
}
