import { Component, For } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { sidebarStore } from '../stores/sidebarStore';

interface SidebarProps {
  // Tidak perlu props lagi karena menggunakan global store
}

const menuItems = [
  { name: 'Dashboard', icon: '🏠', path: '/Dashboard' },
  { name: 'Testimoni', icon: '💬', path: '/DashboardTestimoni' },
  { name: 'Pengguna', icon: '👤', path: '/DashboardPengguna' },
  { name: 'Analytics', icon: '📈', path: '/DashboardAnalysics' },
  { name: 'Pengaturan', icon: '⚙️', path: '/DashboardPengaturan' }
];

const Sidebar: Component<SidebarProps> = () => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Only show allowed menu items for user role
  let filteredMenuItems = menuItems;
  // @ts-ignore
  if (window.localStorage.getItem('user')) {
    const user = JSON.parse(window.localStorage.getItem('user'));
    if (user.role === 'user') {
      filteredMenuItems = menuItems.filter(item => ['Dashboard', 'Pengguna', 'Pengaturan'].includes(item.name));
    }
  }

  return (
    <>
      {/* Overlay untuk mobile */}
      {sidebarStore.isOpen && (
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => sidebarStore.toggle()}
        />
      )}
      
      {/* Sidebar - Fixed dan Sticky */}
      <div class={`
        fixed top-0 left-0 z-50 bg-green-800 text-white 
        transform transition-all duration-300 ease-in-out flex flex-col h-screen
        shadow-xl overflow-hidden
        ${sidebarStore.isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-16'}
      `}>
        <div class={`p-6 border-b border-green-700 flex-shrink-0 ${!sidebarStore.isOpen ? 'lg:px-4' : ''}`}>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div class="w-4 h-4 bg-white rounded-full"></div>
            </div>
            {sidebarStore.isOpen && (
              <span class="text-xl font-bold transition-all duration-300 overflow-hidden whitespace-nowrap">TABUNGIN</span>
            )}
          </div>
        </div>
        
        <nav class={`p-4 flex-1 overflow-y-auto overflow-x-hidden ${!sidebarStore.isOpen ? 'lg:px-2' : ''}`}>
          <For each={filteredMenuItems}>
            {(item) => (
              <A
                href={item.path}
                class={`w-full flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-200 group relative ${
                  !sidebarStore.isOpen ? 'lg:justify-center lg:px-2' : 'space-x-3'
                } ${
                  isActivePath(item.path)
                    ? 'bg-green-700 text-white shadow-md'
                    : 'text-green-200 hover:bg-green-700 hover:text-white'
                }`}
                title={!sidebarStore.isOpen ? item.name : ''}
              >
                <span class="text-lg flex-shrink-0">{item.icon}</span>
                {sidebarStore.isOpen && (
                  <span class="font-medium transition-all duration-300 overflow-hidden whitespace-nowrap">{item.name}</span>
                )}
                {!sidebarStore.isOpen && (
                  <div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                    {item.name}
                  </div>
                )}
              </A>
            )}
          </For>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
