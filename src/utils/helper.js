export const normalizeImageUrl = (url) => {
    // اگر URL خالی یا نامعتبر باشد
    if (!url) return '';
  
    // بررسی اینکه آیا URL شامل پورت است یا خیر
    const baseUrl = 'http://193.242.208.20';
    const portUrl = 'http://193.242.208.20:1128';
  
    // اگر URL با پورت باشد، همان را برگردان
    if (url.includes(':1128')) {
      return url;
    }
  
    // اگر URL بدون پورت باشد، پورت را اضافه کن
    if (url.startsWith(baseUrl) && !url.includes(':1128')) {
      return url.replace(baseUrl, portUrl);
    }
  
    return url; // در غیر این صورت، URL را بدون تغییر برگردان
  };
  