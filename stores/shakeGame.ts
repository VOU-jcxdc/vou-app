import { create } from 'zustand';

interface ShakeGameStore {
  config: number;
  setConfig: (config: number) => void;
  decrementConfig: () => void;
}

const useShakeGameStore = create<ShakeGameStore>((set) => ({
  config: 10,
  setConfig: (config) => set({ config }),
  decrementConfig: () => set((state) => ({ config: state.config - 1 })),
}));

export default useShakeGameStore;
