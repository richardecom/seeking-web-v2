import "server-only"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = process.env.JWT_EXPIRE ? process.env.JWT_EXPIRE : '1h'
const encodedKey = new TextEncoder().encode(JWT_SECRET)

export async function createToken(userID:string) {
    const expiresIn = JWT_EXPIRE;
    const session = await encrypt({userID, expiresIn})
    return session
}

type SessionPayload = {
    userID: string;
    expiresIn: string;
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime(payload.expiresIn)
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ""){
    try {
        const {payload} = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"]
        })
        return payload
    } catch (error) {
        console.log(error)        
    }
}