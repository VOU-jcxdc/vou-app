import { create } from 'zustand';

interface NotificationStore {
  isGranted: boolean;
  topics: string[];
  setIsGranted: (granted: boolean) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  isGranted: false,
  topics: ['event'],
  setIsGranted: (isGranted: boolean) => set({ isGranted }),
}));

export default useNotificationStore;
