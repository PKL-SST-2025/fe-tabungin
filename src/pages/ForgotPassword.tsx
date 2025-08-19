import { Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
import { forgotPassword } from '../services/api';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: Component = () => {
  const [form, setForm] = createStore<ForgotPasswordForm>({
    email: ''
  });

  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [resetToken, setResetToken] = createSignal('');
  const navigate = useNavigate();

  const handleInputChange = (field: keyof ForgotPasswordForm, value: string) => {
    setForm(field, value);
  };

  const handleBack = () => {
    navigate('/login');
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await forgotPassword(form.email);
      
      if (res.success) {
        setMessage('Email reset password telah dikirim! (Demo: gunakan token di bawah)');
        if (res.data && res.data.reset_token) {
          setResetToken(res.data.reset_token);
        }
      } else {
        setMessage(res.message || 'Gagal mengirim email reset password');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat memproses permintaan');
    }
    
    setIsLoading(false);
  };

  const goToResetPassword = () => {
    navigate(`/reset-password?token=${resetToken()}`);
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
            ⬅ Kembali ke Login
          </button>

          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V19H11V17H5V15H11V13H5V11H11V9H21ZM13 7H19V9H13V7ZM15 11V13H21V11H15ZM15 15V17H21V15H15ZM15 19V21H21V19H15Z" />
              </svg>
            </div>
          </div>

          <h1 class="text-2xl font-bold text-gray-800 text-center mb-2">Lupa Password?</h1>
          <p class="text-gray-500 text-center text-sm mb-6">Masukkan email Anda untuk reset password</p>

          {message() && (
            <div class={`p-3 rounded-lg mb-4 text-sm ${
              message().includes('berhasil') || message().includes('dikirim') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message()}
            </div>
          )}

          {resetToken() && (
            <div class="p-3 bg-blue-100 text-blue-700 rounded-lg mb-4 text-sm">
              <p class="font-semibold">Demo Token:</p>
              <p class="break-all">{resetToken()}</p>
              <button 
                onClick={goToResetPassword}
                class="mt-2 text-blue-600 underline hover:text-blue-800"
              >
                Reset Password Sekarang →
              </button>
            </div>
          )}

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

            <button
              type="submit"
              disabled={isLoading()}
              class="w-full bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading() ? 'Mengirim...' : 'Kirim Email Reset'}
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

export default ForgotPasswordPage;
