import React, { useEffect, useState } from "react"
import logo from "connect2ic/assets/logo-dark.svg"

export function Intro() {

  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ fontSize: "2em", marginBottom: "0.5em" }}>Ready. Lets build the new web</p>
        <div style={{
          display: "flex",
          fontSize: "0.7em",
          textAlign: "left",
          padding: "2em",
          borderRadius: "30px",
          flexDirection: "column",
          background: "rgb(220 218 224 / 25%)",
        }}>
          <div>
            <code>npm run dev:</code>
            <span> Runs the development server</span>
          </div>
          <div>
            <code>npm run build:</code>
            <span> Builds your frontend for production</span>
          </div>
          <div>
            <code>npm run serve:</code>
            <span> Serves your production-built frontend locally</span>
          </div>
          <hr/>
          <div>
            <code>dfx deploy:</code>
            <span> Compiles & deploys your canisters</span>
          </div>
          <div style={{textAlign: "center", fontSize: "0.8em", marginTop: "2em"}}>
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
            {" | "}
            <a
              className="App-link"
              href="https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              IC SDK Docs
            </a>
          </div>
        </div>
        <p style={{fontSize: "0.6em"}}>
          This counter is running inside a canister
        </p>
        <p style={{fontSize: "0.4em"}}>by <a href="https://twitter.com/miamaruq">@miamaruq</a></p>
      </header>
    </>
  )
}