export const useLocalStorage = (key: string) => {
  const setItemStorage = (value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      alert('Ошибка получения storage');
    }
  };

  const getItemStorage = () => {
    try {
      const item = localStorage.getItem(key);

      if (item) {
        return JSON.parse(item);
      }
    } catch (e) {
      alert('Ошибка получения storage');
    }
  };

  return {
    setItemStorage,
    getItemStorage,
  };
};
