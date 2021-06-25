/**
 * 路由的参数
 */
interface iLocation {
    pathname: string;
    search: string;
    hash: string;
}
/**
 * 路由方法
 */
interface iHistory extends History {
    length: number;
    push(path: string): void;
    push(path: string, state: any): void;
    replace(path: string, state: any): void;
    go(n: string): void;
    goBack(): void;
    goForward(): void;
}
/**
 * react-dom的路由props
 */
interface iReactRoute {
    location: iLocation;
    history: iHistory;
}

interface Window {
    clipboardData?: any;
    netscape?: any;
    Components?: any;
}
