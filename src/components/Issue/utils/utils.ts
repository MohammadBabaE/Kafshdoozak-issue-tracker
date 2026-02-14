export const convertToPersianNumbers = (num: number | string): string => {
    const persianNumbers = {
      '0': '۰',
      '1': '۱',
      '2': '۲',
      '3': '۳',
      '4': '۴',
      '5': '۵',
      '6': '۶',
      '7': '۷',
      '8': '۸',
      '9': '۹'
    };
  
    return num.toString().replace(/\d/g, (digit) => persianNumbers[digit]);
  };