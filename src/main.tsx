import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import "./features/scene/Scene"
import { App } from './App';
// Clear the existing HTML content
//document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<React.StrictMode>
    <Provider store={store}><App/>
    </Provider>
</React.StrictMode>);