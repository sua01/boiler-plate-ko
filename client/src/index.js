import React from 'react';
// import ReactDOM from 'react-dom/client';
import { createRoot } from "react-dom/client";
import App from './App';

import './index.css';

import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';  // Ant Design
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

const creatStorewithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk) (createStore) // 객체밖에 못받으니까 promise, functions도 받을 수 있게 middleware 사용

const root = createRoot(document.getElementById("root")); // 에러 해결법

root.render(
  
  <Provider
    store={creatStorewithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()

      )}
  >
    <App />
  </Provider>
  
  , document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
