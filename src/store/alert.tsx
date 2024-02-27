import {create} from 'zustand';

interface Alert {
  title?: string;
  msg?: string;
  open?: boolean;
  confirm?: string;
  dismissable?:boolean;
  confirmCb?: (p?: any) => void;
  cancelCb?: (p?: any) => void;
}
export interface AlertState {
  info: Alert;
  setInfo: (by: Alert) => void;
}

export const useAlertStore = create<AlertState>()(set => ({
  info: {open: false, title: '', msg: '', dismissable:true},
  setInfo: (info: Alert) => set({info}),
}));
