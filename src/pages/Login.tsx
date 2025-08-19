import { Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
import { updateUser } from '../components/userStore'; // pastikan path sesuai
import { login } from '../services/api';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage: Component = () => {
  const [form, setForm] = createStore<LoginForm>({
    email: '',
    password: '',
    remember: false
  });

  const [activeTab, setActiveTab] = createSignal<'user' | 'admin'>('user');
  const [isLoading, setIsLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
    setForm(field, value);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isAdmin = activeTab() === 'admin';
      const res = await login(form.email, form.password, isAdmin);
      if (res.success && res.data && res.data.user) {
        // Simpan token jika perlu
        localStorage.setItem('token', res.data.token);
        // Fetch data user dari backend agar userStore selalu sinkron
        try {
          const profileRes = await import('../services/api').then(mod => mod.getUserProfile());
          if (profileRes.success && profileRes.data) {
            updateUser({
              name: profileRes.data.full_name,
              email: profileRes.data.email,
              avatar: profileRes.data.avatar,
              password: form.password
            });
          }
        } catch {}
        alert(`Login berhasil! Selamat datang kembali ${res.data.user.full_name}.`);
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        alert(res.message || 'Login gagal');
        setIsLoading(false);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat login');
      setIsLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-4 relative bg-[linear-gradient(135deg,_#BDE3C7_0%,_#BDE3C7_50%,_#BDE3C7_100%)]">
      <div class="absolute inset-0 overflow-hidden">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <line x1="0" y1="100" x2="1000" y2="900" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="0" y1="300" x2="1000" y2="700" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="0" y1="500" x2="1000" y2="500" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="0" y1="700" x2="1000" y2="300" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="0" y1="900" x2="1000" y2="100" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="100" y1="0" x2="900" y2="1000" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="300" y1="0" x2="700" y2="1000" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="500" y1="0" x2="500" y2="1000" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="700" y1="0" x2="300" y2="1000" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="900" y1="0" x2="100" y2="1000" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="0" y1="0" x2="1000" y2="1000" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
          <line x1="0" y1="1000" x2="1000" y2="0" stroke="rgba(0,0,0,0.15)" stroke-width="3" />
        </svg>
      </div>

      <div class="relative z-10 w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <button onClick={handleBack} class="mb-4 text-sm text-green-600 hover:underline">
            ⬅ Kembali ke Beranda
          </button>

          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V19H11V17H5V15H11V13H5V11H11V9H21ZM13 7H19V9H13V7ZM15 11V13H21V11H15ZM15 15V17H21V15H15ZM15 19V21H21V19H15Z" />
              </svg>
            </div>
          </div>

          <h1 class="text-2xl font-bold text-gray-800 text-center mb-2">Welcome Back!</h1>
          <p class="text-gray-500 text-center text-sm mb-6">Login to your Tabungin account</p>

          <div class="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              class={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab() === 'user'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              class={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab() === 'admin'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onInput={(e) => handleInputChange('email', e.currentTarget.value)}
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50"
                placeholder="user@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onInput={(e) => handleInputChange('password', e.currentTarget.value)}
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50"
                placeholder="Enter your password"
              />
            </div>

            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => handleInputChange('remember', e.currentTarget.checked)}
                  class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span class="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" class="text-green-600 hover:text-green-500 font-medium">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading()}
              class="w-full bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading() ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" class="text-green-600 hover:text-green-500 font-medium">
                Register now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
