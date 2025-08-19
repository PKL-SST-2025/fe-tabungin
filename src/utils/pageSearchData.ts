export type PageSearchItem = {
  name: string;
  path: string;
  icon?: string;
  description?: string;
  role?: 'admin' | 'user' | 'all'; // 'admin' means only admin can see
};

export const pageSearchData: PageSearchItem[] = [
  { name: "Beranda", path: "/", description: "Halaman utama aplikasi", role: 'all' },
  { name: "Dashboard", path: "/dashboard", description: "Ringkasan analytics dan data utama", role: 'all' },
  { name: "Dashboard Analytics", path: "/DashboardAnalysics", description: "Analisis pengguna dan transaksi", role: 'admin' },
  { name: "Pengaturan", path: "/DashboardPengaturan", description: "Pengaturan profil dan sistem", role: 'admin' },
  { name: "Pengguna", path: "/DashboardPengguna", description: "Manajemen data pengguna", role: 'admin' },
  { name: "Testimoni", path: "/DashboardTestimoni", description: "Testimoni pengguna aplikasi", role: 'admin' },
  { name: "Download", path: "/Download", description: "Download file dan dokumen", role: 'all' },
  { name: "Fitur", path: "/Fitur", description: "Daftar fitur aplikasi", role: 'all' },
  { name: "Notifikasi", path: "/Notifikasi", description: "Pusat notifikasi aplikasi", role: 'all' },
  { name: "Login", path: "/Login", description: "Halaman login pengguna", role: 'all' },
  { name: "Register", path: "/Register", description: "Halaman pendaftaran akun", role: 'all' },
  { name: "Reset Password", path: "/ResetPassword", description: "Reset password akun", role: 'all' },
  { name: "Cara Kerja", path: "/CaraKerja", description: "Penjelasan cara kerja aplikasi", role: 'all' },
  { name: "Landing Page", path: "/LandingPage", description: "Landing page aplikasi", role: 'all' },
  { name: "Testimoni", path: "/Testimoni", description: "Testimoni pengguna", role: 'all' },
];
