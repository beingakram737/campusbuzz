// 📁 client/src/utils/historyLock.js

export const lockBackNavigation = () => {
  window.history.pushState(null, "", window.location.href);

  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
};

export const unlockBackNavigation = () => {
  window.onpopstate = null;
};
