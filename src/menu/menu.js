const { platform } = process;
// const electron = require('electron');

module.exports = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Ip List',
        accelerator: 'Reload Ip',
        click() {
          // getCurrentWindow().reload()
        },
      },
      {
        label: 'Quit',
        accelerator: platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        role: 'quit',
      },
    ],
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'Toggle Dev Tools',
        click(item, focusedWindows) {
          focusedWindows.toggleDevTools();
        },
      },
    ],
  },
];
