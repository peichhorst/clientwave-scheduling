(function () {
  const script = document.currentScript
  if (!(script instanceof HTMLScriptElement)) return

  const userId = script.getAttribute('data-user-id')
  const token = script.getAttribute('data-token')
  if (!userId && !token) return

  let container = document.getElementById('clientwave-scheduler')
  if (!container) {
    container = document.createElement('div')
    container.id = 'clientwave-scheduler'
    script.parentNode?.insertBefore(container, script)
  }

  if (userId) {
    container.dataset.userId = userId
  }
  if (token) {
    container.dataset.token = token
  }

  const bundle = document.createElement('script')
  bundle.src = 'https://clientwave-scheduling.vercel.app/main.js'
  bundle.type = 'module'
  bundle.onload = () => {
    if (window.mountScheduler && container) {
      window.mountScheduler(container)
    }
  }
  document.head.appendChild(bundle)
})()
