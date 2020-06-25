export default {
  setLocalStorage(key, value) {
    typeof value === 'object' ?
      (() => {
        localStorage.setItem(key, JSON.stringify(value));
      })() :
      (() => {
        localStorage.setItem(key, value.toString());
      })()
  },

  getLocalStorage(key, opt = {}) {
    return opt.useParse ?
      JSON.parse(localStorage.getItem(key)) :
      localStorage.getItem(key);
  },

  removeLocalStorage(key) {
    localStorage.removeItem(key);
  },
}