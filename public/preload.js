// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.ipcRenderer = require('electron').ipcRenderer;

const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld('api', {
  createOppFolder: (args) => ipcRenderer.invoke('createOppFolder',args),
  renameOppFolder: (args) => ipcRenderer.invoke('renameOppFolder',args),
  createProjectFolder: (args) => ipcRenderer.invoke('createProjectFolder',args),
  openFolder: () => ipcRenderer.invoke('openFolder'),
  
})

