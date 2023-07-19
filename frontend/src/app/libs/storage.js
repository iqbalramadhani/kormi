export default function storage(key) {
    let storageData = localStorage.getItem('persist:auth');
    let jsonData = JSON.parse(storageData)
    if (jsonData) {
      const value = jsonData[key];
      if (value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value
        }
      }
    } else {
      return null
    }
  }
  