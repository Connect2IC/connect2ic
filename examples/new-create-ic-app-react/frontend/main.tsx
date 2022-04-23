import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { inspect } from "@xstate/inspect"

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
)
