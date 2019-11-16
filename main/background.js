import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  });

	const workerWindow = createWindow('worker', {
		show: false,  // <--- Comment me out to debug the worker window
    webPreferences: { nodeIntegration: true }
	});

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

	mainWindow.on('closed', () => {
	 // call quit to exit, otherwise the background windows will keep the app running
	 app.quit()
	})

	// Main thread can receive directly from windows
	ipcMain.on('to-main', (event, arg) => {
	 console.log(arg)
	});

	// Windows can talk to each other via main
	ipcMain.on('for-renderer', (event, arg) => {
	 mainWindow.webContents.send('to-renderer', arg);
	});

	ipcMain.on('for-worker', (event, arg) => {
	 workerWindow.webContents.send('to-worker', arg);
	});


	await workerWindow.loadFile(path.join(app.getAppPath(),'main', 'worker.html'))

})();

app.on('window-all-closed', () => {
  app.quit();
});
