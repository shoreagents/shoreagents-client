const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any API methods you need to expose to the renderer process
  // For example:
  // sendMessage: (message) => ipcRenderer.send('message', message),
  // onMessage: (callback) => ipcRenderer.on('message', callback)
}); 