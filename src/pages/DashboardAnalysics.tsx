import { Component, createSignal, For, onMount } from 'solid-js';
import Sidebar from '../components/Sidebar';
import RoleGuard from '../components/RoleGuard';
import NavbarDashboard from '../components/NavbarDashboard';
import TrendChart from '../components/TrendChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import { userStore } from '../components/userStore';
import { sidebarStore } from '../stores/sidebarStore';
import { 
  getDashboardStats, 
  getUserAnalytics, 
  getTrendData, 
  getRatingDistribution 
} from '../services/api';

interface StatCard {
  icon: string;
  value: string;
  label: string;
  color: string;
}

interface ChartData {
  month: string;
  value: number;
}

interface Activity {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  iconColor: string;
}

const Analytics: Component = () => {
  const [selectedPeriod] = createSignal('6 Bulan Terakhir');
  const [dashboardStats, setDashboardStats] = createSignal<any>({});
  const [userAnalytics, setUserAnalytics] = createSignal<any>({});
  const [trendData, setTrendData] = createSignal<any[]>([]);
  const [ratingData, setRatingData] = createSignal<any[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  // Load data from API
  const loadData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      // Load dashboard stats
      try {
        const statsResponse = await getDashboardStats();
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data || {});
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }

      // Load user analytics
      try {
        const analyticsResponse = await getUserAnalytics();
        if (analyticsResponse.success) {
          setUserAnalytics(analyticsResponse.data || {});
        }
      } catch (err) {
        console.error('Error loading user analytics:', err);
      }

      // Load trend data
      try {
        const trendsResponse = await getTrendData(180); // 6 months
        if (trendsResponse.success) {
          setTrendData(trendsResponse.data || []);
        }
      } catch (err) {
        console.error('Error loading trends:', err);
      }

      // Load rating distribution
      try {
        const ratingsResponse = await getRatingDistribution();
        if (ratingsResponse.success) {
          setRatingData(ratingsResponse.data || []);
        }
      } catch (err) {
        console.error('Error loading ratings:', err);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  onMount(() => {
    loadData();
  });

  // Fallback data jika API belum siap
  const statCards = () => {
    const stats = dashboardStats();
    return [
      {
        icon: '👥',
        value: stats.total_users?.toString() || '0',
        label: 'Total Pengguna',
        color: 'text-blue-600'
      },
      {
        icon: '💰',
        value: stats.total_savings ? `Rp ${(stats.total_savings / 1000000).toFixed(1)}M` : 'Rp 0',
        label: 'Total Tabungan',
        color: 'text-green-600'
      },
      {
        icon: '📈',
        value: stats.monthly_growth ? `+${stats.monthly_growth}%` : '+0%',
        label: 'Pertumbuhan Bulanan',
        color: 'text-green-600'
      },
      {
        icon: '⭐',
        value: stats.average_rating?.toFixed(1) || '0.0',
        label: 'Rating Aplikasi',
        color: 'text-yellow-600'
      }
    ];
  };

  // Use API data or fallback
  const chartTrendData = () => {
    if (trendData().length > 0) {
      return trendData().map((item: any) => ({
        month: item.month || item.period,
        value: item.value || item.count || 0
      }));
    }
    
    // Fallback data
    return [
      { month: 'Jan', value: 0 },
      { month: 'Feb', value: 0 },
      { month: 'Mar', value: 0 },
      { month: 'Apr', value: 0 },
      { month: 'May', value: 0 },
      { month: 'Jun', value: 0 }
    ];
  };

  // Data untuk grafik batang transaksi mingguan
  const weeklyTransactionData: ChartData[] = [
    { month: 'Sen', value: 450 },
    { month: 'Sel', value: 680 },
    { month: 'Rab', value: 520 },
    { month: 'Kam', value: 750 },
    { month: 'Jum', value: 890 },
    { month: 'Sab', value: 340 },
    { month: 'Min', value: 280 }
  ];

  const userDistribution = [
    { platform: 'Android', percentage: 65, color: '#10b981', users: '1,850 pengguna' },
    { platform: 'iOS', percentage: 25, color: '#34d399', users: '712 pengguna' },
    { platform: 'Web', percentage: 10, color: '#6ee7b7', users: '285 pengguna' }
  ];

  const recentActivities: Activity[] = [
    {
      id: '1',
      icon: '👤',
      title: '125 pengguna baru mendaftar',
      description: '2 jam yang lalu',
      time: '2 jam lalu',
      iconColor: 'bg-blue-500'
    },
    {
      id: '2',
      icon: '💳',
      title: '340 transaksi tabungan hari ini',
      description: '5 jam yang lalu',
      time: '5 jam lalu',
      iconColor: 'bg-green-500'
    },
    {
      id: '3',
      icon: '⭐',
      title: '23 review baru diterima',
      description: '1 hari yang lalu',
      time: '1 hari lalu',
      iconColor: 'bg-yellow-500'
    },
    {
      id: '4',
      icon: '🎯',
      title: '89 target tabungan tercapai',
      description: '1 hari yang lalu',
      time: '1 hari lalu',
      iconColor: 'bg-red-500'
    }
  ];

  return (
    <RoleGuard adminOnly>
      <div class="min-h-screen bg-gray-50">
        <Sidebar />

        <div class={`transition-all duration-300 ${
          sidebarStore.isOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}>
          <NavbarDashboard />
          <main class="p-6">
            {/* Header */}
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h1 class="text-2xl font-bold text-gray-800 mb-2">Analytics</h1>
              <p class="text-gray-600">Selamat datang kembali! Berikut ringkasan aktivitas hari ini</p>
            </div>
            {/* Stats Cards */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <For each={statCards()}>
                {(card) => (
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <div class="text-4xl mb-3">{card.icon}</div>
                    <div class="text-2xl font-bold text-gray-800 mb-1">{card.value}</div>
                    <div class="text-sm text-gray-600">{card.label}</div>
                  </div>
                )}
              </For>
            </div>
            {/* Charts Section */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Trend Chart */}
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-6">
                  Tren Pengguna Aktif ({selectedPeriod()})
                </h2>
                <TrendChart data={chartTrendData()} title="Pengguna Aktif" />
              </div>
              {/* Bar Chart - Transaksi Mingguan */}
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-6">
                  Transaksi Mingguan
                </h2>
                <BarChart data={weeklyTransactionData} title="Transaksi" />
              </div>
            </div>
            {/* User Distribution Section - Full width untuk lebih besar */}
            <div class="mb-8">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-6">Distribusi Pengguna Platform</h2>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Chart Container */}
                  <div class="flex justify-center">
                    <PieChart data={userDistribution} title="Platform Distribution" />
                  </div>
                  {/* Statistics Text */}
                  <div class="space-y-4">
                    <For each={userDistribution}>
                      {(item) => (
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div class="flex items-center space-x-3">
                            <div 
                              class="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                              style={`background-color: ${item.color}`}
                            />
                            <div>
                              <span class="font-semibold text-gray-800">{item.platform}</span>
                              <p class="text-sm text-gray-600">{item.users}</p>
                            </div>
                          </div>
                          <span class="text-xl font-bold text-gray-800">{item.percentage}%</span>
                        </div>
                      )}
                    </For>
                    <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 class="font-semibold text-blue-800 mb-2">📊 Insight:</h3>
                      <p class="text-sm text-blue-700 leading-relaxed">
                        Platform Android mendominasi dengan <strong>65% pengguna</strong>, diikuti iOS 25% dan Web 10%. 
                        Fokus pengembangan sebaiknya diprioritaskan untuk platform mobile dengan total 
                        <strong>2,562 pengguna mobile</strong> (90%).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Recent Activities */}
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-6">Aktivitas Terkini</h2>
              <div class="space-y-4">
                <For each={recentActivities}>
                  {(activity) => (
                    <div class="flex items-start space-x-3">
                      <div class={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${activity.iconColor}`}>
                        {activity.icon}
                      </div>
                      <div class="flex-1">
                        <h3 class="text-sm font-medium text-gray-800">{activity.title}</h3>
                        <p class="text-xs text-gray-500 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Analytics;