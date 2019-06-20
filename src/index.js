import { combineReducers, createStore } from "redux";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import immutable from "object-path-immutable";

//reducer for todo's array
const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      console.log("adding");
      // return [...state, { id: action.id, text: action.text, completed: false }];
      return immutable.set(state, [], {
        user: action.id,
        text: action.text,
        completed: false
      });
    case "TOGGLE_TODO":
      console.log("CLICK " + action.id);
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );

    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos
});

const store = createStore(todoApp);

let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    return (
      <div>
        <input
          ref={node => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            store.dispatch({
              type: "ADD_TODO",
              text: this.input.value,
              id: nextTodoId++
            });
            this.input.value = "";
          }}
        >
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo => (
            <li
              key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: "TOGGLE_TODO",
                  id: todo.id
                });
              }}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "red" : "black"
              }}
            >
              {todo.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

//Rendered to the DOM. The TodoApp Component that takes props todos that is that current todos array from the redux store.
const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos} />,
    document.getElementById("root")
  );
};

//Adds a change listener. It will be called any time an action is dispatched,
store.subscribe(render);
render();
