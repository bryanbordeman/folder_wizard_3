// ./public/electron.js
const path = require('path');
const { app, BrowserWindow, session, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const os = require('os')
const {PythonShell} = require('python-shell')

let currentOppDirectory = ''

function createWindow() {
    // Create the browser window.

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, './icons/icon_win.png')
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools();
    }
}
    // on macOS
    const reactDevToolsPath = path.join(
        os.homedir(),
        '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.25.0_1'
    )
    
    app.whenReady().then(async () => {
        await session.defaultSession.loadExtension(reactDevToolsPath);
    })
    
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(createWindow);

    ipcMain.handle('createOppFolder', (event, args) => {
        var options = {
            scriptPath : './engine/',
            args : args,
            env: process.env,
        }
        let pyshell = new PythonShell('create_opp_folder.py', options);
    
        return new Promise((resolve,reject) =>{
            pyshell.on('message', (message) => {
                console.log(message); // prints to node terminal
                currentOppDirectory = message
                })
                
            pyshell.end((err, code) => {
                if (err) {
                    console.log(err)
                };
                // console.log(code);
                if (code === 0){
                    resolve(true)
                }else{
                    resolve(false)
                }
            });
        })
    });

    ipcMain.handle('openFolder', (event, args) => {
        var options = {
            scriptPath : './engine/',
            args : currentOppDirectory,
            env: process.env,
        }
        let pyshell = new PythonShell('open_folder.py', options);
    
        return new Promise((resolve,reject) =>{
            pyshell.on('message', (message) => {
                console.log(message); // prints to node terminal
                })
                
            pyshell.end((err, code) => {
                if (err) {
                    console.log(err)
                };
                // console.log(code);
                if (code === 0){
                    resolve(true)
                }else{
                    resolve(false)
                }
            });
        })
    });


    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bars to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    });

    app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
    });

    app.setName('Folder Wizard');
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

    if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, './icons/icon_mac.png'));
    }
