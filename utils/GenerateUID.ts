export const GenerateUID = async () => {
    try {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzzy';
        let uid = '';
        for (let i = 0; i < 16; i++) {
            uid += chars[Math.floor(Math.random() * chars.length)];
        }
        console.log(uid);
        return uid;
    } catch (err) {
        console.error(err.message);
        return false;
    }
};