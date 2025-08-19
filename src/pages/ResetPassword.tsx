import { Component, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate, useSearchParams } from '@solidjs/router';
import { resetPassword } from '../services/api';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: Component = () => {
  const [form, setForm] = createStore<ResetPasswordForm>({
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [token, setToken] = createSignal('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  onMount(() => {
    const urlToken = searchParams.token;
    if (urlToken && typeof urlToken === 'string') {
      setToken(urlToken);
    } else {
      setMessage('Token reset password tidak valid');
    }
  });

  const handleInputChange = (field: keyof ResetPasswordForm, value: string) => {
    setForm(field, value);
  };

  const handleBack = () => {
    navigate('/forgot-password');
  };

  const validateForm = () => {
    if (form.password.length < 6) {
      setMessage('Password minimal 6 karakter');
      return false;
    }
    
    if (form.password !== form.confirmPassword) {
      setMessage('Password konfirmasi tidak sama');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    if (!token()) {
      setMessage('Token reset password tidak valid');
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPassword(token(), form.password, form.confirmPassword);
      
      if (res.success) {
        setMessage('Password berhasil direset! Silakan login dengan password baru.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(res.message || 'Gagal reset password');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat reset password');
    }
    
    setIsLoading(false);
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
            ⬅ Kembali ke Forgot Password
          </button>

          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z M6,4H13V9H18V20H6V4Z M8,12V14H16V12H8Z M8,16V18H13V16H8Z" />
              </svg>
            </div>
          </div>

          <h1 class="text-2xl font-bold text-gray-800 text-center mb-2">Reset Password</h1>
          <p class="text-gray-500 text-center text-sm mb-6">Masukkan password baru Anda</p>

          {message() && (
            <div class={`p-3 rounded-lg mb-4 text-sm ${
              message().includes('berhasil') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message()}
            </div>
          )}

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
              <div class="relative">
                <input
                  type={showPassword() ? 'text' : 'password'}
                  required
                  value={form.password}
                  onInput={(e) => handleInputChange('password', e.currentTarget.value)}
                  class="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50"
                  placeholder="Masukkan password baru (min. 6 karakter)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword())}
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword() ? (
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <div class="relative">
                <input
                  type={showConfirmPassword() ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onInput={(e) => handleInputChange('confirmPassword', e.currentTarget.value)}
                  class="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm bg-gray-50"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword() ? (
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading() || !token()}
              class="w-full bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading() ? 'Mereset Password...' : 'Reset Password'}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Ingat password Anda?{' '}
              <a href="/login" class="text-green-600 hover:text-green-500 font-medium">
                Login di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
