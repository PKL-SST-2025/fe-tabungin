import { Component } from 'solid-js';
import { useLanguage } from './LanguageContext'; // pastikan path ini benar

const Navbar: Component = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          {/* Logo */}
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">T</span>
            </div>
            <span class="text-xl font-bold text-gray-800">TABUNGIN</span>
          </div>

          {/* Menu Navigasi */}
          <nav class="hidden md:flex space-x-8">
            <a href="/Beranda" class="text-gray-600 hover:text-emerald-600 transition-colors">Beranda</a>
            <a href="/Fitur" class="text-gray-600 hover:text-emerald-600 transition-colors">Fitur</a>
            <a href="/CaraKerja" class="text-gray-600 hover:text-emerald-600 transition-colors">Cara Kerja</a>
            <a href="/Testimoni" class="text-gray-600 hover:text-emerald-600 transition-colors">Testimoni</a>
            <a href="/Download" class="text-gray-600 hover:text-emerald-600 transition-colors">Download</a>
          </nav>

          {/* Login dan Switch Bahasa */}
          <div class="flex items-center space-x-3">
            <a
              href="/login"
              class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Login
            </a>
            <button
              onClick={() => setLanguage(language() === 'id' ? 'en' : 'id')}
              class="text-emerald-600 border border-emerald-200 px-3 py-1 rounded-md hover:bg-emerald-50 transition text-sm"
            >
              {language() === 'id' ? 'English' : 'Bahasa'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
