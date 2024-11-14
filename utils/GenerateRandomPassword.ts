export const GenerateRandomPassword = (length = 8) => {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numericChars = "0123456789";
    const specialChars = "!@#$%^&*";

    const passwordArray = [
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)],
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
      numericChars[Math.floor(Math.random() * numericChars.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    const allChars =
      lowercaseChars + uppercaseChars + numericChars + specialChars;
    for (let i = passwordArray.length; i < length; i++) {
      passwordArray.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    const shuffledPassword = passwordArray
      .sort(() => Math.random() - 0.5)
      .join("");
    return shuffledPassword;
  };