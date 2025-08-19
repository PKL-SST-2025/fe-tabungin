import { Component, createSignal, onMount, createMemo } from 'solid-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../components/LanguageContext';

const LandingPage: Component = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  const { language } = useLanguage();

  const t = createMemo(() => ({
    id: {
      heroBadge: "Kelola Uang Pribadi Menjadi Digital",
      heroTitle1: "Pantau Target",
      heroTitle2: "Tabunganmu",
      heroDescription: "Atur tabungan pribadimu dengan mudah melalui solusi fintech yang aman dan user-friendly.",
      getStarted: "Mulai →",
      ctaTitle: "Mulai Perjalanan Finansial Anda Hari Ini",
      ctaDesc: "Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan mengelola tabungan melalui solusi fintech Tabungin.",
      download: "Download Aplikasi",
      learnMore: "Pelajari Lebih Lanjut",
    },
    en: {
      heroBadge: "Manage Personal Mon~~ey Digitally",
      heroTitle1: "Track Your",
      heroTitle2: "Savings Goal",
      heroDescription: "Easily manage your personal savings through a secure and user-friendly fintech solution.",
      getStarted: "Get Started →",
      ctaTitle: "Start Your Financial Journey Today",
      ctaDesc: "Join thousands of users who have experienced the ease of managing savings with Tabungin.",
      download: "Download App",
      learnMore: "Learn More",
    },
  })[language()]);

  onMount(() => {
    setTimeout(() => setIsVisible(true), 100);
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <Navbar />

      {/* Hero Section */}
      <section class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class={`transform transition-all duration-1000 ${isVisible() ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div class="mb-6">
                <span class="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  {t().heroBadge}
                </span>
                <h1 class="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
                  {t().heroTitle1}
                  <span class="block text-emerald-600">{t().heroTitle2}</span>
                </h1>
                <p class="text-xl text-gray-600 mb-8 leading-relaxed">
                  {t().heroDescription}
                </p>
                <a 
                  href="/Beranda"
                  class="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t().getStarted}
                </a>
              </div>
            </div>

            <div class={`transform transition-all duration-1000 delay-300 ${isVisible() ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div class="relative">
                <div class="bg-white rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div class="flex items-center justify-center mb-6">
                    <div class="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span class="text-3xl">💰</span>
                    </div>
                  </div>
                  <div class="text-center">
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">Smart Saving</h3>
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div class="p-2 bg-blue-500"></div>
                    </div>
                    <p class="text-gray-600">Target: Rp 10.000.000</p>
                    <p class="text-emerald-600 font-semibold">Tercapai: Rp 7.500.000</p>
                  </div>
                </div>

                {/* Floating icons */}
                <div class="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <span class="text-xl">🎯</span>
                </div>
                <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center animate-pulse">
                  <span class="text-2xl">🐷</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-4xl font-bold text-white mb-6">{t().ctaTitle}</h2>
          <p class="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">{t().ctaDesc}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/download" class="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
              {t().download}
            </a>
            <a href="/CaraKerja" class="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transform hover:scale-105 transition-all duration-200">
              {t().learnMore}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
