const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveConfig: (config) => ipcRenderer.invoke("save-db-config", config),
});
