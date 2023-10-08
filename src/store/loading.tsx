import {create} from 'zustand';

export interface LoadingState {
  loading: boolean;
  text: string;
  setStat?: (loading: boolean, text?: string) => void;
}

export const useLoadingStore = create<LoadingState>()(set => ({
  loading: false,
  text: '',
  setStat: (loading: boolean, text) => set({loading, text}),
}));
