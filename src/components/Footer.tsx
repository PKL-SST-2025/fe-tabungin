import { Component, createSignal } from 'solid-js';

const Footer: Component = () => {
  const [language, setLanguage] = createSignal<'id' | 'en'>('id');

  const content = {
    id: {
      description: 'Aplikasi finansial terpercaya untuk mengelola tabungan dan investasi Anda.',
      products: 'Produk',
      company: 'Perusahaan',
      contact: 'Kontak',
      saving: 'Tabungan',
      investment: 'Investasi',
      insurance: 'Asuransi',
      aboutUs: 'Tentang Kami',
      career: 'Karir',
      blog: 'Blog',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
      location: 'Timika-Papua, Indonesia',
      copyright: '© 2025 Tabungin. Semua hak dilindungi.',
    },
    en: {
      description: 'A trusted financial app to manage your savings and investments.',
      products: 'Products',
      company: 'Company',
      contact: 'Contact',
      saving: 'Savings',
      investment: 'Investment',
      insurance: 'Insurance',
      aboutUs: 'About Us',
      career: 'Career',
      blog: 'Blog',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
      location: 'Timika-Papua, Indonesia',
      copyright: '© 2025 Tabungin. All rights reserved.',
    },
  };

  const t = () => content[language()];

  return (
    <footer class="bg-gray-800 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Language Switcher */}
        <div class="flex justify-end mb-4">
          <button
            class="text-gray-400 hover:text-white mr-2"
            onClick={() => setLanguage('id')}
          >
            (🇮🇩) Indonesia
          </button>
          <button
            class="text-gray-400 hover:text-white"
            onClick={() => setLanguage('en')}
          >
            (🇺🇸) English
          </button>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span class="text-white font-bold">T</span>
              </div>
              <span class="text-xl font-bold">TABUNGIN</span>
            </div>
            <p class="text-gray-400">{t().description}</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">{t().products}</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="" class="hover:text-white transition-colors">{t().saving}</a></li>
              <li><a href="" class="hover:text-white transition-colors">{t().investment}</a></li>
              <li><a href="" class="hover:text-white transition-colors">{t().insurance}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">{t().company}</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="" class="hover:text-white transition-colors">{t().aboutUs}</a></li>
              <li><a href="" class="hover:text-white transition-colors">{t().career}</a></li>
              <li><a href="" class="hover:text-white transition-colors">{t().blog}</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">{t().contact}</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="https://www.instagram.com/zyluxx_mar" class="hover:text-white transition-colors">{t().instagram}</a></li>
              <li><a href="https://wa.me/6281251841442?text=Halo%20saya%20ingin%20bertanya%20tentang%20Tabungin" class="hover:text-white transition-colors">{t().whatsapp}</a></li>
              <li><a href="https://www.google.com/maps/place/Timika,+Mimika+Baru,+Mimika+Regency,+Papua/@-4.5579932,136.8671119,14z/data=!3m1!4b1!4m6!3m5!1s0x682377469f96e671:0xc49ba80f3e2d7ead!8m2!3d-4.546759!4d136.8837207!16s%2Fm%2F0bs1v8s?entry=ttu&g_ep=EgoyMDI1MDcwNi4wIKXMDSoASAFQAw%3D%3D"
               class="hover:text-white transition-colors">{t().location}</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>{t().copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
