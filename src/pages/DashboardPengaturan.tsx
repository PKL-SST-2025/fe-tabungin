import { Component, createSignal, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Sidebar from '../components/Sidebar';
import NavbarDashboard from '../components/NavbarDashboard';
import { userStore, updateUser } from '../components/userStore';
import { sidebarStore } from '../stores/sidebarStore';

type UserProfile = {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  alamat: string;
  posisiJabatan: string;
  profileImage: string | null;
};

  // Jangan simpan userProfile di localStorage, gunakan userStore dan backend saja

const PengaturanProfile: Component = () => {
  // Route guard: Only allow user to access dashboard pages
  // Route guard: Only allow user to access dashboard pages
  if (userStore.user.role === 'user') {
    const allowedPaths = ['/dashboard', '/dashboardpengguna', '/dashboardpengaturan'];
    const currentPath = window.location.pathname.toLowerCase();
    if (!allowedPaths.includes(currentPath)) {
      window.location.href = '/dashboardpengguna';
      return null;
    }
  }

  // Helper: isUmarUser
  const isUmarUser = userStore.user.email === 'umar@app.com';
  const navigate = useNavigate();

  const [namaLengkap, setNamaLengkap] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [nomorTelepon, setNomorTelepon] = createSignal('');
  const [alamat, setAlamat] = createSignal('');
  const [posisiJabatan, setPosisiJabatan] = createSignal('');
  const [profileImage, setProfileImage] = createSignal<string | null>(null);

  const [isSaving, setIsSaving] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [saveMessage, setSaveMessage] = createSignal('');
  const [originalData, setOriginalData] = createSignal<UserProfile | null>(null);

  createEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/v1/users/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Gagal mengambil data profil');
        const result = await res.json();
        if (result && result.success && result.data) {
          const data = result.data;
          setNamaLengkap(data.full_name || '');
          setEmail(data.email || '');
          setNomorTelepon(data.nomor_telepon || '');
          setAlamat(data.alamat || '');
          setPosisiJabatan(data.posisi_jabatan || '');
          setProfileImage(data.avatar || userStore.user.avatar || null);
          setOriginalData({
            namaLengkap: data.full_name || '',
            email: data.email || '',
            nomorTelepon: data.nomor_telepon || '',
            alamat: data.alamat || '',
            posisiJabatan: data.posisi_jabatan || '',
            profileImage: data.avatar || null
          });
        }
      })
      .catch(() => {
        // fallback jika gagal fetch, isi dari userStore
        const userStoreData = userStore.user;
        setNamaLengkap(userStoreData.name || '');
        setEmail(userStoreData.email || '');
  setNomorTelepon(userStoreData.nomorTelepon || '');
  setAlamat(userStoreData.alamat || '');
  setPosisiJabatan(userStoreData.posisiJabatan || '');
        setProfileImage(userStoreData.avatar);
        setOriginalData({
          namaLengkap: userStoreData.name || '',
          email: userStoreData.email || '',
          nomorTelepon: userStoreData.nomorTelepon || '',
          alamat: userStoreData.alamat || '',
          posisiJabatan: userStoreData.posisiJabatan || '',
          profileImage: userStoreData.avatar
        });
      })
      .finally(() => setIsLoading(false));
  });

  const hasChanges = () => {
    const original = originalData();
    if (!original) return true;
    return (
      namaLengkap() !== original.namaLengkap ||
      email() !== original.email ||
      nomorTelepon() !== original.nomorTelepon ||
      alamat() !== original.alamat ||
      posisiJabatan() !== original.posisiJabatan ||
      profileImage() !== original.profileImage
    );
  };

  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getCurrentProfileData = (): UserProfile => ({
    namaLengkap: namaLengkap(),
    email: email(),
    nomorTelepon: nomorTelepon(),
    alamat: alamat(),
    posisiJabatan: posisiJabatan(),
    profileImage: profileImage(),
  });

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!namaLengkap().trim()) errors.push('Nama lengkap harus diisi');
    if (!email().trim()) {
      errors.push('Email harus diisi');
    } else if (!/\S+@\S+\.\S+/.test(email())) {
      errors.push('Format email tidak valid');
    }
    if (!nomorTelepon().trim()) errors.push('Nomor telepon harus diisi');
    if (!alamat().trim()) errors.push('Alamat harus diisi');
    if (!posisiJabatan().trim()) errors.push('Posisi/jabatan harus diisi');
    return { isValid: errors.length === 0, errors };
  };

  const handleSimpanPerubahan = async () => {
  // Jangan reset field sebelum backend response, update hanya setelah sukses
    const validation = validateForm();
    if (!validation.isValid) {
      setSaveMessage(`Error: ${validation.errors.join(', ')}`);
      setTimeout(() => setSaveMessage(''), 5000);
      return;
    }
    setIsSaving(true);
    setSaveMessage('');
    try {
      const profileData = getCurrentProfileData();
      // Kirim data ke backend
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: profileData.namaLengkap,
          avatar: profileData.profileImage,
          nomor_telepon: profileData.nomorTelepon,
          alamat: profileData.alamat,
          posisi_jabatan: profileData.posisiJabatan
        })
      });
      let result = {};
      if (res.ok) {
        try {
          result = await res.json();
        } catch (e) {
          result = {};
        }
      }
      if (res.ok && result && typeof result === 'object' && 'success' in result && result.success && 'data' in result && result.data && typeof result.data === 'object') {
        const data = result.data as { full_name?: string; email?: string; avatar?: string | null };
        // Refresh userStore dengan data terbaru dari backend
        // Use a single typed data variable for all accesses
        const userData = result.data as {
          full_name?: string;
          email?: string;
          avatar?: string | null;
          nomor_telepon?: string;
          alamat?: string;
          posisi_jabatan?: string;
        };
        updateUser({
          name: userData.full_name ?? '',
          email: userData.email ?? '',
          avatar: userData.avatar ?? null,
          nomorTelepon: userData.nomor_telepon ?? '',
          alamat: userData.alamat ?? '',
          posisiJabatan: userData.posisi_jabatan ?? '',
        });
        setNamaLengkap(userData.full_name ?? '');
        setEmail(userData.email ?? '');
        setNomorTelepon(userData.nomor_telepon ?? '');
        setAlamat(userData.alamat ?? '');
        setPosisiJabatan(userData.posisi_jabatan ?? '');
        setProfileImage(userData.avatar ?? null);
        setOriginalData({
          namaLengkap: userData.full_name ?? '',
          email: userData.email ?? '',
          nomorTelepon: userData.nomor_telepon ?? '',
          alamat: userData.alamat ?? '',
          posisiJabatan: userData.posisi_jabatan ?? '',
          profileImage: userData.avatar ?? null
        });
        setSaveMessage(`Perubahan berhasil disimpan! Profil ${data.full_name ?? ''} telah diperbarui.`);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Error: Gagal menyimpan perubahan');
        setTimeout(() => setSaveMessage(''), 5000);
      }
    } catch (err) {
      console.error(err);
      setSaveMessage('Error: Gagal menyimpan perubahan');
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBatal = () => {
    const original = originalData();
    if (original) {
      setNamaLengkap(original.namaLengkap);
      setEmail(original.email);
      setNomorTelepon(original.nomorTelepon);
      setAlamat(original.alamat);
      setPosisiJabatan(original.posisiJabatan);
      setProfileImage(original.profileImage);
      setSaveMessage('Perubahan dibatalkan');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleLogOut = () => {
    const userName = userStore.user.name || 'User';
    // Clear user data using logoutUser from userStore
    import('../components/userStore').then(({ logoutUser }) => {
      logoutUser();
      alert(`Logout berhasil! Sampai jumpa lagi ${userName}.`);
      navigate('/login');
    });
  };

  return (
    <div class="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div class={`transition-all duration-300 ${sidebarStore.isOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <NavbarDashboard />
        <main class="flex-1 p-6">
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Pengaturan</h1>
            <p class="text-gray-600">Kelola preferensi dan konfigurasi sistem aplikasi Tabungin</p>
          </div>
          <div class="flex gap-6">
            <div class="flex-1">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-6">Profil Administrator</h2>
                <div class="flex items-center mb-6">
                  <div class="relative">
                    <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {profileImage() ? (
                        <img src={profileImage()!} alt="Profile" class="w-full h-full rounded-full object-cover" />
                      ) : (
                        'U'
                      )}
                    </div>
                  </div>
                  <div class="ml-4">
                    <label class="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer">
                      Ubah Foto Profil
                      <input type="file" accept="image/*" class="hidden" onChange={handleImageUpload} />
                    </label>
                    <p class="text-sm text-gray-500 mt-1">Format: JPG, PNG. Maksimal 2MB</p>
                  </div>
                </div>
                <div class="space-y-4">
                  {[{ label: 'Nama Lengkap', value: namaLengkap, setter: setNamaLengkap, type: 'text' },
                    { label: 'Email', value: email, setter: setEmail, type: 'email' },
                    { label: 'Nomor Telepon', value: nomorTelepon, setter: setNomorTelepon, type: 'tel' }].map(field => (
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} <span class="text-red-500">*</span>
                      </label>
                      <input
                        type={field.type}
                        value={field.value()}
                        onInput={(e) => field.setter(e.currentTarget.value)}
                        placeholder={`Masukan ${field.label.toLowerCase()}`}
                        disabled={isLoading()}
                        class={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          isLoading() ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  ))}
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Alamat <span class="text-red-500">*</span></label>
                    <textarea
                      value={alamat()}
                      onInput={(e) => setAlamat(e.currentTarget.value)}
                      placeholder="Masukan alamat"
                      rows={3}
                      disabled={isLoading()}
                      class={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isLoading() ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Posisi / Jabatan <span class="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={posisiJabatan()}
                      onInput={(e) => setPosisiJabatan(e.currentTarget.value)}
                      placeholder="Masukan posisi/jabatan"
                      disabled={isLoading()}
                      class={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        isLoading() ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Static info for admin only */}
                  {userStore.user.email === 'admin' && (
                    <div class="border-t pt-6">
                      <h3 class="text-lg font-semibold text-gray-800 mb-4">🔑 Status Administrator</h3>
                      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p class="text-sm text-blue-800">
                          <strong>Role saat ini:</strong> Administrator
                        </p>
                        <p class="text-xs text-blue-600 mt-1">
                          Administrator dapat mengakses semua menu, sedangkan User hanya dapat mengakses Dashboard, Pengguna, dan Pengaturan.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {saveMessage() && (
                  <div class={`mt-4 p-3 rounded-md ${
                    saveMessage().includes('Error')
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : saveMessage().includes('berhasil')
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {saveMessage()}
                  </div>
                )}

                <div class="flex gap-3 mt-6">
                  <button
                    onClick={handleSimpanPerubahan}
                    disabled={!hasChanges() || isSaving() || isLoading()}
                    class={`px-6 py-2 rounded-md font-medium transition-colors ${
                      !hasChanges() || isSaving() || isLoading()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isSaving() ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    onClick={handleBatal}
                    disabled={!hasChanges() || isLoading()}
                    class={`px-6 py-2 rounded-md font-medium transition-colors ${
                      !hasChanges() || isLoading()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogOut}
                    disabled={isLoading()}
                    class={`px-6 py-2 rounded-md font-medium transition-colors ${
                      isLoading()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
            <div class="w-80 flex items-end justify-center">
              {/* Tambahan dekorasi atau ilustrasi */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PengaturanProfile;
