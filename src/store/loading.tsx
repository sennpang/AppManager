import {create} from 'zustand';

export interface LoadingState {
  loading: boolean;
  setStat?: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>()(set => ({
  loading: false,
  setStat: (loading: boolean) => set({loading}),
}));
