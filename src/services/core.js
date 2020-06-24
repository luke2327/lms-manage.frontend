export default {
  setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  removeLocalStorage(key) {
    localStorage.removeItem(key);
  }
}