/* Imports */
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
const { is } = require('electron-util');
const menuTemplete = require('./menu/menu');
const { localIpWifi, localIpVEthernet, getIpList } = require('./ips/ips');

/* Main window*/
let win;
/* Development */
is.development = true;

async function createWindow() {
  win = new BrowserWindow({
    backgroundColor: '#FFF',
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: is.development,
    },
  });
  if (process.platform === 'darwin') {
    menuTemplete.unshift({
      label: app.getName(),
      role: 'APP',
    });
  }

  win.webContents.send('ips_datas', {
    ipList: await getIpList(),
    localIpWifi,
    localIpVEthernet,
  });

  const mainMenu = Menu.buildFromTemplate(menuTemplete);
  Menu.setApplicationMenu(mainMenu);
  if (is.development) {
      /* Dev tool */
    // win.webContents.openDevTools({ mode: 'detach' });
  }
  /* Serve files */
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file:',
    slashes: true,
  }));
}

app.on('ready', () => {
  process.stdout.write('App running');
  createWindow();
});
