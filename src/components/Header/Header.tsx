import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Header.css";
import { SelectListAdd } from "../SelectList/SelectListAdd";
import Tasks from "../../img/menu-img.svg";
import inputNameImg from "../../img/input-name-img.svg";
import iconClose from "../../img/icon-close.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

interface IHeaderProps {
  addTodoItem: AddTodoItem,
  addTodoCategories: AddTodoCategories,
  changeTodoItem: ChangeTodoItem
}
export const Header: React.FC<IHeaderProps> = ({ addTodoItem, addTodoCategories, changeTodoItem }) => {
  //React Redux Hooks
  const todoList = useSelector((state: RootState) => state);
  const [newTitle, setNewText] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategories, setCategories] = useState("");
  const [status, setStatus] = useState(false);
  const [errorStatusTitle, setErrorStatusTitle]= useState(false);
  const [errorStatusDescription, setErrorStatusDescription]= useState(false);

  const btnTaks = document.getElementById("btnTask");
  const btnCategories = document.getElementById("btnCategories");
  const inputTask = document.querySelector('.input-task');
  const spanTitle = document.querySelector('.input-task-name-text');
  const inputTaskDesctiption = document.querySelector('.input-description');
  const spanTaskDesctiption = document.querySelector('.input-description-name-text');
  const inputCategories = document.querySelector('.input-categories');

  inputCategories?.addEventListener('mouseenter' || 'focus', () => { spanTitle?.classList.add('hover');})
  inputCategories?.addEventListener('mouseleave', () => { spanTitle?.classList.remove('hover'); })
  inputCategories?.addEventListener('focus', ()=> setErrorStatusTitle(false));
  inputTask?.addEventListener('mouseenter' || 'focus', () => { spanTitle?.classList.add('hover');})
  inputTask?.addEventListener('focus', ()=> setErrorStatusTitle(false));
  inputTask?.addEventListener('mouseleave', () => { spanTitle?.classList.remove('hover'); })

  inputTaskDesctiption?.addEventListener('mouseenter' || 'focus', () => { spanTaskDesctiption?.classList.add('hover');})
  inputTaskDesctiption?.addEventListener('mouseleave', () => { spanTaskDesctiption?.classList.remove('hover'); })
  inputTaskDesctiption?.addEventListener('focus', ()=> setErrorStatusDescription(false));
  const handleIsValid =(input?:any, span?:any)=>{
    input?.classList.remove('invalid');
    span?.classList.remove('invalid');
  }
  const handleIsInvalid = (inputTitle?:any, spanTitle?:any, inputDesctiption?:any, spanDesctiption?:any) => {
    inputTitle?.classList.add('invalid');
    spanTitle?.classList.add('invalid');
    inputDesctiption?.classList.add('invalid');
    spanDesctiption?.classList.add('invalid');
  }

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    todoList.completed ? handleIsValid(inputTask, spanTitle): handleIsValid(inputCategories, spanTitle);
    setNewText(e.target.value);
  };
  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    handleIsValid(inputTaskDesctiption, spanTaskDesctiption);
    setNewDescription(e.target.value);
  };
  const handleSubmitTask = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTitle === "" && newDescription !== ""){
      handleIsInvalid(inputTask, spanTitle);
      setErrorStatusTitle(true);
    }
    else if (newTitle !== "" && newDescription === ""){
      handleIsInvalid(inputTaskDesctiption, spanTaskDesctiption);
      setErrorStatusDescription(true);
    }
    else if (newTitle === "" && newDescription === "") {
      handleIsInvalid(inputTask, spanTitle, inputTaskDesctiption, spanTaskDesctiption);
      setErrorStatusDescription(true);
      setErrorStatusTitle(true);
    } 
    else {
      document.body.classList.remove("body-back");
      addTodoItem(newTitle, newDescription, newCategories);
      closeFormAdd(e);
      setStatus(!status);
    }
  };
  const handleSubmitCategories = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTitle === "" || newDescription === "") {
      handleIsInvalid(inputCategories, spanTitle, inputTaskDesctiption, spanTaskDesctiption);
    } else {
      document.body.classList.remove("body-back");
      addTodoCategories(newTitle, newDescription);
      closeFormAdd(e);
      setStatus(!status);
    }
  };
  const openFormAdd = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStatus(!status);
    document.body.classList.add("body-back");
  };
  const closeFormAdd = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.body.classList.remove("body-back");
    setStatus(!status);
    setNewText("");
    setNewDescription("");
    setErrorStatusDescription(false);
    setErrorStatusTitle(false);
    if(inputTask?.classList.contains("invalid")){
      inputTask?.classList.remove("invalid");
      spanTitle?.classList.remove("invalid");
    }
    if(inputTaskDesctiption?.classList.contains("invalid")){
      inputTaskDesctiption?.classList.remove("invalid");
      spanTaskDesctiption?.classList.remove("invalid");
    }
    if(inputCategories?.classList.contains("invalid")){
      inputCategories?.classList.remove("invalid");
      spanTitle?.classList.remove("invalid");
    }
  };
  const handlerChangeToCategories = (e: any) => {
    e.preventDefault();
    btnTaks?.classList.remove("header-btn-active");
    btnTaks?.classList.add("header-btn");
    btnCategories?.classList.add("header-btn-active");
    btnCategories?.classList.remove("header-btn");
    changeTodoItem(false);
  };
  const handlerChangeToTask = (e: any) => {
    e.preventDefault();
    btnCategories?.classList.remove("header-btn-active")
    btnCategories?.classList.add("header-btn");
    btnTaks?.classList.add("header-btn-active");
    btnTaks?.classList.remove("header-btn");
    changeTodoItem(true);
  };
  const handleChangeSelecter = (value: string) => {
    setCategories(value);
  }
  return (
    <>
      <header className={"header"}>
        <nav className={"header-nav"}>
          <label className={"title-label"}>Todo List</label>
          <nav className={"header-menu"}>
            <button id={"btnTask"} className={"header-btn-active"} onClick={handlerChangeToTask}>????????????</button>
            <img src={Tasks} alt={"tasks"} className={"header-img"} />
            <button id={"btnCategories"} className={"header-btn"} onClick={handlerChangeToCategories}>??????????????????</button>
          </nav>
        </nav>
        {todoList.completed ? <button type="submit" onClick={openFormAdd} className={"btn-add"}>
          ???????????????? ????????????
        </button> : <button type="submit" onClick={openFormAdd} className={"btn-add"}>
          ???????????????? ??????????????????
        </button>}
      </header>
      <form className={status ? "form-add-active" : "form-add"}>
        <label className={"title-modal-add"}>{todoList.completed ? "???????????????? ????????????" : "???????????????? ??????????????????"}</label>
        <div className={"input-task-name-title"}>
          <span className={"input-task-name-text"}>
            ??????
          </span>
          <img src={inputNameImg} alt="" className={"input-task-name-img"} />
        </div>
        <input
          type="text"
          value={newTitle}
          onChange={handleChangeText}
          required={true}
          className={todoList.completed ? "input-task" : "input-categories"}
          placeholder={todoList.completed ? "?????????????? ?????? ????????????" : "?????????????? ?????? ??????????????????"}
        />
        <label className={errorStatusTitle? "error-label-title-show":"error-title-label"}>???? ???????????????????? ???????????????????????? ????????</label>
        {todoList.completed ? <SelectListAdd selector={handleChangeSelecter} /> : null}
        <div className={"input-description-name-text"}>
          ????????????????
        </div>
        <textarea
          value={newDescription}
          onChange={handleChangeDescription}
          required={true}
          className={"input-description"}
          placeholder={todoList.completed ? "?????????????? ???????????????? ????????????" : "?????????????? ???????????????? ??????????????????"}
        />
        <label className={errorStatusDescription?'error-label-description-show':'error-description-label'}>???? ???????????????????? ???????????????????????? ????????</label>
        <button
          type="submit"
          onClick={todoList.completed ? handleSubmitTask : handleSubmitCategories}
          className={"form-btn-create"}
        >
          <span className={"form-btn-create-span"}>??????????????</span>
        </button>
        <button
          type="submit"
          onClick={closeFormAdd}
          className={"form-btn-cancel"}
        >
          <span className={"form-btn-cancel-span"}>??????????????</span>
        </button>
        <button onClick={closeFormAdd} className={"form-btn-close"}>
          <img src={iconClose} alt="" className={"icon-close"} />
        </button>
      </form>
    </>
  );
};