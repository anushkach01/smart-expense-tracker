import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  isMobileOpen: boolean;
  drawerWidth: number;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  isMobileOpen: false,
  drawerWidth: 260,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  closeMobileSidebar: () => set({ isMobileOpen: false }),
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
}));