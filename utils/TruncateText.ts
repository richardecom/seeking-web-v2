export const TruncateText = (text: string, maxLength: number): string => {
    if ((text ? text.length : 0) > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };