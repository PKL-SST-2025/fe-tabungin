import { Component, createSignal, For, onMount } from 'solid-js';
import Sidebar from '../components/Sidebar';
import NavbarDashboard from '../components/NavbarDashboard';
import { sidebarStore } from '../stores/sidebarStore';
import { notifications as globalNotifications, markAsRead, clearNotifications, setNotifications, Notification as GlobalNotification } from '../stores/notificationStore';

const Notifications: Component = () => {
  onMount(async () => {
    const userId = "e4c13900-95cb-4fcb-a55d-8432a768c35c";
    const res = await fetch(`http://localhost:8080/api/v1/notifications/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
    }
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  const [activeFilter, setActiveFilter] = createSignal('all');
  const [activeMenu, setActiveMenu] = createSignal('Notifikasi');

  const notifications = () => globalNotifications;

  const filters = [
    { key: 'all', label: 'Semua', count: notifications().length },
    { key: 'unread', label: 'Belum Dibaca', count: notifications().filter(n => !n.read).length },
  ];

  const filteredNotifications = () => {
    const filter = activeFilter();
    if (filter === 'all') return notifications();
    if (filter === 'unread') return notifications().filter(n => !n.read);
    return notifications();
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <Sidebar />
      <div class={`transition-all duration-300 ${sidebarStore.isOpen ? 'lg:ml-64' : 'lg:ml-16'}`}> 
        <NavbarDashboard notificationCount={notifications().filter(n => !n.read).length} />
        <section class="container mx-auto px-4 py-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Notifikasi
              </h1>
              <p class="text-lg text-gray-600">
                Pantau semua aktivitas dan update terbaru akun Anda
              </p>
            </div>
            <div class="flex gap-3">
              <button 
                onClick={() => notifications().forEach(n => !n.read && markAsRead(n.id))}
                class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" /></svg>
                Tandai Semua Dibaca
              </button>
              <button 
                onClick={clearNotifications}
                class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                Bersihkan Semua
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Total Notifikasi</p>
                  <p class="text-2xl font-bold text-gray-800">{notifications().length}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Belum Dibaca</p>
                  <p class="text-2xl font-bold text-red-600">{notifications().filter(n => !n.read).length}</p>
                </div>
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="flex flex-wrap gap-2">
              <For each={filters}>
                {(filter) => (
                  <button
                    onClick={() => setActiveFilter(filter.key)}
                    class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeFilter() === filter.key
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                    {filter.count > 0 && (
                      <span class={`ml-2 px-2 py-1 rounded-full text-xs ${
                        activeFilter() === filter.key
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                )}
              </For>
            </div>
          </div>
          <div class="space-y-4">
            <For each={filteredNotifications()}>
              {(notification: GlobalNotification) => (
                <div class={`bg-white rounded-lg shadow-md transition-all hover:shadow-lg ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}>
                  <div class="p-6">
                    <div class="flex items-start justify-between">
                      <div class="flex items-start space-x-4 flex-1">
                        <div class={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          <span class="text-xl">{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-2">
                            <h3 class={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.message}
                            </h3>
                            {!notification.read && (
                              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <span class="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            class="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" /></svg>
                            Tandai Dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
            {filteredNotifications().length === 0 && (
              <div class="bg-white rounded-lg shadow-md p-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-2xl">📭</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">
                  Tidak Ada Notifikasi
                </h3>
                <p class="text-gray-600">
                  {activeFilter() === 'all' 
                    ? 'Belum ada notifikasi yang masuk'
                    : `Tidak ada notifikasi untuk kategori ${filters.find(f => f.key === activeFilter())?.label}`
                  }
                </p>
              </div>
            )}
          </div>
        </section>
        <section class="bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
              <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">
                Pengaturan Notifikasi
              </h2>
              <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6">
                  <h3 class="text-xl font-semibold text-gray-800 mb-4">
                    Notifikasi Push
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <label for="notif-transaksi" class="text-gray-700">Transaksi</label>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="notif-transaksi"
                          checked
                          class="sr-only peer"
                          aria-label="Notifikasi Transaksi"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <label for="notif-tabungan" class="text-gray-700">Tabungan</label>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="notif-tabungan"
                          checked
                          class="sr-only peer"
                          aria-label="Notifikasi Tabungan"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <label for="notif-investasi" class="text-gray-700">Investasi</label>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="notif-investasi"
                          class="sr-only peer"
                          aria-label="Notifikasi Investasi"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md p-6">
                  <h3 class="text-xl font-semibold text-gray-800 mb-4">
                    Notifikasi Email
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <label for="notif-email-laporan" class="text-gray-700">Laporan Mingguan</label>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="notif-email-laporan"
                          checked
                          class="sr-only peer"
                          aria-label="Notifikasi Email Laporan Mingguan"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <label for="notif-email-promo" class="text-gray-700">Promo & Penawaran</label>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="notif-email-promo"
                          class="sr-only peer"
                          aria-label="Notifikasi Email Promo & Penawaran"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div class="flex items-center justify-between">
                      <label for="notif-email-update" class="text-gray-700">Update Produk</label>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="notif-email-update"
                          checked
                          class="sr-only peer"
                          aria-label="Notifikasi Email Update Produk"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Notifications;