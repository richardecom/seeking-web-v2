import bcrypt from 'bcrypt'
import { saltRounds } from '@/constants/api';

export const hash = async (text:string) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(text, salt);
    return hashed
}