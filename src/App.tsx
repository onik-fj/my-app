import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Header } from "./components/Header/Header";
import { List } from "./components/List/List";
import { AppDispatch, RootState } from "./Redux/store";
import { addTodoTask, getTodoTask, getTodoCategories, changeTodo, addTodoCateg, editTodoTask, editTodoCategories } from "./Redux/todoSlice";
import { removeTodoTask, removeTodoCategories } from "./Redux/todoSlice";
import { v4 as uuidv4 } from "uuid";
const App: React.FC = () => {
  let db: any;
  let dbCategories: any;
  const dispatch = useDispatch<AppDispatch>();
  const todoList = useSelector((state: RootState) => state);
  const addTodoItem: AddTodoItem = (newTitle, newDescription, newCategories) => {
    if (newTitle.trim() !== "" && newDescription.trim() !== "") {
      let newId: string = uuidv4();
      dispatch(addTodoTask(newId, newTitle, newDescription, newCategories));
      let openRequest = indexedDB.open('TodoDB', 1);

      openRequest.onerror = function (event: any) {
        console.log('open db request --- onerror');
        console.log('Ошибка при открытии БД. Код ошибки: ', event.target.errorCode);
        db = event.target.result;
      };

      openRequest.onsuccess = function (event: any) {
        console.log('open db --- onsuccess');
        db = event.target.result;
        let transaction = db.transaction('ListTask', 'readwrite');
        let listItem = transaction.objectStore('ListTask');

        let todo = {
          id: newId,
          title: newTitle,
          description: newDescription,
          categories: newCategories
        };

        let request = listItem.add(todo);
        console.dir(request);
        request.onsuccess = function () {
          console.log('Партия записана в БД');
        };

        request.onerror = function (event: any) {
          console.log('Ошибка при записи в БД', event.target.error);
        };
      };

      openRequest.onupgradeneeded = function (event: any) {

        db = event.target.result;
        if (!db.objectStoreNames.contains('ListTask')) {
          db.createObjectStore('ListTask', { keyPath: 'id', autoIncrement: false });
        };
      };
    }
  }
  const addTodoCategories: AddTodoCategories = (newTitle, newDescription) => {
    if (newTitle.trim() !== "" && newDescription.trim() !== "") {
      let newId: string = uuidv4();
      dispatch(addTodoCateg(newId, newTitle, newDescription));
      let openRequest = indexedDB.open('TodoDB', 1);

      openRequest.onerror = function (event: any) {
        console.log('open db request --- onerror');
        console.log('Ошибка при открытии БД. Код ошибки: ', event.target.errorCode);
        dbCategories = event.target.result;
      };

      openRequest.onsuccess = function (event: any) {
        console.log('open db --- onsuccess');
        dbCategories = event.target.result;
        let transaction = dbCategories.transaction('ListCategories', 'readwrite');
        let listItem = transaction.objectStore('ListCategories');

        let todo = {
          id: newId,
          title: newTitle,
          description: newDescription
        };

        let request = listItem.add(todo);
        console.dir(request);

        request.onsuccess = function () {
          console.log('Партия записана в БД');
        };

        request.onerror = function (event: any) {
          console.log('Ошибка при записи в БД', event.target.error);
        };
      };

      openRequest.onupgradeneeded = function (event: any) {

        dbCategories = event.target.result;
        if (!dbCategories.objectStoreNames.contains('ListCategories')) {
          dbCategories.createObjectStore('ListCategories', { keyPath: 'id', autoIncrement: false });
        };
      };
    }
  }
  const editTodoT: EditTodo = (ID, newTitle, newDescription, newCategories) => {
    if (newTitle.trim() !== "" && newDescription.trim() !== "") {
      dispatch(editTodoTask(ID, newTitle, newDescription, newCategories));
      let openRequest = indexedDB.open('TodoDB', 1);
      openRequest.onerror = function (event: any) {
        console.log('open db request --- onerror');
        console.log('Ошибка при открытии БД. Код ошибки: ', event.target.errorCode);
        db = event.target.result;
      };

      openRequest.onsuccess = function (event: any) {
        console.log('open db --- onsuccess');
        db = event.target.result;
        let transaction = db.transaction('ListTask', 'readwrite');
        let listItem = transaction.objectStore('ListTask');

        let todo = {
          id: ID,
          title: newTitle,
          description: newDescription,
          categories: newCategories
        };

        let request = listItem.put(todo);
        console.dir(request);
        request.onsuccess = function () {
          console.log('Партия отредактирована в БД');
        };

        request.onerror = function (event: any) {
          console.log('Ошибка при записи в БД', event.target.error);
        };
      };

      openRequest.onupgradeneeded = function (event: any) {

        db = event.target.result;
        if (!db.objectStoreNames.contains('ListTask')) {
          db.createObjectStore('ListTask', { keyPath: 'id', autoIncrement: false });
        };
      };
    }
  }
  const editTodoC: EditTodo = (ID, newTitle, newDescription, oldCategories) => {
    if (newTitle.trim() !== "" && newDescription.trim() !== "") {
      dispatch(editTodoCategories(ID, newTitle, newDescription));
      todoList.todosTask.map((todo) => (todo.categories === oldCategories) ? dispatch(editTodoTask(todo.id, todo.title, todo.description, newTitle)) : null);
      let openRequest = indexedDB.open('TodoDB', 1);
      openRequest.onerror = function (event: any) {
        console.log('open db request --- onerror');
        console.log('Ошибка при открытии БД. Код ошибки: ', event.target.errorCode);
        db = event.target.result;
      };

      openRequest.onsuccess = function (event: any) {
        console.log('open db --- onsuccess');
        db = event.target.result;
        let transaction = db.transaction('ListCategories', 'readwrite');
        let listItem = transaction.objectStore('ListCategories');

        let todo = {
          id: ID,
          title: newTitle,
          description: newDescription
        };

        let request = listItem.put(todo);
        console.dir(request);
        request.onsuccess = function () {
          console.log('Партия отредактирована в БД');
          let dbTask = db.transaction("ListTask", 'readwrite')
          let store = dbTask.objectStore("ListTask");
          let index = store.index("categories_idx");
          let request = index.getAll(oldCategories);
          request.onsuccess = function () {
            console.log(request);
            if (request.result !== undefined) {
              for (let item of request.result) {
                let todo = {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  categories: newTitle
                };
                store.put(todo);
              }
            } else {
              console.log("Нет таких категорий");
            }
          }
        };

        request.onerror = function (event: any) {
          console.log('Ошибка при записи в БД', event.target.error);
        };
      };

      openRequest.onupgradeneeded = function (event: any) {

        db = event.target.result;
        if (!db.objectStoreNames.contains('ListCategories')) {
          db.createObjectStore('ListCategories', { keyPath: 'id', autoIncrement: false });
        };
      };
    }
  }
  const deleteTodo: DeleteTodo = (todo, value) => {
    let listDB: string;
    if (value) {
      listDB = "ListTask";
      dispatch(removeTodoTask(todo));
    }
    else {
      listDB = "ListCategories";
      dispatch(removeTodoTask(todo));
      dispatch(removeTodoCategories(todo));
    }
    let openRequest = indexedDB.open('TodoDB', 1);

    openRequest.onerror = function (event: any) {
      console.log('open db request --- onerror');
      console.log('Ошибка при открытии БД. Код ошибки: ', event.target.errorCode);
      db = event.target.result;
    };

    openRequest.onsuccess = function (event: any) {
      console.log('open db --- onsuccess');
      db = event.target.result;

      let request = db
        .transaction(listDB, 'readwrite')
        .objectStore(listDB)
        .delete(todo.id);
      request.onsuccess = function () {
        console.log('Задача удалена из БД');
        if (listDB !== "ListTask") {
          let dbTask = db.transaction("ListTask", 'readwrite')
          let store = dbTask.objectStore("ListTask");
          let index = store.index("categories_idx");
          let request = index.getAll(todo.categories);
          request.onsuccess = function () {
            if (request.result !== undefined) {
              for (let item of request.result) {
                let todo = {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  categories: ""
                };
                store.put(todo);
              }
            } else {
              console.log("Нет таких категорий");
            }
          }
        }
      };

      request.onerror = function (event: any) {
        console.log('Ошибка при удалении объекта из БД', event.target.error);
      };
    };

    openRequest.onupgradeneeded = function (event: any) {
      console.log('open db --- onupgradeneeded');
      db = event.target.result;
      if (!db.objectStoreNames.contains(listDB)) {
        db.createObjectStore(listDB, { keyPath: 'id', autoIncrement: false });
      };
      if (!db.objectStoreNames.contains(listDB)) {
        db.createObjectStore(listDB, { autoIncrement: false });
      }
    };
  }
  useEffect(() => {
    let openRequest = indexedDB.open('TodoDB', 1);

    openRequest.onerror = function (event: any) {
      console.log('open db request --- onerror');
      console.log('Ошибка при открытии БД. Код ошибки: ', event.target.errorCode);
      db = event.target.result;
    };

    openRequest.onsuccess = function (event: any) {
      console.log('open db --- onsuccess');

      db = event.target.result;
      let objectStore = db.transaction('ListTask').objectStore('ListTask');
      let objectStoreC = db.transaction('ListCategories').objectStore('ListCategories');
      objectStore.getAll().onsuccess = function (event: any) {
        dispatch(getTodoTask(event.target.result));
      }
      objectStoreC.getAll().onsuccess = function (event: any) {
        dispatch(getTodoCategories(event.target.result));
      }
    };
    openRequest.onupgradeneeded = function (event: any) {
      console.log('open db --- onupgradeneeded');
      db = event.target.result;

      if (!db.objectStoreNames.contains('ListTask')) {
        db.createObjectStore('ListTask', { keyPath: 'id', autoIncrement: false }).createIndex("categories_idx", "categories");
      };
      if (!db.objectStoreNames.contains('ListTask')) {
        db.createObjectStore('ListTask', { autoIncrement: false });
      };
      if (!dbCategories.objectStoreNames.contains('ListCategories')) {
        db.createObjectStore('ListCategories', { keyPath: 'id', autoIncrement: false });
      };
      if (!dbCategories.objectStoreNames.contains('ListCategories')) {
        db.createObjectStore('ListCategories', { autoIncrement: false });
      };
    };
  }, [])
  const changeTodoItem: ChangeTodoItem = (value: boolean) => {
    dispatch(changeTodo(value));
  }
  return (
    <div className={"container"}>
      <Header addTodoItem={addTodoItem} addTodoCategories={addTodoCategories} changeTodoItem={changeTodoItem} />
      <List editTodoT={editTodoT} editTodoC={editTodoC} deleteTodo={deleteTodo} />
    </div>
  );
};

export default App;