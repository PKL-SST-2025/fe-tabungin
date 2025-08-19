import { Component, createSignal, For, onMount, Show } from 'solid-js';
import Sidebar from '../components/Sidebar';
import NavbarDashboard from '../components/NavbarDashboard';
import StreakCalendar from '../components/StreakCalendar';
import TargetCalendar from '../components/TargetCalendarSimple';
import { userStore, updateUser } from '../components/userStore';
import { sidebarStore } from '../stores/sidebarStore';
import { 
  getSavingsTargets, 
  createSavingsTarget, 
  addDepositToTarget,
  getUserStatistics,
  getUserAchievements,
  getUserActivities,
  getCalendarEvents,
  getUserStreakData,
  getUserProfile
} from '../services/api';

interface SavingsTarget {
  id: string;
  icon: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  percentage: number;
  daysRemaining: number;
  iconColor: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  amount: string;
  icon: string;
  iconColor: string;
}

const DashboardPengguna: Component = () => {
  // Route guard: Only allow user to access dashboard pages
  if (userStore.user.role === 'user') {
    const allowedPaths = ['/dashboard', '/dashboardpengguna', '/dashboardpengaturan'];
    const currentPath = window.location.pathname.toLowerCase();
    if (!allowedPaths.includes(currentPath)) {
      window.location.href = '/dashboardpengguna';
      return null;
    }
  }
  const [showModal, setShowModal] = createSignal(false);
  const [targetName, setTargetName] = createSignal('');
  const [targetAmount, setTargetAmount] = createSignal<number | null>(null);
  const [targetDate, setTargetDate] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const [showDepositModal, setShowDepositModal] = createSignal(false);
  const [selectedTargetId, setSelectedTargetId] = createSignal('');
  const [depositAmount, setDepositAmount] = createSignal<number | null>(null);

  // Data from API
  const [savingsTargets, setSavingsTargets] = createSignal<any[]>([]);
  const [achievements, setAchievements] = createSignal<any[]>([]);
  const [activities, setActivities] = createSignal<any[]>([]);
  const [calendarEvents, setCalendarEvents] = createSignal<any[]>([]);
  const [streakData, setStreakData] = createSignal<any>(null);
  const [statistics, setStatistics] = createSignal<any>({
    total_saved: 0,
    streak_days: 0, // Tidak dipakai lagi untuk tampilan
    daily_average: 0,
    achievements_count: 0
  });

  // Dapatkan nama user dari userStore, fallback ke localStorage jika kosong
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

  const getUserAvatar = () => {
  // Selalu ambil dari userStore agar sinkron
  return userStore.user.avatar || null;
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Load data from API
  const loadData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Available' : 'Not found');
      
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      // Load user profile first
      try {
        console.log('Loading user profile...');
        const profileResponse = await getUserProfile();
        console.log('Profile response:', profileResponse);
        if (profileResponse.success && profileResponse.data) {
          // Update userStore dengan data dari backend
          updateUser({
            name: profileResponse.data.full_name,
            email: profileResponse.data.email,
            avatar: profileResponse.data.avatar,
            password: userStore.user.password,
            role: profileResponse.data.is_admin ? 'admin' : 'user'
          });
          // Simpan ke localStorage agar konsisten
          localStorage.setItem('userProfile', JSON.stringify({
            namaLengkap: profileResponse.data.full_name,
            email: profileResponse.data.email,
            profileImage: profileResponse.data.avatar
          }));
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
      }

      // Load savings targets
      try {
        console.log('Loading savings targets...');
        const targetsResponse = await getSavingsTargets();
        console.log('Targets response:', targetsResponse);
        if (targetsResponse.success) {
          console.log('Targets data:', targetsResponse.data);
          console.log('Number of targets:', targetsResponse.data?.length || 0);
          setSavingsTargets(targetsResponse.data || []);
        }
      } catch (err) {
        console.error('Error loading savings targets:', err);
      }

      // Load user statistics
      try {
        console.log('Loading user statistics...');
        const statsResponse = await getUserStatistics();
        console.log('Stats response:', statsResponse);
        if (statsResponse.success) {
          setStatistics(statsResponse.data || {
            total_saved: 0,
            streak_days: 0,
            daily_average: 0,
            achievements_count: 0
          });
        }
      } catch (err) {
        console.error('Error loading statistics:', err);
      }

      // Load achievements
      try {
        console.log('Loading achievements...');
        const achievementsResponse = await getUserAchievements();
        console.log('Achievements response:', achievementsResponse);
        if (achievementsResponse.success) {
          setAchievements(achievementsResponse.data || []);
        }
      } catch (err) {
        console.error('Error loading achievements:', err);
      }

      // Load activities
      try {
        console.log('Loading activities...');
        const activitiesResponse = await getUserActivities(10);
        console.log('Activities response:', activitiesResponse);
        if (activitiesResponse.success) {
          setActivities(activitiesResponse.data || []);
        }
      } catch (err) {
        console.error('Error loading activities:', err);
      }

      // Load streak data
      try {
        console.log('Loading streak data...');
        const streakResponse = await getUserStreakData(16);
        console.log('Streak response:', streakResponse);
        if (streakResponse.success) {
          setStreakData(streakResponse.data);
        }
      } catch (err) {
        console.error('Error loading streak data:', err);
      }

      // Load calendar events
      try {
        console.log('Loading calendar events...');
        
        // DEBUG: Check token status
        const token = localStorage.getItem('token');
        console.log('Token status:', token ? 'Present' : 'Missing');
        console.log('Token length:', token?.length || 0);
        if (token) {
          console.log('Token preview:', token.substring(0, 20) + '...');
        }
        
        // Load calendar events for current month
        loadCalendarEvents();
      } catch (err) {
        console.error('Error loading calendar events:', err);
        console.error('Calendar events error details:', {
          message: err.message,
          stack: err.stack
        });
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function untuk load calendar events berdasarkan bulan yang sedang ditampilkan
  const loadCalendarEvents = async (month?: number, year?: number) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No token found, user needs to login');
        return;
      }
      
      // Use current viewed month/year or default to current date
      const targetMonth = month || new Date().getMonth() + 1;
      const targetYear = year || new Date().getFullYear();
      
      console.log('🔄 Loading calendar events for:', { month: targetMonth, year: targetYear });
      console.log('🔐 Using token:', token.substring(0, 20) + '...');
      
      const eventsResponse = await getCalendarEvents(targetMonth, targetYear);
      console.log('📊 Calendar events API response:', eventsResponse);
      
      if (eventsResponse && eventsResponse.success) {
        console.log('✅ Calendar events loaded successfully:', eventsResponse.data?.length || 0, 'events');
        console.log('� Events details:', eventsResponse.data?.map(e => ({
          date: e.date,
          type: e.type,
          title: e.title,
          description: e.description
        })));
        setCalendarEvents(eventsResponse.data || []);
        
        // Cache successful response
        localStorage.setItem('tabungin_calendar_events', JSON.stringify(eventsResponse.data || []));
        console.log('💾 Cached calendar events for August 2025');
      } else {
        console.warn('⚠️ Calendar events API returned unsuccessful response:', eventsResponse);
        setCalendarEvents([]);
      }
    } catch (err) {
      console.error('❌ Error loading calendar events:', err);
      console.error('❌ Error details:', err.message, err.stack);
      setCalendarEvents([]);
    }
  };

  // Load data on mount
  onMount(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userProfile');
    console.log('User token:', token ? 'Present' : 'Missing');
    console.log('User info:', userInfo);
    loadData();
    
    // Listen untuk calendar refresh event
    const handleCalendarRefresh = () => {
      console.log('🔄 Calendar refresh requested, reloading events...');
      loadCalendarEvents();
    };
    
    // Listen untuk calendar month change event
    const handleMonthChange = (event: CustomEvent) => {
      console.log('📅 Calendar month changed:', event.detail);
      loadCalendarEvents(event.detail.month, event.detail.year);
    };
    
    window.addEventListener('calendar-needs-refresh', handleCalendarRefresh);
    window.addEventListener('calendar-month-changed', handleMonthChange as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('calendar-needs-refresh', handleCalendarRefresh);
      window.removeEventListener('calendar-month-changed', handleMonthChange as EventListener);
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  const handleAddTarget = async () => {
    if (!targetName() || !targetAmount() || !targetDate()) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        return;
      }
      
      // Validate target date is in the future
      const selectedDate = new Date(targetDate());
      const now = new Date();
      if (selectedDate <= now) {
        setError('Tanggal target harus di masa depan.');
        return;
      }
      
      console.log('Creating target:', {
        name: targetName(),
        amount: targetAmount(),
        targetDate: selectedDate.toISOString()
      });
      
      const response = await createSavingsTarget(
        targetName(),
        targetAmount()!,
        '📌',
        'bg-purple-500',
        selectedDate.toISOString()
      );
      
      console.log('Create target response:', response);
      
      if (response.success) {
        // Reload data after creating
        await loadData();
        
        setTargetName('');
        setTargetAmount(null);
        setTargetDate('');
        setShowModal(false);
      } else {
        setError(response.message || 'Gagal membuat target tabungan');
      }
    } catch (error: any) {
      console.error('Error creating savings target:', error);
      setError(error.message || 'Gagal membuat target tabungan');
    } finally {
      setIsLoading(false);
    }
  };

  // Function untuk nabung sekarang
  const handleNabungSekarang = () => {
    setShowDepositModal(true);
  };

  // Function untuk lihat laporan  
  const handleLihatLaporan = () => {
    // Scroll ke bagian streak
    const streakSection = document.getElementById('streak-section');
    if (streakSection) {
      streakSection.scrollIntoView({ behavior: 'smooth' });
    }
    // window.alert('Fitur laporan akan segera hadir!');
  };

  // Function untuk atur target
  const handleAturTarget = () => {
    setShowModal(true);
  };

  // Function untuk deposit ke target
  const handleDeposit = async () => {
    if (!depositAmount() || !selectedTargetId()) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Depositing:', {
        targetId: selectedTargetId(),
        amount: depositAmount(),
        availableTargets: savingsTargets().map(t => ({ id: t.id, name: t.name }))
      });
      
      const response = await addDepositToTarget(selectedTargetId(), depositAmount()!);
      console.log('Deposit response:', response);
      
      if (response.success) {
        // Hanya reload data yang diperlukan untuk menghindari multiple calls
        try {
          // Update savings targets
          const targetsResponse = await getSavingsTargets();
          if (targetsResponse.success) {
            setSavingsTargets(targetsResponse.data || []);
          }
          
          // Update statistics
          const statsResponse = await getUserStatistics();
          if (statsResponse.success) {
            setStatistics(statsResponse.data || {
              total_saved: 0,
              streak_days: 0,
              daily_average: 0,
              achievements_count: 0
            });
          }
          
          // Update activities
          const activitiesResponse = await getUserActivities(10);
          if (activitiesResponse.success) {
            setActivities(activitiesResponse.data || []);
          }
          // Update streak data agar jumlah tabung di streak bertambah
          const streakResponse = await getUserStreakData(16);
          if (streakResponse.success) {
            setStreakData(streakResponse.data);
          }
        } catch (err) {
          console.error('Error refreshing data after deposit:', err);
        }
        
        setDepositAmount(null);
        setSelectedTargetId('');
        setShowDepositModal(false);
      } else {
        setError(response.message || 'Gagal menambah deposit');
      }
    } catch (error: any) {
      console.error('Error adding deposit:', error);
      setError(error.message || 'Gagal menambah deposit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <Sidebar />

      <div class={`transition-all duration-300 ${sidebarStore.isOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <NavbarDashboard />
        <main class="p-6">
          {/* Error Message */}
          {error() && (
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <div class="flex items-center">
                <span class="text-red-500 mr-2">⚠️</span>
                {error()}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading() && (
            <div class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* Header */}
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                {getUserAvatar() ? (
                  <img 
                    src={getUserAvatar()!} 
                    alt="Avatar" 
                    class="w-12 h-12 rounded-full object-cover border-3 border-green-200 shadow-md"
                  />
                ) : (
                  <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {getUserInitials()}
                  </div>
                )}
                <div>
                  <h1 class="text-xl font-bold text-gray-800">Halo, {getUserName()}!</h1>
                  <p class="text-gray-600">Selamat datang kembali di Tabungan</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                + Tambah Target
              </button>
            </div>
          </div>

          {/* Modal Tambah Target */}
          {showModal() && (
            <div class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
              <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Tambah Target Tabungan</h2>
                <input
                  type="text"
                  placeholder="Nama Target"
                  value={targetName()}
                  onInput={(e) => setTargetName(e.currentTarget.value)}
                  class="w-full mb-3 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Nominal Target"
                  value={targetAmount() ?? ''}
                  onInput={(e) => setTargetAmount(parseInt(e.currentTarget.value))}
                  class="w-full mb-3 p-2 border rounded"
                />
                <div class="mb-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Target</label>
                  <input
                    type="date"
                    value={targetDate()}
                    onInput={(e) => setTargetDate(e.currentTarget.value)}
                    class="w-full p-2 border rounded"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div class="flex justify-end space-x-2 mt-4">
                  <button
                    class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={handleAddTarget}
                    disabled={!targetName() || !targetAmount() || !targetDate()}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Deposit/Nabung */}
          {showDepositModal() && (
            <div class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
              <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Nabung ke Target</h2>
                
                {savingsTargets().length === 0 ? (
                  <div class="text-center py-4">
                    <p class="text-gray-600 mb-4">Belum ada target tabungan. Buat target terlebih dahulu.</p>
                    <button
                      class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => {
                        setShowDepositModal(false);
                        setShowModal(true);
                      }}
                    >
                      Buat Target
                    </button>
                  </div>
                ) : (
                  <>
                    <select
                      value={selectedTargetId()}
                      onChange={(e) => setSelectedTargetId(e.currentTarget.value)}
                      class="w-full mb-3 p-2 border rounded"
                    >
                      <option value="">Pilih Target</option>
                      {savingsTargets().map((target) => (
                        <option value={target.id}>{target.name}</option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      placeholder="Jumlah Deposit"
                      value={depositAmount() ?? ''}
                      onInput={(e) => setDepositAmount(parseInt(e.currentTarget.value))}
                      class="w-full mb-3 p-2 border rounded"
                    />
                  </>
                )}
                
                <div class="flex justify-end space-x-2 mt-4">
                  <button
                    class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setShowDepositModal(false)}
                  >
                    Batal
                  </button>
                  {savingsTargets().length > 0 && (
                    <button
                      class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={handleDeposit}
                      disabled={!selectedTargetId() || !depositAmount() || isLoading()}
                    >
                      {isLoading() ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
              {/* Balance */}
              <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <h2 class="text-lg font-medium mb-2">Saldo Tabungan Anda</h2>
                <div class="text-3xl font-bold mb-4">{formatCurrency(statistics().total_saved || 0)}</div>

                <div class="grid grid-cols-3 gap-4 mt-6">
                  <div class="text-center cursor-pointer hover:bg-green-400 hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200 hover:scale-105 hover:shadow-md" onClick={handleNabungSekarang}>
                    <div class="bg-white bg-opacity-20 rounded-lg p-3 mb-2 hover:bg-opacity-30 transition-all">
                      <div class="text-2xl">💰</div>
                    </div>
                    <div class="text-sm font-medium">Nabung Sekarang</div>
                  </div>
                  <div class="text-center cursor-pointer hover:bg-green-400 hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200 hover:scale-105 hover:shadow-md" onClick={handleLihatLaporan}>
                    <div class="bg-white bg-opacity-20 rounded-lg p-3 mb-2 hover:bg-opacity-30 transition-all">
                      <div class="text-2xl">📊</div>
                    </div>
                    <div class="text-sm font-medium">Lihat Laporan</div>
                  </div>
                  <div class="text-center cursor-pointer hover:bg-green-400 hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200 hover:scale-105 hover:shadow-md" onClick={handleAturTarget}>
                    <div class="bg-white bg-opacity-20 rounded-lg p-3 mb-2 hover:bg-opacity-30 transition-all">
                      <div class="text-2xl">🎯</div>
                    </div>
                    <div class="text-sm font-medium">Atur Target</div>
                  </div>
                </div>
              </div>

              {/* Target Tabungan */}
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-6">Target Tabungan Aktif</h2>
                <div class="space-y-4">
                  {savingsTargets().length === 0 ? (
                    <div class="text-center py-8">
                      <div class="text-gray-400 text-4xl mb-2">🎯</div>
                      <p class="text-gray-500">Belum ada target tabungan</p>
                      <p class="text-sm text-gray-400">Klik "Tambah Target" untuk memulai</p>
                    </div>
                  ) : (
                    <For each={savingsTargets()}>
                    {(target) => {
                      const currentAmount = target.current_amount || 0;
                      const targetAmount = target.target_amount || 1;
                      const percentage = Math.round((currentAmount / targetAmount) * 100);
                      const targetDate = target.target_date ? new Date(target.target_date) : null;
                      const now = new Date();
                      const diffTime = targetDate ? targetDate.getTime() - now.getTime() : 0;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      // Check target status
                      const isTargetReached = percentage >= 100;
                      const isOverdue = diffDays < 0;
                      const isCompletedAndOverdue = isTargetReached && isOverdue;
                      const isOverdueNotCompleted = !isTargetReached && isOverdue;
                      
                      const formatTargetDate = (date: Date) => {
                        return date.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        });
                      };
                      
                      return (
                        <div class={`border rounded-lg p-4 ${
                          isCompletedAndOverdue 
                            ? 'border-green-500 bg-green-50' 
                            : isOverdueNotCompleted
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                        }`}>
                          <div class="flex items-center space-x-3 mb-3">
                            <div class={`w-10 h-10 rounded-full flex items-center justify-center text-white ${target.icon_color || 'bg-purple-500'} ${
                              isCompletedAndOverdue ? 'ring-2 ring-green-400' : ''
                            }`}>
                              {target.icon || '📌'}
                            </div>
                            <div class="flex-1">
                              <div class="flex items-center gap-2">
                                <h3 class="font-medium text-gray-800">{target.name}</h3>
                                {isCompletedAndOverdue && (
                                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                                    ✅ Selesai
                                  </span>
                                )}
                              </div>
                              <p class="text-sm text-gray-600">
                                {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
                              </p>
                              {targetDate && (
                                <p class="text-xs text-gray-500 mt-1">
                                  📅 Target: {formatTargetDate(targetDate)}
                                  {diffDays > 0 && (
                                    <span class={`ml-2 px-2 py-1 rounded-full text-xs ${
                                      diffDays <= 7 ? 'bg-red-100 text-red-800' :
                                      diffDays <= 30 ? 'bg-orange-100 text-orange-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {diffDays} hari lagi
                                    </span>
                                  )}
                                  {diffDays < 0 && !isCompletedAndOverdue && (
                                    <span class="ml-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                      Terlewat {Math.abs(diffDays)} hari
                                    </span>
                                  )}
                                  {diffDays < 0 && isCompletedAndOverdue && (
                                    <span class="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      🎉 Selesai {Math.abs(diffDays)} hari lalu
                                    </span>
                                  )}
                                  {diffDays === 0 && (
                                    <span class="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 animate-pulse">
                                      🚨 Hari ini!
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <div class="mb-2">
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                              <span>{percentage}% tercapai</span>
                              <span>
                                {percentage >= 100 && isCompletedAndOverdue ? (
                                  <span class="text-green-700 font-medium">🏆 Target Tercapai!</span>
                                ) : percentage >= 100 ? (
                                  <span class="text-green-600">🎉 Tercapai!</span>
                                ) : (
                                  `${100 - percentage}% lagi`
                                )}
                              </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                              <div
                                class={`h-3 rounded-full transition-all duration-500 ${
                                  percentage >= 100 ? 'bg-green-500' :
                                  percentage >= 75 ? 'bg-blue-500' :
                                  percentage >= 50 ? 'bg-yellow-500' :
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                              {percentage >= 100 && (
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </For>
                  )}
                </div>
              </div>

              {/* Statistik */}
              <div class="grid grid-cols-3 gap-4">
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <div class="text-2xl font-bold text-gray-800 mb-1">{streakData()?.current_streak ?? 0}</div>
                    <div class="text-sm text-gray-600">Hari Streak</div>
                  </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div class="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(statistics().daily_average)}</div>
                  <div class="text-sm text-gray-600">Rata-rata harian</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div class="text-2xl font-bold text-gray-800 mb-1">{statistics().achievements_count}</div>
                  <div class="text-sm text-gray-600">Pencapaian</div>
                </div>
              </div>
            </div>

            {/* Sidebar - Calendar dan Konten Tambahan */}
            <div class="space-y-12">
              {/* Target Calendar */}
              <TargetCalendar 
                events={calendarEvents().map(event => ({
                  id: event.id,
                  date: event.reminder_date, // Backend menggunakan reminder_date
                  title: event.title,
                  type: event.reminder_type, // Backend menggunakan reminder_type
                  description: event.description,
                  target_name: event.target_name,
                  target_icon: event.target_icon,
                  target_icon_color: event.target_icon_color,
                  is_completed: event.is_completed
                }))}
              />

              {/* Target Snapshot */}
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="font-semibold text-gray-800 mb-10">🎯 Target Prioritas</h3>
                {savingsTargets().length === 0 ? (
                  <div class="text-center py-4">
                    <div class="text-gray-400 text-2xl mb-2">🎯</div>
                    <p class="text-sm text-gray-500">Belum ada target</p>
                    <button
                      class="mt-2 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => setShowModal(true)}
                    >
                      Buat Target
                    </button>
                  </div>
                ) : (
                  <div class="space-y-5">
                    <For each={savingsTargets().slice(0, 2)}>
                      {(target) => {
                        const currentAmount = target.current_amount || 0;
                        const targetAmount = target.target_amount || 1;
                        const percentage = Math.round((currentAmount / targetAmount) * 100);
                        const targetDate = target.target_date ? new Date(target.target_date) : null;
                        const now = new Date();
                        const diffTime = targetDate ? targetDate.getTime() - now.getTime() : 0;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        const isCompletedAndOverdue = percentage >= 100 && diffDays < 0;
                        
                        return (
                          <div class={`border rounded-lg p-3 ${
                            isCompletedAndOverdue ? 'border-green-200 bg-green-50' : 'border-gray-100'
                          }`}>
                            <div class="flex items-center space-x-2 mb-2">
                              <div class={`w-6 h-6 rounded-lg ${target.icon_color || 'bg-blue-500'} flex items-center justify-center text-white text-xs ${
                                isCompletedAndOverdue ? 'ring-1 ring-green-400' : ''
                              }`}>
                                {target.icon || '🎯'}
                              </div>
                              <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1">
                                  <h4 class="font-medium text-gray-800 text-sm truncate">{target.name}</h4>
                                  {isCompletedAndOverdue && (
                                    <span class="text-xs">✅</span>
                                  )}
                                </div>
                                <p class="text-xs text-gray-600">{formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}</p>
                              </div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                              <div
                                class={`h-2 rounded-full transition-all duration-500 ${
                                  percentage >= 100 ? 'bg-green-500' :
                                  percentage >= 75 ? 'bg-blue-500' :
                                  percentage >= 50 ? 'bg-yellow-500' :
                                  'bg-orange-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                            <div class={`text-xs mt-1 ${
                              isCompletedAndOverdue ? 'text-green-700 font-medium' : 'text-gray-600'
                            }`}>
                              {isCompletedAndOverdue ? '🏆 Tercapai' : `${percentage}% tercapai`}
                            </div>
                          </div>
                        );
                      }}
                    </For>
                    {savingsTargets().length > 2 && (
                      <div class="text-center">
                        <button class="text-xs text-blue-600 hover:text-blue-800">
                          Lihat semua ({savingsTargets().length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Achievements - diperkecil */}
              {achievements().length === 0 ? (
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div class="text-3xl mb-2">🏆</div>
                  <h3 class="font-semibold text-gray-800 mb-1">Belum Ada Pencapaian</h3>
                  <p class="text-xs text-gray-600">Mulai menabung untuk mendapatkan pencapaian</p>
                </div>
              ) : (
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 class="font-semibold text-gray-800 mb-10">🏆 Pencapaian Terbaru</h3>
                <div class="space-y-6">
                <For each={achievements().slice(0, 2)}>
                  {(achievement) => (
                    <div class="bg-gray-50 rounded-lg p-4 text-center">
                      <div class="text-3xl mb-2">{achievement.icon || '🏆'}</div>
                      <h4 class="font-medium text-gray-800 mb-1">{achievement.title || achievement.achievement_type}</h4>
                      <p class="text-xs text-gray-600">{achievement.description || 'Pencapaian baru'}</p>
                    </div>
                  )}
                </For>
                {achievements().length > 2 && (
                  <div class="text-center">
                    <button class="text-sm text-blue-600 hover:text-blue-800">
                      Lihat semua pencapaian ({achievements().length})
                    </button>
                  </div>
                )}
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Streak Calendar - Full Width */}
          <div id="streak-section" class="mt-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">🔥 Streak Tabungan</h3>
                <div class="text-right">
                    <div class="text-2xl font-bold text-orange-500">{streakData()?.current_streak ?? 0}</div>
                  <div class="text-xs text-gray-600">hari berturut-turut</div>
                </div>
              </div>
              <StreakCalendar 
                streakData={streakData()}
                totalDays={16}
              />
            </div>
          </div>

          {/* Aktivitas Terbaru - Full Width */}
          <div class="mt-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-6">📝 Aktivitas Terbaru</h2>
              <div class="space-y-4">
                {activities().length === 0 ? (
                  <div class="text-center py-8">
                    <div class="text-gray-400 text-4xl mb-2">📝</div>
                    <p class="text-gray-500">Belum ada aktivitas</p>
                    <p class="text-sm text-gray-400">Aktivitas tabungan Anda akan muncul di sini</p>
                  </div>
                ) : (
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <For each={activities()}>
                    {(activity) => (
                      <div class="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div class={`w-12 h-12 rounded-full flex items-center justify-center text-white ${activity.icon_color || 'bg-blue-500'}`}>
                          {activity.icon || '📝'}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="font-medium text-gray-800 truncate">{activity.activity_type || activity.title || 'Aktivitas'}</h3>
                          <p class="text-sm text-gray-600 truncate">{activity.description || 'Tidak ada deskripsi'}</p>
                          <div class="flex items-center justify-between mt-2">
                            <div class="text-sm font-medium text-gray-800">
                              {activity.amount && activity.amount > 0 ? `+${formatCurrency(activity.amount)}` : 'Aktivitas'}
                            </div>
                            <div class="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPengguna;
