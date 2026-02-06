const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 生产环境下，加载 Next.js 导出的静态文件
  // 注意这里的路径：'out/index.html' 必须和 package.json 里的 files 对应
  win.loadFile(path.join(__dirname, 'out/index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
