const win: any = window;
const ipcRenderer = win.ipcRenderer;
let lister: any = null;
ipcRenderer.on('show_data', (event: any, arg: any) => {
    console.log('返回数据', arg);
    if (lister) {
        lister(arg);
    }
});

export function setLister(fn: any) {
    lister = fn;
}

//去下载
export async function goDown(href: string) {
    console.log('发送消息', href);
    ipcRenderer.send('go_down', href);
}

export async function goExcel(data: any) {
    console.log('发送消息', data);
    ipcRenderer.send('go_excel', data);
}
