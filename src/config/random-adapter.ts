import { randomBytes } from 'crypto';

export const generateRandomString = (length: number) => {
    return randomBytes(length).toString('hex').slice(0, length);
};