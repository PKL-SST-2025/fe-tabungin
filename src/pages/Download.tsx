import { Component, createSignal } from 'solid-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TabunginLandingPage: Component = () => {
  const [activeTab, setActiveTab] = createSignal('beranda');

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'fitur', label: 'Fitur' },
    { id: 'cara-kerja', label: 'Cara Kerja' },
    { id: 'testimoni', label: 'Testimoni' },
    { id: 'download', label: 'Download' },
    { id: 'login', label: 'Login' }
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        {/* Navbar */}
      <Navbar /> 
      {/* Hero Section */}
      <main class="container mx-auto px-4 py-12">
        <div class="bg-gradient-to-r from-green-200 to-green-300 rounded-3xl p-8 md:p-12">
          <div class="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Content */}
            <div class="flex-1 mb-8 lg:mb-0 lg:pr-8">
              <h1 class="text-4xl md:text-5xl font-bold text-green-900 mb-4 leading-tight">
                Buat Target,<br />
                Raih Impian
              </h1>
              
              <p class="text-green-800 mb-6 text-lg">
                Atur tabungan pribadimu dengan mudah dan menguntungkan.
              </p>

              {/* Features List */}
              <div class="space-y-3 mb-8">
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-green-800 font-medium">Pengincar Otomatis</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-green-800 font-medium">Pantau Perkembangan</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-green-800 font-medium">Buat Target Tabungan</span>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div class="flex-1 flex justify-center items-center">
              <div class="relative">
                {/* Piggy Bank */}
                <div class="relative">
                  <div class="w-32 h-24 bg-green-400 rounded-full relative">
                    {/* Pig nose */}
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-green-500 rounded-full">
                      <div class="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-1 h-1 bg-green-700 rounded-full"></div>
                      <div class="absolute top-1/2 right-1/3 transform -translate-y-1/2 w-1 h-1 bg-green-700 rounded-full"></div>
                    </div>
                    {/* Coin slot */}
                    <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-green-600 rounded-full"></div>
                    {/* Legs */}
                    <div class="absolute -bottom-2 left-4 w-4 h-4 bg-green-500 rounded-full"></div>
                    <div class="absolute -bottom-2 right-4 w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Person with coin */}
                <div class="absolute -top-8 -right-8">
                  <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <div class="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  </div>
                  <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-green-600 rounded-t-full"></div>
                </div>

                {/* Growth Chart */}
                <div class="absolute -top-4 -left-12">
                  <div class="flex items-end space-x-1">
                    <div class="w-2 h-4 bg-green-600 rounded-t"></div>
                    <div class="w-2 h-6 bg-green-600 rounded-t"></div>
                    <div class="w-2 h-8 bg-green-600 rounded-t"></div>
                  </div>
                  <div class="absolute -top-2 -right-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div class="mt-12">
          <div class="bg-green-800 rounded-2xl p-8 text-center text-white">
            <h2 class="text-2xl md:text-3xl font-bold mb-2">
              DOWNLOAD APLIKASI SEKARANG!!!
            </h2>
            <p class="text-green-100 mb-8">
              Mulai perjalanan finansial Anda hari ini juga
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <a
                href="https://apps.apple.com/app/idXXXXXXXXX" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center justify-center bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <svg class="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download untuk iOS
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.example.app" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center justify-center bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <svg class="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4482-.9993-.9993s.4482-.9993.9993-.9993.9993.4482.9993.9993-.4482.9993-.9993.9993zm-11.046 0c-.5511 0-.9993-.4482-.9993-.9993s.4482-.9993.9993-.9993.9993.4482.9993.9993-.4482.9993-.9993.9993zm5.523-13.8414c3.0376 0 5.5 2.4624 5.5 5.5 0 1.2934-.4468 2.4851-1.1963 3.4277l-9.6074-9.6074c.9426-.7495 2.1343-1.1963 3.4277-1.1963 1.6569 0 3-1.3431 3-3s-1.3431-3-3-3-3 1.3431-3 3c0 .2761.0374.5421.1077.7934l-8.6077 8.6077c-.7495-.9426-1.1963-2.1343-1.1963-3.4277 0-3.0376 2.4624-5.5 5.5-5.5z"/>
                </svg>
                Download untuk Android
              </a>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TabunginLandingPage;