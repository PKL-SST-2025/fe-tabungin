import { Component, createSignal, For } from 'solid-js';
import Sidebar from '../components/Sidebar';
import NavbarDashboard from '../components/NavbarDashboard';
import SavingsChart from '../components/SavingsChart';
import { userStore } from '../components/userStore';
import { sidebarStore } from '../stores/sidebarStore';
import '../styles/dashboard.css';

interface DashboardCard {
  icon: string;
  title: string;
  value: string;
  description: string;
  percentage: string;
  percentageColor: string;
  progressValue: number;
}

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  iconColor: string;
}

const Dashboard: Component = () => {
  // Route guard: Only allow user to access dashboard pages
  if (userStore.user.role === 'user') {
    // Only allow Dashboard, DashboardPengguna, DashboardPengaturan
    const allowedPaths = ['/dashboard', '/dashboardpengguna', '/dashboardpengaturan'];
    const currentPath = window.location.pathname.toLowerCase();
    if (!allowedPaths.includes(currentPath)) {
      window.location.href = '/dashboardpengguna';
      return null;
    }
  }
  const [selectedPeriod, setSelectedPeriod] = createSignal('2 Hari Terakhir');

  // Dapatkan nama user
  const getUserName = () => {
    let name = userStore.user.name;
    
    if (!name) {
      // Fallback ke localStorage jika userStore kosong
      const storedData = localStorage.getItem('userProfile');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          name = parsed.namaLengkap;
        } catch (err) {
          console.error('Gagal membaca userProfile dari localStorage', err);
        }
      }
    }
    
    return name || 'Admin';
  };

  const dashboardCards: DashboardCard[] = [
    {
      icon: '👥',
      title: 'Total Pengguna Aktif',
      value: '2,847',
      description: 'Total Pengguna Aktif',
      percentage: '+12%',
      percentageColor: 'text-green-600',
      progressValue: 75
    },
    {
      icon: '💰',
      title: 'Total Dana tersimpan',
      value: 'Rp 1.2M',
      description: 'Total Dana tersimpan',
      percentage: '+8%',
      percentageColor: 'text-green-600',
      progressValue: 60
    },
    {
      icon: '📈',
      title: 'Transaksi Hari Ini',
      value: '1,247',
      description: 'Transaksi Hari Ini',
      percentage: '+18%',
      percentageColor: 'text-green-600',
      progressValue: 85
    },
    {
      icon: '⭐',
      title: 'Rating Aplikasi',
      value: '4.8',
      description: 'Rating Aplikasi',
      percentage: '-2%',
      percentageColor: 'text-red-500',
      progressValue: 95
    }
  ];

  const activities: ActivityItem[] = [
    {
      id: '1',
      icon: '👤',
      title: 'Pendaftaran Pengguna Baru',
      description: '25 pengguna baru mendaftar',
      time: '2 jam lalu',
      iconColor: 'bg-blue-500'
    },
    {
      id: '2',
      icon: '💳',
      title: 'Transaksi Tabungan',
      description: '340 transaksi berhasil',
      time: '5 jam lalu',
      iconColor: 'bg-cyan-500'
    },
    {
      id: '3',
      icon: '⭐',
      title: 'Review Baru',
      description: '23 review positif diterima',
      time: '1 hari lalu',
      iconColor: 'bg-yellow-500'
    },
    {
      id: '4',
      icon: '🎯',
      title: 'Target Tercapai',
      description: '85 pengguna capai target',
      time: '1 hari lalu',
      iconColor: 'bg-red-500'
    },
    {
      id: '5',
      icon: '⚠️',
      title: 'Laporan Error',
      description: '3 laporan bug dari pengguna',
      time: '2 hari lalu',
      iconColor: 'bg-orange-500'
    }
  ];

  return (
    <div class="min-h-screen bg-gray-50">
      <Sidebar />

      <div class={`transition-all duration-300 ${
        sidebarStore.isOpen ? 'lg:ml-64' : 'lg:ml-16'
      }`}>
        <NavbarDashboard />

        <main class="p-6">
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p class="text-gray-600">Selamat datang kembali, {getUserName()}! Berikut ringkasan aktivitas hari ini</p>
          </div>

          {/* Stats Cards */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <For each={dashboardCards}>
              {(card) => (
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dashboard-card">
                  <div class="flex items-center justify-between mb-4">
                    <div class="text-2xl">{card.icon}</div>
                    <span class={`text-sm font-medium px-2 py-1 rounded ${card.percentageColor} bg-opacity-10`}>
                      {card.percentage}
                    </span>
                  </div>

                  <div class="mb-4">
                    <h3 class="text-2xl font-bold text-gray-800 mb-1">{card.value}</h3>
                    <p class="text-sm text-gray-600">{card.description}</p>
                  </div>

                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${card.progressValue}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Main Chart Section - Full Width */}
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Analisis Tren Tabungan</h2>
                <p class="text-gray-600">Visualisasi pertumbuhan tabungan pengguna dalam periode waktu yang dipilih</p>
              </div>
              <div class="mt-4 md:mt-0">
                <select
                  title="Filter Periode"
                  aria-label="Filter Periode"
                  class="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                  value={selectedPeriod()}
                  onChange={(e) => setSelectedPeriod(e.currentTarget.value)}
                >
                  <option value="2 Hari Terakhir">2 Hari Terakhir</option>
                  <option value="7 Hari Terakhir">7 Hari Terakhir</option>
                  <option value="30 Hari Terakhir">30 Hari Terakhir</option>
                </select>
              </div>
            </div>

            {/* Enhanced Chart with amCharts */}
            <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-100 chart-container">
              <SavingsChart period={selectedPeriod()} />
            </div>
            
            {/* Chart Statistics Summary */}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">Rp 2.4M</div>
                <div class="text-sm text-gray-600">Total Tabungan</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">+15.2%</div>
                <div class="text-sm text-gray-600">Pertumbuhan</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">1,247</div>
                <div class="text-sm text-gray-600">Transaksi</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">847</div>
                <div class="text-sm text-gray-600">Pengguna Aktif</div>
              </div>
            </div>
          </div>

          {/* Secondary Charts and Activity Section */}
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Mini Chart 1 - Performance Overview */}
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Performance</h3>
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div class="mini-chart-container bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <SavingsChart period="7 Hari Terakhir" />
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Target Bulanan</span>
                  <span class="text-sm font-semibold text-green-600">85%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div class="bg-green-500 h-2 rounded-full w-4/5 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            {/* Mini Chart 2 - Growth Trends */}
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">Growth Trends</h3>
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Trending Up</span>
              </div>
              <div class="mini-chart-container bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <SavingsChart period="30 Hari Terakhir" />
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Growth Rate</span>
                  <span class="text-sm font-semibold text-blue-600">+18.5%</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">Compared to last month</div>
              </div>
            </div>

            {/* Enhanced Activity Feed */}
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Aktivitas Terkini</h3>
                <button class="text-sm text-green-600 hover:text-green-700 font-medium">Lihat Semua</button>
              </div>

              <div class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                <For each={activities}>
                  {(activity) => (
                    <div class="activity-item flex items-start space-x-3 p-3 border border-gray-100 hover:border-gray-200">
                      <div class={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${activity.iconColor} shadow-sm flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-medium text-gray-800 mb-1 truncate">{activity.title}</h4>
                        <p class="text-xs text-gray-600 leading-relaxed">{activity.description}</p>
                        <span class="text-xs text-gray-400 mt-1 inline-block">{activity.time}</span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
              
              {/* Activity Summary */}
              <div class="mt-6 pt-4 border-t border-gray-100">
                <div class="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div class="text-lg font-bold text-gray-800">24</div>
                    <div class="text-xs text-gray-600">Aktivitas Hari Ini</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-gray-800">156</div>
                    <div class="text-xs text-gray-600">Total Minggu Ini</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Insights Section */}
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="gradient-green rounded-xl p-6 text-white shadow-lg">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">Quick Stats</h4>
                <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  📊
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-green-100">Pengguna Baru</span>
                  <span class="font-semibold">+127</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-green-100">Transaksi</span>
                  <span class="font-semibold">1,247</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-green-100">Revenue</span>
                  <span class="font-semibold">Rp 2.4M</span>
                </div>
              </div>
            </div>

            <div class="gradient-blue rounded-xl p-6 text-white shadow-lg">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">Performance</h4>
                <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  🎯
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-blue-100">Success Rate</span>
                  <span class="font-semibold">98.5%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-100">Uptime</span>
                  <span class="font-semibold">99.9%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-100">Response Time</span>
                  <span class="font-semibold">0.2s</span>
                </div>
              </div>
            </div>

            <div class="gradient-purple rounded-xl p-6 text-white shadow-lg">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-semibold">User Satisfaction</h4>
                <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  ⭐
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-purple-100">Rating</span>
                  <span class="font-semibold">4.8/5</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-purple-100">Reviews</span>
                  <span class="font-semibold">2,847</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-purple-100">NPS Score</span>
                  <span class="font-semibold">+72</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
