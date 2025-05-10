export const storeData = (key: string, data: any) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  } else if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
};

export const removeData = (key: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(key);
  } else if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(key);
  }
};
