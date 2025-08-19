import { createSignal } from 'solid-js';

// Global store untuk state sidebar
const getInitialSidebarState = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  }
  return true;
};

const [isSidebarOpen, setIsSidebarOpen] = createSignal(getInitialSidebarState());

export const sidebarStore = {
  get isOpen() {
    return isSidebarOpen();
  },
  
  toggle() {
    const newState = !isSidebarOpen();
    setIsSidebarOpen(newState);
    
    // Simpan state ke localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    }
  },
  
  set(state: boolean) {
    setIsSidebarOpen(state);
    
    // Simpan state ke localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(state));
    }
  }
};
