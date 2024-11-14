export const CreateInitials = (name: string): string => {
    let initials = "";
    const words = name.trim().split(/\s+/);/**remove extra spaces */
    if (words.length === 1) {
        initials = words[0].substring(0, 2).toUpperCase();
    } else {
        for (const word of words) {
            if (word.length > 0) {
                initials += word.charAt(0).toUpperCase();
                if (initials.length === 2) {
                    break;
                }
            }
        }
    }
    return initials.padEnd(2, 'X');
};
