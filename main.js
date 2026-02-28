const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true, // Hide the default menu bar for a cleaner look
  });

  // We navigate to the local express server which serves both API and React
  mainWindow.loadURL("http://localhost:5000");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

function startServer() {
  // Determine the path to server.js
  // In development it's just ./backend/server.js
  // In production (packaged app), paths might vary depending on how files are packaged
  const serverPath = path.join(__dirname, "backend", "server.js");
  const envPath = path.join(__dirname, "backend", ".env");

  // Load the .env from the backend directory to explicitly provide it to the backend
  require("dotenv").config({ path: envPath });

  serverProcess = spawn(
    // Use the bundled node executable path or rely on system node
    // Warning: for a true standalone app, you'd want to package node as well
    // Since we are running a script, we execute node
    "node",
    [serverPath],
    {
      stdio: "inherit",
      env: { ...process.env },
    },
  );
}

app.whenReady().then(() => {
  startServer();

  // Give the server a second to start up before loading the URL
  setTimeout(() => {
    createWindow();
  }, 1500);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  // Ensure we kill the background server process when Electron quits
  if (serverProcess) {
    serverProcess.kill();
  }
});
