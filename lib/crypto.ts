import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes)")
  }
  return Buffer.from(hex, "hex")
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a colon-separated string: iv:authTag:ciphertext (all hex-encoded).
 */
export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  })

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":")
}

/**
 * Decrypts a string produced by encrypt().
 */
export function decrypt(ciphertext: string): string {
  const key = getKey()
  const [ivHex, authTagHex, dataHex] = ciphertext.split(":")

  if (!ivHex || !authTagHex || !dataHex) {
    throw new Error("Invalid ciphertext format")
  }

  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")
  const data = Buffer.from(dataHex, "hex")

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  })
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8")
}
