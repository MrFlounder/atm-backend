import { randomBytes, pbkdf2Sync, createCipheriv } from 'crypto'

// This is used for password hashing
export function hashWithSalt(password: string): {
  salt: string
  hashedBuffer: Buffer
} {
  const salt = randomBytes(16).toString('hex')
  const hashedBuffer = pbkdf2Sync(password, salt, 10000, 64, 'sha512')
  return { salt, hashedBuffer }
}
// This is used for email encryption
export function encrypt(email: string): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY
  if (!encryptionKey) {
    throw new Error('Encryption key is not set in env variables')
  }
  const iv = process.env.IV
  if (!iv) {
    throw new Error('IV is not set in env variables')
  }
  const cipher = createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    Buffer.from(iv, 'hex')
  )
  return Buffer.concat([cipher.update(email, 'utf8'), cipher.final()])
}
