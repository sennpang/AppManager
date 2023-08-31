interface App {
  isMerged: number;
  [propName: string]: string;
}
interface Css {
  [propName: string]: string | number;
}

interface AppList {
  [index: number]: App;
}

interface Api {
  key: string;
  id: number;
}
interface ApiList {
  length: number;
  map(arg0: (item: Api) => React.JSX.Element): unknown;
  [index: number]: Api;
}

interface State {
  loading: boolean;
  keyList: ApiList;
}

interface ApiResponse {
  code: number;
  message: string;
  data: any;
}
