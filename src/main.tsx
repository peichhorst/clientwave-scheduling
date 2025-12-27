import React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import Scheduler from './App'

export function mountScheduler(container: HTMLElement) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Scheduler />
    </React.StrictMode>
  )
}

declare global {
  interface Window {
    Scheduler: typeof Scheduler
    React: typeof React
    ReactDOM: typeof ReactDOM
    mountScheduler: typeof mountScheduler
  }
}

window.Scheduler = Scheduler
window.React = React
window.ReactDOM = ReactDOM
window.mountScheduler = mountScheduler

const rootElement = document.getElementById('root')

if (rootElement) {
  mountScheduler(rootElement)
}
