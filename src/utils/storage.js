// ストレージのキーを生成
export const getStoreKey = (store, department) => `tasks_${store}_${department}`;

// タスクを保存
export const saveTasksToStorage = (store, department, tasks) => {
  const key = getStoreKey(store, department);
  localStorage.setItem(key, JSON.stringify(tasks));
};

// タスクを読み込み
export const loadTasksFromStorage = (store, department) => {
  const key = getStoreKey(store, department);
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

// 店舗情報を保存
export const saveStoreInfo = (store, department) => {
  localStorage.setItem('store', store);
  localStorage.setItem('department', department);
};

// 店舗情報を読み込み
export const loadStoreInfo = () => {
  return {
    store: localStorage.getItem('store'),
    department: localStorage.getItem('department')
  };
};