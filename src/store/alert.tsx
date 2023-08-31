import {create} from 'zustand';

interface Alert {
  title?: string;
  msg?: string;
  open?: boolean;
  confirm?: string;
  confirmCb?: (p?: any) => void;
  cancleCb?: (p?: any) => void;
}
export interface AlertState {
  info: Alert;
  setInfo: (by: Alert) => void;
}

export const useAlertStore = create<AlertState>()(set => ({
  info: {open: false, title: '', msg: ''},
  setInfo: (info: Alert) => set({info}),
}));
