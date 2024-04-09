import jwt from 'jsonwebtoken'

export const verifyJWT = (accessToken: string, secret: string): jwt.JwtPayload | string | null => {
  try {
    const userData = jwt.verify(accessToken, secret)
    return userData
  } catch {
    return null
  }
}
