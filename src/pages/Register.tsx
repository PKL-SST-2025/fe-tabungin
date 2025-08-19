import { Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
import { register } from '../services/api';
import { updateUser } from '../components/userStore';

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: Component = () => {
  const [form, setForm] = createStore<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert('Format email tidak valid!');
      return;
    }

    if (form.password.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(form.fullName, form.email, form.password, form.confirmPassword);
      
      if (res.success && res.data && res.data.user) {
        // Simpan data user ke userStore
        updateUser({
          name: res.data.user.full_name,
          email: res.data.user.email,
          avatar: res.data.user.avatar,
          password: form.password
        });
        
        // Simpan token
        localStorage.setItem('token', res.data.token);
        
        alert(`Registrasi berhasil! Selamat datang ${res.data.user.full_name}. Anda akan diarahkan ke dashboard.`);
        setIsLoading(false);
        navigate('/Dashboard');
      } else {
        alert(res.message || 'Registrasi gagal. Silakan coba lagi.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setForm(field, value);
  };

  const handleBack = () => {
    navigate('/');
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

          <h1 class="text-2xl font-bold text-gray-800 text-center mb-2">Let's Get Started!</h1>
          <p class="text-gray-500 text-center text-sm mb-6">Register and log in to Tabungan</p>

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={form.fullName}
                onInput={(e) => handleInputChange('fullName', e.currentTarget.value)}
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50"
                placeholder="Nama lengkap"
              />
            </div>

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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onInput={(e) => handleInputChange('confirmPassword', e.currentTarget.value)}
                class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50"
                placeholder="Enter your password again"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading()}
              class="w-full bg-rose-700 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading() ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/Login" class="text-green-600 hover:text-green-500 font-medium">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
