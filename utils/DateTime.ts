export const getDateTime = (): string => {
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Manila',
    }).format(new Date()).replace(/[\/:]/g, '_');
  };