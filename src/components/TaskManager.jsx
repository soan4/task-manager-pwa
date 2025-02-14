import React, { useState, useEffect } from 'react';

import { Card } from './ui/card';

import { Plus, LogOut } from 'lucide-react';



// ストレージ用のユーティリティ関数

const getStoreKey = (store, department) => `tasks_${store}_${department}`;



const saveTasksToStorage = (store, department, tasks) => {

  const key = getStoreKey(store, department);

  localStorage.setItem(key, JSON.stringify(tasks));

};



const loadTasksFromStorage = (store, department) => {

  const key = getStoreKey(store, department);

  const saved = localStorage.getItem(key);

  return saved ? JSON.parse(saved) : [];

};



function TaskManager() {

  const [selectedStore, setSelectedStore] = useState("153");

  const [selectedDepartment, setSelectedDepartment] = useState("02");

  const [isStoreSelected, setIsStoreSelected] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);

  const [currentTasks, setCurrentTasks] = useState([]);



  const taskCategories = {

    "売場管理": [

      "商品補充",

      "棚替・改廃",

      "POP作成・設置",

      "売価確認・変更",

      "清掃",

    ],

    "お客様対応": [

      "問合せ",

      "発注",

      "入荷連絡",

      "取置き",

      "返品・交換対応",

      "クレーム対応",

    ],

    "その他": [

      "メンテナンス",

      "什器作成",

      "連絡・共有",

      "その他"

    ]

  };



  const [newTask, setNewTask] = useState({

    category: "売場管理",

    taskType: "商品補充",

    assignee: "",

    dueDate: "",

    priority: "中",

    status: "未着手",

    memo: ""

  });



  // 初期表示時にタスクを読み込む

  useEffect(() => {

    const tasks = loadTasksFromStorage(selectedStore, selectedDepartment);

    setCurrentTasks(tasks);

  }, [selectedStore, selectedDepartment]);



  const handleStoreSelection = (e) => {

    e.preventDefault();

    const tasks = loadTasksFromStorage(selectedStore, selectedDepartment);

    setCurrentTasks(tasks);

    setIsStoreSelected(true);

  };



  const handleLogout = () => {

    setIsStoreSelected(false);

  };



  const handleAddTask = (e) => {

    e.preventDefault();

    const newTaskWithId = { ...newTask, id: Date.now() };

    const updatedTasks = [...currentTasks, newTaskWithId];

    setCurrentTasks(updatedTasks);

    saveTasksToStorage(selectedStore, selectedDepartment, updatedTasks);



    setNewTask({

      category: "売場管理",

      taskType: "商品補充",

      assignee: "",

      dueDate: "",

      priority: "中",

      status: "未着手",

      memo: ""

    });

    setShowAddForm(false);

  };



  const handleDeleteTask = (taskId) => {

    const updatedTasks = currentTasks.filter(task => task.id !== taskId);

    setCurrentTasks(updatedTasks);

    saveTasksToStorage(selectedStore, selectedDepartment, updatedTasks);

  };



  const handleUpdateTaskStatus = (taskId, newStatus) => {

    const updatedTasks = currentTasks.map(task =>

      task.id === taskId ? { ...task, status: newStatus } : task

    );

    setCurrentTasks(updatedTasks);

    saveTasksToStorage(selectedStore, selectedDepartment, updatedTasks);

  };



  if (!isStoreSelected) {

    return (

      <div className="max-w-md mx-auto p-4" style={{ 

        fontFamily: '"BIZ UDPGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',

        backgroundColor: '#f1f5f8',

        minHeight: '100vh'

      }}>

        <Card className="p-6 bg-white shadow-sm">

          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">業務タスク管理</h1>

          <form onSubmit={handleStoreSelection}>

            <div className="space-y-4">

              <div>

                <label className="block text-sm font-medium mb-1 text-gray-700">店舗番号*</label>

                <input

                  type="text"

                  inputMode="numeric"

                  required

                  pattern="[0-9]{3}"

                  maxLength="3"

                  placeholder="3桁の数字"

                  className="w-full p-2 border rounded bg-white"

                  value={selectedStore}

                  onChange={(e) => {

                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);

                    setSelectedStore(value);

                  }}

                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-1 text-gray-700">部門番号*</label>

                <input

                  type="text"

                  inputMode="numeric"

                  required

                  pattern="[0-9]{2}"

                  maxLength="2"

                  placeholder="2桁の数字"

                  className="w-full p-2 border rounded bg-white"

                  value={selectedDepartment}

                  onChange={(e) => {

                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);

                    setSelectedDepartment(value);

                  }}

                />

              </div>

              <button

                type="submit"

                className="w-full px-4 py-3 mt-6 bg-[#f1f5f8] text-black rounded-lg shadow-md hover:bg-[#e2e8f0] font-medium border border-gray-300"

              >

                変更

              </button>

            </div>

          </form>

        </Card>

      </div>

    );

  }



  return (

    <div className="max-w-4xl mx-auto p-4" style={{ 

      fontFamily: '"BIZ UDPGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',

      backgroundColor: '#f1f5f8',

      minHeight: '100vh'

    }}>

      <div className="flex justify-between items-start mb-6">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">業務タスク管理</h1>

          <div className="text-gray-600 mt-2">

            <div>店舗: {selectedStore}</div>

            <div>部門: {selectedDepartment}</div>

          </div>

        </div>

        <div className="flex gap-2">

          <button

            onClick={handleLogout}

            className="flex items-center gap-2 px-4 py-2 text-[#4b7c9b] hover:bg-gray-100 rounded border border-[#4b7c9b]"

          >

            <LogOut size={20} />

            店舗変更

          </button>

          <button

            onClick={() => setShowAddForm(true)}

            className="flex items-center gap-2 px-6 py-3 bg-[#f1f5f8] text-black rounded-lg shadow-md hover:bg-[#e2e8f0] font-medium border border-gray-300"

          >

            <Plus size={24} />

            タスクを追加

          </button>

        </div>

      </div>



      {showAddForm && (

        <Card className="mb-6 bg-white shadow-sm">

          <div className="p-6">

            <form onSubmit={handleAddTask}>

              <div className="grid gap-4">

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-medium mb-1">カテゴリー*</label>

                    <select

                      required

                      className="w-full p-2 border rounded bg-gray-50"

                      value={newTask.category}

                      onChange={(e) => {

                        setNewTask({

                          ...newTask,

                          category: e.target.value,

                          taskType: taskCategories[e.target.value][0]

                        });

                      }}

                    >

                      {Object.keys(taskCategories).map(category => (

                        <option key={category} value={category}>{category}</option>

                      ))}

                    </select>

                  </div>

                  <div>

                    <label className="block text-sm font-medium mb-1">タスク種類*</label>

                    <select

                      required

                      className="w-full p-2 border rounded bg-gray-50"

                      value={newTask.taskType}

                      onChange={(e) => setNewTask({...newTask, taskType: e.target.value})}

                    >

                      {taskCategories[newTask.category].map(task => (

                        <option key={task} value={task}>{task}</option>

                      ))}

                    </select>

                  </div>

                </div>



                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-medium mb-1">担当者*</label>

                    <input

                      type="text"

                      required

                      className="w-full p-2 border rounded"

                      value={newTask.assignee}

                      onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}

                    />

                  </div>

                  <div>

                    <label className="block text-sm font-medium mb-1">期限*</label>

                    <input

                      type="date"

                      required

                      className="w-full p-2 border rounded"

                      value={newTask.dueDate}

                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}

                    />

                  </div>

                </div>



                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-medium mb-1">優先度</label>

                    <select

                      className="w-full p-2 border rounded bg-gray-50"

                      value={newTask.priority}

                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}

                    >

                      <option value="高">高</option>

                      <option value="中">中</option>

                      <option value="低">低</option>

                    </select>

                  </div>

                  <div>

                    <label className="block text-sm font-medium mb-1">ステータス</label>

                    <select

                      className="w-full p-2 border rounded bg-gray-50"

                      value={newTask.status}

                      onChange={(e) => setNewTask({...newTask, status: e.target.value})}

                    >

                      <option value="未着手">未着手</option>

                      <option value="進行中">進行中</option>

                      <option value="完了">完了</option>

                    </select>

                  </div>

                </div>



                <div>

                  <label className="block text-sm font-medium mb-1">メモ</label>

                  <input

                    type="text"

                    className="w-full p-2 border rounded"

                    placeholder="場所や特記事項があれば入力"

                    value={newTask.memo}

                    onChange={(e) => setNewTask({...newTask, memo: e.target.value})}

                  />

                </div>



                <div className="flex justify-end gap-4 mt-4">

                  <button

                    type="button"

                    onClick={() => setShowAddForm(false)}

                    className="px-4 py-2 text-gray-600"

                  >

                    キャンセル

                  </button>

                  <button

                    type="submit"

                    className="px-4 py-2 bg-[#f1f5f8] text-black rounded-lg shadow-md hover:bg-[#e2e8f0] font-medium border border-gray-300"

                  >

                    タスクを保存

                  </button>

                </div>

              </div>

            </form>

          </div>

        </Card>

      )}



      <div className="space-y-4">

        {currentTasks.map(task => (

          <Card key={task.id} className="p-4 bg-white shadow-sm">

            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-medium text-lg">{task.taskType}</h3>

                <div className="text-sm text-gray-600">

                  担当: {task.assignee} | 期限: {task.dueDate} |

                  <select

                    value={task.status}

                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}

                    className="ml-2 p-1 border rounded text-sm"

                  >

                    <option value="未着手">未着手</option>

                    <option value="進行中">進行中</option>

                    <option value="完了">完了</option>

                  </select>

                </div>

                {task.memo && (

                  <div className="text-sm text-gray-500 mt-1">{task.memo}</div>

                )}

              </div>

              {task.status === "完了" && (

                <button

                  onClick={() => handleDeleteTask(task.id)}

                  className="text-red-600 hover:text-red-800 text-sm"

                >

                  削除

                </button>

              )}

            </div>

          </Card>

        ))}

      </div>

    </div>

  );

}



export default TaskManager;