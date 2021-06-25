const {
    app, // 控制应用生命周期的模块
    BrowserWindow, // 创建原生浏览器窗口的模块
    Tray,
    screen,
    BrowserView,
    ipcMain,
    globalShortcut,
} = require('electron');

const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');

const rootFolder = app.getAppPath();
const isDev = process.env.NODE_ENV === 'development';

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window, tray 会被自动地关闭
let mainWindow = null;
let tray = null;

const windowWidth = 1000;
const windowHeight = 600;

function createWindow() {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        show: false,
        backgroundColor: '#403F4D',
        icon: path.join(rootFolder, 'assets', 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: false,
            preload: path.join(__dirname, 'preload.js'),
            devTools: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            contextIsolation: false,
        },
    });

    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(rootFolder, '/build/index.html')}`;
    mainWindow.loadURL(startURL);
    // mainWindow.loadURL('file://' + process.cwd() + '/public/index.html');

    globalShortcut.register('CommandOrControl+Shift+i', function () {
        mainWindow.webContents.openDevTools();
    });

    mainWindow.once('ready-to-show', () => mainWindow.show());

    tray = new Tray(path.join(rootFolder, 'assets', 'icon.png'));
    tray.setToolTip('Click to access OneCopy');

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    // 当所有窗口被关闭了，退出。
    app.on('window-all-closed', function () {
        // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
        // 应用会保持活动状态
        if (process.platform !== 'darwin') app.quit();
    });

    // 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
    // 这个方法就被调用
    app.on('ready', () => {
        // 调用创建浏览器窗口。
        createWindow();

        // Set App ID for notifications
        app.setAppUserModelId('com.hiroshifuu.onecopy-electron');

        // 打开开发工具
        if (isDev) mainWindow.openDevTools();

        // 当 window 被关闭，这个事件会被发出
        mainWindow.on('closed', function () {
            // 取消引用 window 对象，如果你的应用支持多窗口的话，
            // 通常会把多个 window 对象存放在一个数组里面，
            // 但这次不是。
            mainWindow = null;
        });
    });

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null || BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // Listen for 'open-main-window' event from renderer process
    ipcMain.on('open-main-window', () => {
        // Set always on top to true so that
        // mainwindow can be viewed on top of other apps
        mainWindow.setAlwaysOnTop(true);
        // Show the window now
        mainWindow.show();
        // Reset the always on top property
        mainWindow.setAlwaysOnTop(false);
    });

    ipcMain.on('minimize-app', () => {
        // Hide the main window
        mainWindow.hide();
    });

    ipcMain.on('quit-app', () => {
        // Quit the app and close all windows
        app.quit();
    });
    //收到下载的消息
    ipcMain.on('go_down', (e, href) => {
        console.log('收到消息', href);
        DownloadPage(href);
    });
    //excel
    ipcMain.on('go_excel', (e, data) => {
        console.log('收到消息', data);
        goExcel(data);
    });
}
// 下载页面
async function DownloadPage(href) {
    const win = new BrowserView();
    mainWindow.setBrowserView(win);
    win.setBounds({ x: 0, y: 0, width: 100, height: 100 });
    win.webContents.on('did-finish-load', async function () {
        try {
            const data = await win.webContents.executeJavaScript('window.__INITIAL_SSR_STATE__');
            mainWindow.removeBrowserView(win);
            loadPage(href, data.NoteView);
        } catch (error) {
            console.log(error);
            error_send(model);
        }
    });
    win.webContents.loadURL(href);
}
function loadPage(href, data) {
    const model = {
        id: data.noteInfo.id,
        href,
        title: data.noteInfo.title,
        pub_time: data.noteInfo.time,
        zan: data.noteInfo.likes,
        cang: data.noteInfo.collects,
        talk: data.commentInfo.commentsTotal,
        label: data.noteInfo.seoMeta.keywords,
        main: 'https://www.xiaohongshu.com/user/profile/' + data.noteInfo.user.id,
        name: data.noteInfo.user.nickname,
    };
    console.log(model);
    DownloadMain(model.main, model);
}
//加载主页
function DownloadMain(main, model) {
    const win = new BrowserView();
    mainWindow.setBrowserView(win);
    win.setBounds({ x: 0, y: 0, width: 100, height: 100 });
    win.webContents.on('did-finish-load', async function () {
        try {
            const data = await win.webContents.executeJavaScript('window.__INITIAL_SSR_STATE__');
            mainWindow.removeBrowserView(win);
            loadMain(model, data.Main);
        } catch (error) {
            console.log(error);
            error_send(model);
        }
    });
    win.webContents.loadURL(main);
}
// 加载内容
function loadMain(model, data) {
    model.fans = data.userDetail.fans;
    model.zancang = data.userDetail.liked + data.userDetail.collected;
    model.level = data.userDetail.level.name;
    console.log(model);
    success(model);
}

function send(key, data) {
    mainWindow.webContents.send(key, data);
}

function success(data) {
    data.state = 1;
    send('show_data', data);
}
function error_send(data) {
    data.state = 2;
    send('show_data', data);
}

function goExcel(data) {
    console.log(data);
    const list = [['发布链接', '标题', '发布时间', '点赞数', '收藏数', '评论数', '收录标签', '红人主页链接', '红人昵称', '粉丝数', '总赞藏数']];
    data.forEach((item) => {
        list.push([item.href, item.title, item.pub_time, item.zan, item.cang, item.talk, item.label, item.main, item.name, item.fans, item.zancang]);
    });
    const buf = xlsx.build([{ name: 'xiaohongshu', data: list }]);
    fs.writeFile(app.getPath('desktop') + '/xiaohongshu.xlsx', buf, {}, function (err) {
        console.log(err);
    });
}
