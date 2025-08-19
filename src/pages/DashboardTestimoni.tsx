import { createSignal, createEffect, For, Show, Component } from "solid-js";
import { getAllTestimonis, updateTestimoni, deleteTestimoni } from "../services/api";
import Button from "../components/Button";
import Sidebar from '../components/Sidebar';
import RoleGuard from '../components/RoleGuard';
import NavbarDashboard from '../components/NavbarDashboard';
import { sidebarStore } from '../stores/sidebarStore';

interface Testimoni {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

const DashboardTestimoni: Component = () => {
  const [testimonis, setTestimonis] = createSignal<Testimoni[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const loadTestimonis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTestimonis();
      if (response.success) {
        setTestimonis(response.data);
      } else {
        throw new Error(response.message || "Gagal memuat testimoni");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat testimoni");
      console.error("Error loading testimonis:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await updateTestimoni(id, { is_approved: true });
      if (response.success) {
        setTestimonis(prev => 
          prev.map(t => t.id === id ? { ...t, is_approved: true } : t)
        );
      } else {
        throw new Error(response.message || "Gagal menyetujui testimoni");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyetujui testimoni");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await updateTestimoni(id, { is_approved: false });
      if (response.success) {
        setTestimonis(prev => 
          prev.map(t => t.id === id ? { ...t, is_approved: false } : t)
        );
      } else {
        throw new Error(response.message || "Gagal menolak testimoni");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menolak testimoni");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      return;
    }

    try {
      const response = await deleteTestimoni(id);
      if (response.success) {
        setTestimonis(prev => prev.filter(t => t.id !== id));
      } else {
        throw new Error(response.message || "Gagal menghapus testimoni");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghapus testimoni");
    }
  };

  const getStatusColor = (isApproved: boolean | null) => {
    if (isApproved === null) return "text-yellow-600 bg-yellow-100";
    return isApproved ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };

  const getStatusText = (isApproved: boolean | null) => {
    if (isApproved === null) return "Menunggu";
    return isApproved ? "Disetujui" : "Ditolak";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span class={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  createEffect(() => {
    loadTestimonis();
  });

  return (
    <RoleGuard adminOnly>
      <div class="min-h-screen bg-gray-50">
        <Sidebar />
        <div class={`transition-all duration-300 ${
          sidebarStore.isOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}>
          <NavbarDashboard />
          <main class="p-6">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">Kelola Testimoni</h1>
              <p class="text-gray-600">Kelola testimoni dari pengguna aplikasi Tabungin</p>
            </div>
            <Show when={error()}>
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error()}
              </div>
            </Show>
            <Show when={loading()}>
              <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </Show>
            <Show when={!loading() && testimonis().length === 0}>
              <div class="text-center py-8">
                <div class="text-gray-500 text-lg">Belum ada testimoni</div>
              </div>
            </Show>
            <Show when={!loading() && testimonis().length > 0}>
              <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pengguna
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Testimoni
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <For each={testimonis()}>
                        {(testimoni) => (
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm font-medium text-gray-900">
                                {testimoni.user_name}
                              </div>
                            </td>
                            <td class="px-6 py-4">
                              <div class="text-sm text-gray-900 max-w-xs truncate">
                                {testimoni.content}
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center">
                                {renderStars(testimoni.rating)}
                                <span class="ml-2 text-sm text-gray-600">
                                  ({testimoni.rating}/5)
                                </span>
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(testimoni.is_approved)}`}>
                                {getStatusText(testimoni.is_approved)}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(testimoni.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div class="flex gap-3">
                                <Show when={!testimoni.is_approved}>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    class="gradient-btn shadow-md hover:scale-105 transition-transform duration-150"
                                    onClick={() => handleApprove(testimoni.id)}
                                  >
                                    <span class="flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                                      <span>Setujui</span>
                                    </span>
                                  </Button>
                                </Show>
                                <Show when={testimoni.is_approved !== false}>
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    class="gradient-btn shadow-md hover:scale-105 transition-transform duration-150"
                                    onClick={() => handleReject(testimoni.id)}
                                  >
                                    <span class="flex items-center gap-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                      <span>Tolak</span>
                                    </span>
                                  </Button>
                                </Show>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  class="gradient-btn shadow-md hover:scale-105 transition-transform duration-150"
                                  onClick={() => handleDelete(testimoni.id)}
                                >
                                  <span class="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 7h12M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></svg>
                                    <span>Hapus</span>
                                  </span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>
            </Show>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default DashboardTestimoni;
