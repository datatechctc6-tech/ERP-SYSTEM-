const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const mysql = require("mysql2/promise");

let mainWindow;
let setupWindow;
let serverProcess;

// Path to store the user's database configuration persistently
const configPath = path.join(app.getPath("userData"), "db-config.json");

function getDbConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(data);
      // Basic validation
      if (config.host && config.user && config.database) {
        return config;
      }
    }
  } catch (err) {
    console.error("Error reading db config:", err);
  }
  return null;
}

function saveDbConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db config:", err);
  }
}

function createSetupWindow() {
  setupWindow = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    resizable: false,
  });

  setupWindow.loadFile(path.join(__dirname, "setup.html"));

  setupWindow.on("closed", function () {
    setupWindow = null;
  });
}

function createMainWindow() {
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

function startServer(dbConfig) {
  // Determine the path to server.js
  const serverPath = path.join(__dirname, "backend", "server.js");
  const envPath = path.join(__dirname, "backend", ".env");

  // Try to load any existing .env, but we will override with dbConfig
  try {
    require("dotenv").config({ path: envPath });
  } catch (e) {
    // Ignore error if dotenv is missing
  }

  // Override environment with saved config
  const env = {
    ...process.env,
    DB_HOST: dbConfig.host,
    DB_PORT: dbConfig.port.toString(),
    DB_USER: dbConfig.user,
    DB_PASS: dbConfig.password || "",
    DB_NAME: dbConfig.database,
    MASTER_DB_NAME: dbConfig.database,
  };

  serverProcess = spawn(
    // Use the bundled node executable path or rely on system node
    "node",
    [serverPath],
    {
      stdio: "inherit",
      env: env,
    },
  );
}

function initApp() {
  const dbConfig = getDbConfig();
  if (dbConfig) {
    // Config exists, start server and main window
    startServer(dbConfig);

    // Give the server a second to start up before loading the URL
    setTimeout(() => {
      createMainWindow();
    }, 1500);
  } else {
    // Show setup screen
    createSetupWindow();
  }
}

app.whenReady().then(() => {
  // Handle IPC for DB Config save from setup.html
  ipcMain.handle("save-db-config", async (event, config) => {
    try {
      // Test the connection
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
      });
      await connection.end(); // Close immediately if successful

      // If we reach here, connection is successful
      saveDbConfig(config);

      // Start backend and load main window
      startServer(config);
      setTimeout(() => {
        createMainWindow();
        if (setupWindow && !setupWindow.isDestroyed()) {
          setupWindow.close();
        }
      }, 1500);

      return { success: true };
    } catch (error) {
      console.error("Database connection failed:", error);
      return { success: false, error: error.message };
    }
  });

  // Start the application flow
  initApp();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) initApp();
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
