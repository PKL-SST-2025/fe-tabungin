import { Component, createSignal } from 'solid-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home: Component = () => {
  const [currentSlide, setCurrentSlide] = createSignal(0);

  const highlights = [
    {
      title: 'Keamanan Terjamin',
      description: 'Sistem keamanan berlapis dengan enkripsi tingkat bank',
      icon: '🔒'
    },
    {
      title: 'Mudah Digunakan',
      description: 'Interface yang intuitif untuk semua kalangan',
      icon: '✨'
    },
    {
      title: 'Support 24/7',
      description: 'Tim support siap membantu kapan saja',
      icon: '🎧'
    },
    {
      title: 'Terpercaya',
      description: 'Telah dipercaya oleh ribuan pengguna di Indonesia',
      icon: '⭐'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % highlights.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section class="container mx-auto px-4 py-20">
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Selamat Datang di
            <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Tabungin</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Platform digital terdepan untuk mengelola keuangan Anda dengan mudah, aman, dan efisien.
            Wujudkan impian finansial Anda bersama Tabungin!
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/Beranda" class="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all text-center">
              Mulai Sekarang
            </a>
            <a href="/CaraKerja" class="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all text-center">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div class="space-y-8">
            <div class="bg-white p-8 rounded-2xl shadow-lg">
              <h2 class="text-3xl font-bold text-gray-800 mb-6">
                Mengapa Memilih Tabungin?
              </h2>
              <div class="space-y-4">
                <div class="flex items-start space-x-4">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Teknologi Terdepan</h3>
                    <p class="text-gray-600">Platform yang dibangun dengan teknologi modern dan terpercaya</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Regulasi Resmi</h3>
                    <p class="text-gray-600">Terdaftar dan diawasi oleh otoritas keuangan Indonesia</p>
                  </div>
                </div>
                <div class="flex items-start space-x-4">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800">Komunitas Aktif</h3>
                    <p class="text-gray-600">Bergabung dengan komunitas pengguna yang saling mendukung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Phone Mockup with Carousel */}
          <div class="flex justify-center">
            <div class="relative">
              {/* Phone Frame */}
              <div class="w-80 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div class="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                  {/* Status Bar */}
                  <div class="h-6 bg-gray-100 flex items-center justify-center">
                    <div class="flex space-x-1">
                      <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div class="p-6 h-full flex flex-col items-center justify-center">
                    <div class="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                      <span class="text-2xl">{highlights[currentSlide()].icon}</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">
                      {highlights[currentSlide()].title}
                    </h3>
                    <p class="text-gray-600 text-center text-sm">
                      {highlights[currentSlide()].description}
                    </p>
                  </div>
                  
                  {/* Dots Indicator */}
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {highlights.map((_, index) => (
                      <button aria-label="Switch Language"
                        onClick={() => goToSlide(index)}
                        class={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide() ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-colors"
              >
                <span class="text-white font-bold">‹</span>
              </button>
              <button
                onClick={nextSlide}
                class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-colors"
              >
                <span class="text-white font-bold">›</span>
              </button>
              
              {/* Decorative Elements */}
              <div class="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
              <div class="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section class="bg-white py-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Dipercaya Oleh Ribuan Pengguna
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas yang terus berkembang
            </p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center p-6">
              <div class="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div class="text-gray-600">Pengguna Aktif</div>
            </div>
            <div class="text-center p-6">
              <div class="text-4xl font-bold text-blue-600 mb-2">Rp 100M+</div>
              <div class="text-gray-600">Dana Terkelola</div>
            </div>
            <div class="text-center p-6">
              <div class="text-4xl font-bold text-purple-600 mb-2">4.8⭐</div>
              <div class="text-gray-600">Rating Pengguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="bg-gradient-to-r from-green-500 to-blue-600 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Mulai Perjalanan Finansial Anda Hari Ini
          </h2>
          <p class="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Daftar sekarang dan rasakan pengalaman mengelola keuangan yang lebih mudah dan menyenangkan
          </p>
          <div class="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <a href="/Login" class="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors block text-center">
              Daftar Gratis
            </a>
            <a href="https://wa.me/6281251841442?text=Halo%20saya%20ingin%20bertanya%20tentang%20Tabungin" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors block text-center">
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;