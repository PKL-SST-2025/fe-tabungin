import { Component, createSignal, For, onMount, createMemo } from 'solid-js';
import '../styles/fire-animations.css';

interface StreakDay {
  date: string;
  has_deposit: boolean;
  deposit_amount?: number;
  is_today: boolean;
  is_part_of_streak: boolean;
}

interface StreakDataResponse {
  current_streak: number;
  days: StreakDay[];
}

interface StreakCalendarProps {
  streakData?: StreakDataResponse;
  totalDays?: number;
}

const StreakCalendar: Component<StreakCalendarProps> = (props) => {
  const [animationDelay, setAnimationDelay] = createSignal(0);
  const totalDays = () => props.totalDays || 16;

  const streakDays = createMemo(() => {
    return props.streakData?.current_streak || 0;
  });

  const streakData = createMemo(() => {
    console.log('=== STREAK CALENDAR DATA ===');
    console.log('StreakCalendar - Received streak data:', props.streakData);
    
    if (!props.streakData?.days) {
      console.log('No streak data available, generating empty days');
      // Generate empty days if no data
      const days: StreakDay[] = [];
      const today = new Date();
      
      for (let i = totalDays() - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        days.push({
          date: date.toISOString().split('T')[0],
          has_deposit: false,
          is_today: i === 0,
          is_part_of_streak: false,
        });
      }
      return days;
    }
    
    return props.streakData.days;
  });

  onMount(() => {
    // Trigger animation dengan delay untuk setiap flame
    streakData().forEach((day, index) => {
      if (day.has_deposit || day.is_part_of_streak) {
        setTimeout(() => {
          setAnimationDelay(index);
          
          // Add sound effect untuk streak yang aktif (optional)
          if (day.is_today) {
            // Trigger haptic feedback di mobile
            if ('vibrate' in navigator) {
              navigator.vibrate([100, 50, 100]);
            }
          }
        }, index * 150);
      }
    });
  });

  const FireIcon: Component<{ isActive: boolean; isToday: boolean; delay: number }> = (fireProps) => {
    const fireId = `fire-${fireProps.delay}`;
    
    return (
      <div 
        class={`relative transition-all duration-500 ${fireProps.isActive ? 'scale-110' : 'scale-90 opacity-50'}`}
        style={`animation-delay: ${fireProps.delay * 100}ms`}
      >
        {fireProps.isActive ? (
          // Api menyala dengan gradient dan animasi berkobar
          <div class="relative">
            {/* Base fire with flickering animation */}
            <div class="fire-container relative">
              <svg
                class="w-8 h-8 drop-shadow-lg fire-flicker"
                fill="url(#fire-gradient)"
                viewBox="0 0 24 24"
                style={`
                  animation: fireFlicker 0.5s ease-in-out infinite alternate,
                             fireGlow 2s ease-in-out infinite alternate;
                  filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.6));
                `}
              >
                <path d="M12 2C12 2 6 8 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 8 12 2 12 2Z" />
              </svg>
              
              {/* Gradient definitions */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="fire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff4444;stop-opacity:1" />
                    <stop offset="30%" style="stop-color:#ff6b35;stop-opacity:1" />
                    <stop offset="60%" style="stop-color:#f7931e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ffeb3b;stop-opacity:1" />
                  </linearGradient>
                  <radialGradient id="fire-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ffeb3b;stop-opacity:0.8" />
                    <stop offset="70%" style="stop-color:#ff6b35;stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:#ff4444;stop-opacity:0.1" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            
            {/* Outer glow effect */}
            <div 
              class="absolute inset-0 -m-2 rounded-full blur-sm"
              style={`
                background: radial-gradient(circle, rgba(255,107,53,0.3) 0%, rgba(247,147,30,0.2) 50%, transparent 70%);
                animation: glowPulse 1.5s ease-in-out infinite alternate;
              `}
            ></div>
            
            {/* Floating sparks */}
            <div class="absolute inset-0">
              {/* Spark 1 */}
              <div 
                class="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={`
                  top: -5px;
                  left: 50%;
                  transform: translateX(-50%);
                  animation: sparkFloat1 2s ease-in-out infinite, sparkFade 2s ease-in-out infinite;
                `}
              ></div>
              
              {/* Spark 2 */}
              <div 
                class="absolute w-0.5 h-0.5 bg-orange-400 rounded-full"
                style={`
                  top: -8px;
                  left: 30%;
                  animation: sparkFloat2 1.8s ease-in-out infinite, sparkFade 1.8s ease-in-out infinite;
                  animation-delay: 0.5s;
                `}
              ></div>
              
              {/* Spark 3 */}
              <div 
                class="absolute w-0.5 h-0.5 bg-red-400 rounded-full"
                style={`
                  top: -6px;
                  right: 30%;
                  animation: sparkFloat3 2.2s ease-in-out infinite, sparkFade 2.2s ease-in-out infinite;
                  animation-delay: 1s;
                `}
              ></div>
            </div>
            
            {/* Heat waves effect */}
            <div 
              class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 opacity-30"
              style={`
                background: linear-gradient(to top, transparent 0%, rgba(255,107,53,0.1) 50%, transparent 100%);
                animation: heatWave 1s ease-in-out infinite alternate;
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
              `}
            ></div>
          </div>
        ) : (
          // Api mati dengan asap
          <div class="relative opacity-40">
            <svg
              class="w-8 h-8 text-gray-400 transition-all duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C12 2 6 8 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 8 12 2 12 2Z" />
            </svg>
            
            {/* Asap untuk api mati */}
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div 
                class="w-1 h-3 bg-gray-300 rounded-full opacity-30"
                style={`
                  animation: smokeRise 3s ease-in-out infinite;
                `}
              ></div>
            </div>
            <div class="absolute -top-2 left-1/3 transform -translate-x-1/2">
              <div 
                class="w-0.5 h-2 bg-gray-400 rounded-full opacity-20"
                style={`
                  animation: smokeRise 2.5s ease-in-out infinite;
                  animation-delay: 0.5s;
                `}
              ></div>
            </div>
          </div>
        )}
        
        {/* CSS animations - embed in style tag */}
        <style>{`
          @keyframes fireFlicker {
            0% { transform: scale(1) rotate(-1deg); }
            25% { transform: scale(1.05) rotate(1deg); }
            50% { transform: scale(0.98) rotate(-0.5deg); }
            75% { transform: scale(1.02) rotate(0.5deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          
          @keyframes fireGlow {
            0% { filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.6)) brightness(1); }
            100% { filter: drop-shadow(0 0 12px rgba(255, 107, 53, 0.8)) brightness(1.1); }
          }
          
          @keyframes glowPulse {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.6; transform: scale(1.1); }
          }
          
          @keyframes sparkFloat1 {
            0% { transform: translateX(-50%) translateY(0px); }
            50% { transform: translateX(-40%) translateY(-8px); }
            100% { transform: translateX(-60%) translateY(-12px); }
          }
          
          @keyframes sparkFloat2 {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-6px) translateX(-3px); }
            100% { transform: translateY(-10px) translateX(2px); }
          }
          
          @keyframes sparkFloat3 {
            0% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-5px) translateX(3px); }
            100% { transform: translateY(-9px) translateX(-2px); }
          }
          
          @keyframes sparkFade {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 0.3; }
          }
          
          @keyframes heatWave {
            0% { transform: translateX(-50%) scaleY(1) skewX(0deg); }
            100% { transform: translateX(-50%) scaleY(1.2) skewX(2deg); }
          }
          
          @keyframes smokeRise {
            0% { transform: translateX(-50%) translateY(0px) scaleY(1); opacity: 0.3; }
            50% { transform: translateX(-45%) translateY(-8px) scaleY(1.5); opacity: 0.1; }
            100% { transform: translateX(-55%) translateY(-15px) scaleY(2); opacity: 0; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-1">Streak Harian</h3>
          <p class="text-sm text-gray-600">
            {streakDays()} dari {totalDays()} hari berturut-turut
          </p>
        </div>
        
        {/* Trophy untuk streak tinggi */}
        {streakDays() >= totalDays() && (
          <div class="animate-bounce">
            <div class="text-3xl">🏆</div>
          </div>
        )}
        {streakDays() >= 7 && streakDays() < totalDays() && (
          <div class="animate-pulse">
            <div class="text-2xl">🔥</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round((streakDays() / totalDays()) * 100)}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            class="h-3 rounded-full bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 transition-all duration-1000 ease-out"
            style={`width: ${Math.min((streakDays() / totalDays()) * 100, 100)}%`}
          >
            <div class="h-full bg-white bg-opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Calendar Streak */}
      <div class="grid grid-cols-5 gap-4">
        <For each={streakData()}>
          {(day, index) => {
            const dayDate = new Date(day.date);
            
            return (
              <div class="flex flex-col items-center space-y-2 min-h-[100px]">
                {/* Tanggal lengkap */}
                <div class={`text-xs font-medium text-center ${day.is_today ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                  <div class="text-sm">{dayDate.getDate()}</div>
                  <div class="text-xs">{dayDate.toLocaleDateString('id-ID', { 
                    month: 'short'
                  })}</div>
                  {day.is_today && (
                    <div class="text-xs text-orange-500 font-bold">Hari ini</div>
                  )}
                </div>
                
                {/* Fire Icon */}
                <div class="relative flex-1 flex items-center justify-center">
                  <FireIcon 
                    isActive={day.has_deposit || day.is_part_of_streak} 
                    isToday={day.is_today}
                    delay={index()}
                  />
                </div>
                
                {/* Status dan amount */}
                <div class={`text-xs text-center mt-2 ${
                  day.has_deposit || day.is_part_of_streak ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {day.has_deposit ? (
                    <div>
                      <div class="font-semibold text-green-600">✓ Nabung</div>
                      {day.deposit_amount && (
                        <div class="text-xs text-green-600 mt-1">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(day.deposit_amount)}
                        </div>
                      )}
                    </div>
                  ) : day.is_today ? (
                    <div class="text-orange-500 font-semibold">Hari ini</div>
                  ) : (
                    <div class="text-gray-400">-</div>
                  )}
                </div>
              </div>
            );
          }}
        </For>
      </div>

      {/* Motivational Text */}
      <div class="mt-6 text-center">
        {streakDays() >= totalDays() ? (
          <div class="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4 border border-orange-200">
            <div class="text-2xl mb-2">🎉</div>
            <p class="text-orange-800 font-semibold">Luar biasa! Streak sempurna!</p>
            <p class="text-orange-600 text-sm">Anda telah menabung {totalDays()} hari berturut-turut</p>
          </div>
        ) : streakDays() >= 7 ? (
          <div class="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 border border-red-200">
            <div class="text-xl mb-2">🔥</div>
            <p class="text-red-800 font-semibold">Streak panas! Terus pertahankan!</p>
            <p class="text-red-600 text-sm">Tinggal {totalDays() - streakDays()} hari lagi untuk streak sempurna</p>
          </div>
        ) : streakDays() >= 3 ? (
          <div class="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border border-yellow-200">
            <div class="text-xl mb-2">⚡</div>
            <p class="text-yellow-800 font-semibold">Bagus! Momentum sedang naik</p>
            <p class="text-yellow-600 text-sm">Jangan putuskan streak yang bagus ini</p>
          </div>
        ) : (
          <div class="bg-gradient-to-r from-gray-100 to-blue-100 rounded-lg p-4 border border-gray-200">
            <div class="text-xl mb-2">💪</div>
            <p class="text-gray-800 font-semibold">Ayo mulai streak baru!</p>
            <p class="text-gray-600 text-sm">Konsistensi adalah kunci kesuksesan menabung</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCalendar;