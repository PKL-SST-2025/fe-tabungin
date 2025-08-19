import { Component, createSignal, onMount, onCleanup } from 'solid-js';
import SearchBar from './SearchBar';
import { pageSearchData } from '../utils/pageSearchData';
import { isAdmin } from './userStore';
import { useNavigate } from '@solidjs/router';
import { userStore, updateUser } from './userStore';
import { sidebarStore } from '../stores/sidebarStore';
import { getUserProfile } from '../services/api';

interface NavbarDashboardProps {
  notificationCount?: number;
}

const NavbarDashboard: Component<NavbarDashboardProps> = (props) => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = createSignal(false);
  const [showMobileSearch, setShowMobileSearch] = createSignal(false);
  // notificationCount now comes from props

  const goToNotifikasi = () => {
    navigate('/Notifikasi');
  };

  const goToDashboardPengguna = () => {
    navigate('/DashboardPengguna');
  };

  const getUserName = () => {
    // Prioritaskan userStore
    if (userStore.user.name) return userStore.user.name;
    // Fallback ke localStorage jika userStore kosong
    const storedData = localStorage.getItem('userProfile');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.namaLengkap) return parsed.namaLengkap;
      } catch (err) {
        console.error('Gagal membaca userProfile dari localStorage', err);
      }
    }
    return 'Pengguna';
  };

  const getUserEmail = () => {
    // Prioritaskan userStore
    if (userStore.user.email) return userStore.user.email;
    // Fallback ke localStorage jika userStore kosong
    const storedData = localStorage.getItem('userProfile');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.email) return parsed.email;
      } catch (err) {
        console.error('Gagal membaca userProfile dari localStorage', err);
      }
    }
    return 'user@tabungin.com';
  };

  const getUserRole = () => {
    const email = getUserEmail();
    return email === 'admin@tabungin.com' ? 'Administrator' : 'User';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserAvatar = () => {
  // Selalu ambil dari userStore agar sinkron
  return userStore.user.avatar || null;
  };

  // Load user profile from API
  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await getUserProfile();
      if (response.success && response.data) {
        // Update userStore dengan data dari backend
        updateUser({
          name: response.data.full_name,
          email: response.data.email,
          avatar: response.data.avatar,
          password: userStore.user.password,
          role: response.data.is_admin ? 'admin' : 'user'
        });
        // Simpan ke localStorage agar konsisten
        localStorage.setItem('userProfile', JSON.stringify({
          namaLengkap: response.data.full_name,
          email: response.data.email,
          profileImage: response.data.avatar
        }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown());
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      setShowProfileDropdown(false);
    }
    // Close mobile search if clicking outside
    if (!target.closest('.mobile-search-container') && !target.closest('.mobile-search-toggle')) {
      setShowMobileSearch(false);
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    // Load user profile on mount
    loadUserProfile();
  });

  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const handleLogout = () => {
    const userName = getUserName();
    
    // Clear user data
    updateUser({
      name: '',
      email: '',
      avatar: null,
      password: ''
    });
    
    // Clear token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    alert(`Logout berhasil! Sampai jumpa lagi ${userName}.`);
    navigate('/login');
  };

  return (
    <>
      <header class="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          {/* Hamburger button untuk mobile dan desktop */}
          <button
            onClick={() => sidebarStore.toggle()}
            class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Toggle sidebar"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d={sidebarStore.isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
          
          <h1 class="text-xl font-bold text-green-800">Dashboard TABUNGIN</h1>
        </div>
      
      <div class="flex items-center space-x-6">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch())}
          class="md:hidden p-2 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 mobile-search-toggle"
          aria-label="Search"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div class="hidden md:block w-64">
          <SearchBar
            data={pageSearchData.filter(item => item.role === 'all' || (isAdmin() && item.role === 'admin'))}
            placeholder="Cari halaman/fitur..."
          />
        </div>

        {/* Notifications */}
        <div class="relative">
          <button
            onClick={goToNotifikasi}
            class="relative p-2 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Notifikasi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            {props.notificationCount && props.notificationCount > 0 && (
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {props.notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div class="relative profile-dropdown">
          <button
            onClick={toggleProfileDropdown}
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="User menu"
          >
            {/* Avatar */}
            {getUserAvatar() ? (
              <img 
                src={getUserAvatar()!} 
                alt="Avatar" 
                class="w-8 h-8 rounded-full object-cover border-2 border-green-200"
              />
            ) : (
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getUserInitials()}
              </div>
            )}
            
            {/* User Info - Hidden on mobile */}
            <div class="hidden sm:block text-left">
              <div class="text-sm font-medium text-gray-800">{getUserName()}</div>
              <div class="text-xs text-gray-500">{getUserRole()}</div>
            </div>
            
            {/* Dropdown Arrow */}
            <svg 
              class={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileDropdown() ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showProfileDropdown() && (
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info Header */}
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  {getUserAvatar() ? (
                    <img 
                      src={getUserAvatar()!} 
                      alt="Avatar" 
                      class="w-10 h-10 rounded-full object-cover border-2 border-green-200"
                    />
                  ) : (
                    <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitials()}
                    </div>
                  )}
                  <div>
                    <div class="font-medium text-gray-800">{getUserName()}</div>
                    <div class="text-sm text-gray-500">{getUserEmail()}</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div class="py-2">
                <button
                  onClick={() => {
                    goToDashboardPengguna();
                    setShowProfileDropdown(false);
                  }}
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Dashboard Saya
                </button>

                <button
                  onClick={() => {
                    navigate('/DashboardPengaturan');
                    setShowProfileDropdown(false);
                  }}
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Pengaturan
                </button>

                <div class="border-t border-gray-100 my-2"></div>

                <button
                  onClick={() => {
                    handleLogout();
                    setShowProfileDropdown(false);
                  }}
                  class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Mobile Search Bar */}
    {showMobileSearch() && (
      <div class="md:hidden bg-white border-b border-gray-200 px-6 py-3 mobile-search-container">
        <div class="relative">
          <SearchBar
            data={pageSearchData.filter(item => item.role === 'all' || (isAdmin() && item.role === 'admin'))}
            placeholder="Cari halaman/fitur..."
          />
        </div>
      </div>
    )}
    </>
  );
};

export default NavbarDashboard;
