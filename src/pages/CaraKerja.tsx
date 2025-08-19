import { Component, createSignal, onMount, For } from 'solid-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Step {
  id: number;
  title: string;
  description: string;
  features: string[];
  icon: string;
  progress: number;
  amount?: string;
}

const CaraKerjaTabungin: Component = () => {
  const [activeStep, setActiveStep] = createSignal(0);
  const [isVisible, setIsVisible] = createSignal(false);

  const steps: Step[] = [
    {
      id: 1,
      title: "Daftar & Setup Akun",
      description: "Mulai perjalanan finansial Anda dengan mudah melalui platform digital Tabungin yang aman dan user-friendly.",
      features: [
        "Verifikasi identitas cepat dan mudah",
        "Hubungkan OTP untuk keamanan maksimal",
        "Setup profil personal dengan antarmuka intuitif",
        "Pilih metode pembayaran sesuai kebutuhan"
      ],
      icon: "user-plus",
      progress: 25,
      amount: "Rp 0"
    },
    {
      id: 2,
      title: "Tentukan Target Tabungan",
      description: "Atur tujuan finansial Anda dengan fleksibilitas penuh melalui aplikasi Tabungin.",
      features: [
        "Tetapkan target tabungan sesuai kebutuhan",
        "Otomatisasi tabungan harian yang fleksibel",
        "Kelola multiple target dalam satu akun",
        "Dapatkan pengingat otomatis untuk menabung"
      ],
      icon: "target",
      progress: 50,
      amount: "Rp 5.000.000"
    },
    {
      id: 3,
      title: "Mulai Menabung Rutin",
      description: "Nikmati kemudahan menabung dengan sistem otomatis yang cerdas dan aman.",
      features: [
        "Top-up fleksibel mulai dari Rp 10.000",
        "Auto-debet untuk konsistensi tabungan",
        "Bonus reward untuk setiap pencapaian",
        "Transaksi aman dengan autentikasi terpercaya"
      ],
      icon: "wallet",
      progress: 75,
      amount: "Rp 50.000.000"
    },
    {
      id: 4,
      title: "Pantau Progress & Raih Target",
      description: "Pantau perkembangan tabungan Anda secara real-time melalui dashboard interaktif.",
      features: [
        "Dashboard real-time untuk memantau progress",
        "Grafik analisis tabungan yang mendalam",
        "Laporan bulanan otomatis untuk kejelasan",
        "Hadiah milestone untuk pencapaian target"
      ],
      icon: "chart",
      progress: 100,
      amount: "TARGET TERCAPAI"
    }
  ];

  onMount(() => {
    setTimeout(() => setIsVisible(true), 200);
  });

  const IconComponent = (props: { name: string }) => {
    const icons = {
      'user-plus': (
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          <path d="M20 10v2h-2v2h-2v-2h-2v-2h2V8h2v2h2z"/>
        </svg>
      ),
      'target': (
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      ),
      'wallet': (
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      ),
      'chart': (
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L3.5 16.99z"/>
        </svg>
      )
    };
    
    return icons[props.name as keyof typeof icons] || icons['user-plus'];
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Navbar */}
      <Navbar /> 

    <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content */}
        <div class="text-center mb-20">
          <h1 class="text-4xl font-bold text-gray-800 mb-6">Cara Kerja Tabungin</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mulai perjalanan finansial Anda dengan 4 langkah mudah melalui aplikasi Tabungin, solusi digital untuk manajemen keuangan yang aman dan user-friendly!
          </p>
        </div>

        {/* Steps */}
        <div class="space-y-32">
          <For each={steps}>
            {(step, index) => (
              <div 
                class={`flex items-center gap-16 transition-all duration-1000 transform ${
                  isVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${index() % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                style={`transition-delay: ${index() * 200}ms`}
              >
                {/* Content */}
                <div class="flex-1 max-w-xl">
                  <div class="flex items-center gap-4 mb-6">
                    <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/30">
                      {step.id}
                    </div>
                    <div class="h-1 w-20 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
                  </div>
                  
                  <h3 class="text-3xl font-bold text-gray-800 mb-4">
                    {step.title}
                  </h3>
                  
                  <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul class="space-y-3">
                    <For each={step.features}>
                      {(feature) => (
                        <li class="flex items-center gap-3 text-gray-700">
                          <div class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                          <span class="text-lg">{feature}</span>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>

                {/* Phone Mockup */}
                <div class="flex-1 max-w-md flex justify-center">
                  <div class="relative">
                    <div class="w-72 h-[480px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-6 shadow-2xl">
                      <div class="w-full h-full bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background decoration */}
                        <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50"></div>
                        
                        {/* Content */}
                        <div class="relative z-10 text-center">
                          <div class="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                            <IconComponent name={step.icon} />
                          </div>
                          
                          <h4 class="text-lg font-semibold text-gray-800 mb-4">
                            Smart Saving
                          </h4>
                          
                          {/* Step indicator */}
                          <div class="flex justify-center space-x-2 mt-6">
                            <For each={Array(4).fill(0)}>
                              {(_, i) => (
                                <div 
                                  class={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    i() < step.id ? 'bg-emerald-500' : 'bg-gray-300'
                                  }`}
                                ></div>
                              )}
                            </For>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div class="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <span class="text-white text-sm">💡</span>
                    </div>
                    <div class="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center shadow-lg">
                      <span class="text-white text-sm">💰</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Call to Action */}
        <div class="text-center mt-32">
          <div class="bg-white rounded-3xl shadow-2xl p-12 max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">
              Download Aplikasi Tabungin Sekarang!
            </h2>
            <p class="text-lg text-gray-600 mb-8">
              Bergabunglah dengan jutaan pengguna yang telah merasakan kemudahan mengelola keuangan melalui solusi fintech Tabungin!
            </p>
            <a href="/download" class="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30">
              Mulai Sekarang
            </a>
          </div>
        </div>
      </div>
    </div>
          {/* Footer */}
      <Footer />
    </div>
  );
};

export default CaraKerjaTabungin;