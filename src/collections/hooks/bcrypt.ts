import bcrypt from 'bcryptjs'

export async function getHashedOTP() {
  const otp = `${Math.floor(Math.random() * 10000)}`
  console.log({ otp })
  const salt = await bcrypt.genSalt()
  const hashedOTP = await bcrypt.hash(otp, salt)
  return { otp, hashedOTP }
}

export function verifyHashedOTP(otp: string, hashedOTP: string) {
  return bcrypt.compare(otp, hashedOTP)
}
