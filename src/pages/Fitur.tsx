import { Component, createSignal } from 'solid-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Features: Component = () => {
  const [activeTab, setActiveTab] = createSignal(0);

  const mainFeatures = [
    {
      id: 'smart-saving',
      title: 'Smart Saving',
      description: 'Tabungan cerdas dengan AI yang membantu Anda mencapai target finansial',
      icon: '💰',
      color: 'from-green-400 to-green-600',
      features: [
        'Target tabungan otomatis',
        'Analisis pola pengeluaran',
        'Rekomendasi jumlah tabungan',
        'Pengingat tabungan berkala',
        'Proyeksi pencapaian target'
      ]
    },
    {
      id: 'expense-tracker',
      title: 'Expense Tracker',
      description: 'Lacak dan kategorikan pengeluaran harian dengan mudah',
      icon: '📊',
      color: 'from-blue-400 to-blue-600',
      features: [
        'Kategorisasi otomatis',
        'Scan struk belanja',
        'Laporan pengeluaran detail',
        'Budget monitoring',
        'Analisis trend pengeluaran'
      ]
    },
    {
      id: 'investment-hub',
      title: 'Investment Hub',
      description: 'Platform investasi terintegrasi dengan portfolio management',
      icon: '📈',
      color: 'from-purple-400 to-purple-600',
      features: [
        'Portfolio diversifikasi',
        'Analisis risiko investasi',
        'Rekomendasi instrumen',
        'Tracking performance',
        'Edukasi investasi'
      ]
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning',
      description: 'Perencanaan keuangan jangka panjang dengan panduan ahli',
      icon: '🎯',
      color: 'from-orange-400 to-orange-600',
      features: [
        'Perencanaan pensiun',
        'Dana darurat calculator',
        'Goal-based saving',
        'Simulasi keuangan',
        'Konsultasi dengan ahli'
      ]
    }
  ];

  const additionalFeatures = [
    {
      title: 'Multi-Currency Support',
      description: 'Kelola keuangan dalam berbagai mata uang',
      icon: '💱'
    },
    {
      title: 'Real-time Notifications',
      description: 'Notifikasi transaksi dan update portofolio',
      icon: '🔔'
    },
    {
      title: 'Secure Transactions',
      description: 'Keamanan tingkat bank dengan enkripsi end-to-end',
      icon: '🛡️'
    },
    {
      title: 'Data Analytics',
      description: 'Insight mendalam dari data keuangan Anda',
      icon: '📊'
    },
    {
      title: 'Mobile & Web App',
      description: 'Akses dari mana saja dengan sinkronisasi real-time',
      icon: '📱'
    },
    {
      title: '24/7 Support',
      description: 'Tim support siap membantu kapan saja',
      icon: '🎧'
    }
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section class="container mx-auto px-4 py-16">
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Fitur <span class="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Lengkap</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Jelajahi berbagai fitur canggih yang dirancang khusus untuk membantu Anda mengelola keuangan dengan lebih efektif dan efisien
          </p>
        </div>
      </section>

      {/* Main Features Section */}
      <section class="container mx-auto px-4 py-16">
        <div class="mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            Fitur Utama Tabungin
          </h2>
          
          {/* Tab Navigation */}
          <div class="flex flex-wrap justify-center gap-4 mb-12">
            {mainFeatures.map((feature, index) => (
              <button
                onClick={() => setActiveTab(index)}
                class={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab() === index
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span class="mr-2">{feature.icon}</span>
                {feature.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div>
                <div class={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${mainFeatures[activeTab()].color} mb-6`}>
                  <span class="text-2xl">{mainFeatures[activeTab()].icon}</span>
                </div>
                <h3 class="text-3xl font-bold text-gray-800 mb-4">
                  {mainFeatures[activeTab()].title}
                </h3>
                <p class="text-lg text-gray-600 mb-8">
                  {mainFeatures[activeTab()].description}
                </p>
                
                <div class="space-y-4">
                  {mainFeatures[activeTab()].features.map((feature) => (
                    <div class="flex items-center space-x-3">
                      <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-sm">✓</span>
                      </div>
                      <span class="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div class="mt-8">
                  <button class={`bg-gradient-to-r ${mainFeatures[activeTab()].color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}>
                    Coba Fitur Ini
                  </button>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div class="relative">
                <div class="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <div class={`w-32 h-32 bg-gradient-to-r ${mainFeatures[activeTab()].color} rounded-full flex items-center justify-center`}>
                    <span class="text-6xl">{mainFeatures[activeTab()].icon}</span>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div class="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
                <div class="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-400 rounded-full"></div>
                <div class="absolute top-1/2 -left-8 w-6 h-6 bg-blue-400 rounded-full"></div>
                <div class="absolute top-1/4 -right-8 w-6 h-6 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section class="bg-white py-16">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Fitur Tambahan
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Nikmati berbagai fitur pendukung yang membuat pengalaman menggunakan Tabungin semakin optimal
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature) => (
              <div class="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl flex items-center justify-center mb-4">
                  <span class="text-xl">{feature.icon}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p class="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
            
      {/* CTA Section */}
      <section class="bg-gradient-to-r from-green-500 to-blue-600 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Menggunakan Semua Fitur?
          </h2>
          <p class="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Mulai dengan paket gratis dan upgrade kapan saja sesuai kebutuhan Anda
          </p>
          <div class="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <a href="/Login" class="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors block text-center">
              Coba Gratis
            </a>
            <a href="/Testimoni" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors block text-center">
               Komentar
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Features;