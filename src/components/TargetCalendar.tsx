import { Component, createSignal, For, createMemo, createEffect, onMount } from 'solid-js';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'target_deadline' | 'milestone' | 'weekly_reminder' | 'deadline' | 'reminder' | 'completed';
  description: string;
  target_name: string;
  target_icon: string;
  target_icon_color: string;
  is_completed: boolean;
}

interface TargetCalendarProps {
  events: CalendarEvent[];
  onDateClick?: (date: string) => void;
}

const TargetCalendar: Component<TargetCalendarProps> = (props) => {
  // Set default to August 2025
  const [currentDate, setCurrentDate] = createSignal(new Date(2025, 7, 9)); // August = month 7 in JS
  const [selectedDate, setSelectedDate] = createSignal<string | null>(null);
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [persistentEvents, setPersistentEvents] = createSignal<CalendarEvent[]>([]);

  // Load from localStorage on mount
  onMount(() => {
    const loadCachedEvents = () => {
      try {
        // Clear old cached events to force fresh fetch for August 2025
        localStorage.removeItem('tabungin_calendar_events');
        console.log('🧹 Cleared old cached events, will load fresh data for August 2025');
        
        const cached = localStorage.getItem('tabungin_calendar_events');
        if (cached) {
          const events = JSON.parse(cached);
          console.log('📦 Loaded from localStorage:', events.length, 'events');
          setPersistentEvents(events);
        } else {
          console.log('📦 No cached events found, will wait for props');
        }
      } catch (e) {
        console.error('❌ Failed to load cached events:', e);
      }
      setIsLoaded(true);
    };

    // Delay untuk memastikan component fully mounted
    setTimeout(loadCachedEvents, 100);
    
    // Trigger manual refresh jika tidak ada data setelah 2 detik
    setTimeout(() => {
      if (events().length === 0) {
        console.log('🔄 No events after 2s, triggering manual refresh for August 2025');
        // Dispatch custom event untuk trigger parent refresh
        window.dispatchEvent(new CustomEvent('calendar-needs-refresh'));
      }
    }, 2000);
  });

  // Save to localStorage whenever props.events changes
  createEffect(() => {
    const propsEvents = props.events;
    console.log('🔍 Calendar events effect triggered:', {
      propsEventsCount: propsEvents?.length || 0,
      propsEvents: propsEvents?.map(e => ({ 
        title: e.title, 
        date: e.date, 
        type: e.type,
        is_completed: e.is_completed 
      }))
    });
    
    if (propsEvents && propsEvents.length > 0) {
      try {
        localStorage.setItem('tabungin_calendar_events', JSON.stringify(propsEvents));
        setPersistentEvents(propsEvents);
        console.log('💾 Saved to localStorage:', propsEvents.length, 'events');
        
        // Debug specific events
        propsEvents.forEach((event, index) => {
          console.log(`📅 Event ${index + 1}:`, {
            title: event.title,
            date: event.date,
            type: event.type,
            is_completed: event.is_completed,
            target_name: event.target_name
          });
        });
      } catch (e) {
        console.error('❌ Failed to save to localStorage:', e);
      }
    }
  });

  // Events memo with fallback strategy
  const events = createMemo(() => {
    const propsEvents = props.events || [];
    const cached = persistentEvents();
    
    // Debug info
    console.log('🔍 Events memo evaluation:', {
      propsEventsCount: propsEvents.length,
      cachedEventsCount: cached.length,
      isLoaded: isLoaded()
    });
    
    // Priority: props events > cached events > empty array
    if (propsEvents.length > 0) {
      console.log('✅ Using props events:', propsEvents.length);
      return propsEvents;
    } else if (cached.length > 0 && isLoaded()) {
      console.log('🔄 Using cached events:', cached.length);
      return cached;
    }
    
    console.log('⚠️ No events available');
    return [];
  });

  // Debug current events status with periodic logging
  createEffect(() => {
    const currentEvents = events();
    console.log('📊 Current events status:', {
      count: currentEvents.length,
      events: currentEvents.map(e => ({ 
        title: e.title, 
        date: e.date, 
        type: e.type,
        id: e.id,
        target_name: e.target_name 
      }))
    });
    
    // Debug each event date format
    currentEvents.forEach((event, index) => {
      console.log(`🔍 Event ${index + 1} date analysis:`, {
        original: event.date,
        includes_T: event.date?.includes('T'),
        regex_match: event.date?.match(/^\d{4}-\d{2}-\d{2}$/),
        parsed_date: new Date(event.date),
        is_valid: !isNaN(new Date(event.date).getTime())
      });
    });
    
    // GLOBAL CALENDAR STATUS LOGGING
    setTimeout(() => {
      console.log(`🌟 GLOBAL CALENDAR STATUS REPORT:`, {
        totalEventsLoaded: currentEvents.length,
        currentMonth: currentDate().getMonth() + 1,
        currentYear: currentDate().getFullYear(),
        isAugust2025: currentDate().getFullYear() === 2025 && currentDate().getMonth() === 7,
        hasEventsForAugust6: currentEvents.some(e => e.date === '2025-08-06'),
        day6ShouldShowMark: currentEvents.length > 0 && currentDate().getFullYear() === 2025 && currentDate().getMonth() === 7
      });
    }, 1000);
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDateString = (day: number) => {
    if (!day) return '';
    const date = new Date(currentDate().getFullYear(), currentDate().getMonth(), day);
    // Format ke YYYY-MM-DD untuk konsistensi
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getEventsForDate = (day: number) => {
    if (!day) return [];
    const targetDateStr = formatDateString(day);
    
    const eventsArray = events();
    console.log(`🔍 getEventsForDate(${day}) checking:`, {
      targetDate: targetDateStr,
      totalEvents: eventsArray.length,
      eventsArray: eventsArray.map(e => ({ title: e.title, date: e.date, type: e.type }))
    });
    
    // SPECIAL DEBUGGING for day 5 (August 5 with completed event)
    if (day === 5) {
      console.log(`🎯 SPECIAL DEBUG for day 5 (should have completed event):`, {
        targetDateStr,
        eventsArray: eventsArray.map(e => ({
          title: e.title,
          date: e.date,
          type: e.type,
          is_completed: e.is_completed,
          target_name: e.target_name
        })),
        shouldHaveCompletedEvent: eventsArray.some(e => e.date === '2025-08-05' && e.type === 'completed')
      });
    }
    
    // SPECIAL DEBUGGING for day 6
    if (day === 6) {
      console.log(`🎯 SPECIAL DEBUG for day 6:`, {
        targetDateStr,
        eventsArray,
        firstEventFullData: eventsArray[0]
      });
      
      // FORCE TESTING: Let's manually check if event should match day 6
      if (eventsArray.length > 0) {
        const firstEvent = eventsArray[0];
        console.log(`🧪 MANUAL CHECK for day 6:`, {
          eventDate: firstEvent.date,
          targetDate: targetDateStr,
          shouldMatch: firstEvent.date === '2025-08-06' && targetDateStr === '2025-08-06',
          charByChar: {
            eventChars: firstEvent.date.split(''),
            targetChars: targetDateStr.split(''),
            eventLength: firstEvent.date.length,
            targetLength: targetDateStr.length
          }
        });
        
        // EMERGENCY: Force return event for day 6 if we have 2025-08-06 event
        if (firstEvent.date === '2025-08-06' && targetDateStr === '2025-08-06') {
          console.log(`🚨 FORCE RETURNING EVENT for day 6!`);
          return [firstEvent];
        }
      }
    }
    
    if (!eventsArray || eventsArray.length === 0) {
      console.log(`❌ No events array for day ${day} - but let's check events() signal directly`);
      const directEvents = events();
      console.log(`🔍 Direct events() call returns:`, directEvents.length, 'events', directEvents.map(e => ({title: e.title, date: e.date, type: e.type})));
      if (directEvents.length > 0) {
        console.log(`🎯 Found events via direct call, using those instead`);
        const directMatches = directEvents.filter(event => {
          if (!event || !event.date) return false;
          let eventDate = event.date;
          if (eventDate.includes('T')) {
            eventDate = eventDate.split('T')[0];
          }
          const matches = eventDate === targetDateStr;
          console.log(`🎯 Direct match check: "${eventDate}" === "${targetDateStr}" = ${matches} for event "${event.title}"`);
          return matches;
        });
        console.log(`✅ Direct matches found:`, directMatches.length, directMatches.map(e => e.title));
        return directMatches;
      }
      return [];
    }
    
    const matchingEvents = eventsArray.filter(event => {
      if (!event || !event.date) {
        console.log(`❌ Invalid event or missing date:`, event);
        return false;
      }
      
      // Handle berbagai format tanggal dengan detailed logging
      let eventDateStr = '';
      try {
        console.log(`🔍 Processing event "${event.title}" with date: "${event.date}"`);
        
        if (event.date.includes('T')) {
          // Format ISO dengan timestamp
          const eventDate = new Date(event.date);
          if (isNaN(eventDate.getTime())) {
            console.log(`❌ Invalid ISO date: ${event.date}`);
            return false;
          }
          eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
          console.log(`✅ ISO date parsed: ${event.date} → ${eventDateStr}`);
        } else if (event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Format YYYY-MM-DD
          eventDateStr = event.date;
          console.log(`✅ Already YYYY-MM-DD format: ${eventDateStr}`);
        } else {
          // Fallback untuk format lain
          const eventDate = new Date(event.date);
          if (isNaN(eventDate.getTime())) {
            console.log(`❌ Invalid fallback date: ${event.date}`);
            return false;
          }
          eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
          console.log(`✅ Fallback date parsed: ${event.date} → ${eventDateStr}`);
        }
      } catch (e) {
        console.error('❌ Error parsing date:', event.date, e);
        return false;
      }
      
      const match = eventDateStr === targetDateStr;
      console.log(`🎯 Date comparison: "${eventDateStr}" === "${targetDateStr}" = ${match}`);
      
      // EXTRA DEBUG for day 6
      if (day === 6) {
        console.log(`🔥 DAY 6 EXTRA DEBUG:`, {
          eventTitle: event.title,
          originalEventDate: event.date,
          parsedEventDate: eventDateStr,
          targetDate: targetDateStr,
          match,
          eventDateLength: eventDateStr.length,
          targetDateLength: targetDateStr.length,
          charByChar: {
            event: eventDateStr.split(''),
            target: targetDateStr.split('')
          }
        });
      }
      
      if (match) {
        console.log(`✅ MATCH FOUND! Event "${event.title}" matches day ${day}`);
      }
      
      return match;
    });
    
    // Log hasil akhir
    console.log(`� Final result for day ${day}:`, {
      targetDate: targetDateStr,
      matchCount: matchingEvents.length,
      matches: matchingEvents.map(e => e.title)
    });
    
    return matchingEvents;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate());
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    
    // Trigger event untuk parent component untuk reload calendar events
    console.log('📅 Month changed to:', newDate.getFullYear(), newDate.getMonth() + 1);
    window.dispatchEvent(new CustomEvent('calendar-month-changed', {
      detail: {
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear()
      }
    }));
  };

  const isToday = (day: number) => {
    if (!day) return false;
    const today = new Date();
    const date = new Date(currentDate().getFullYear(), currentDate().getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (day: number) => {
    if (!day) return;
    const dateStr = formatDateString(day);
    setSelectedDate(dateStr);
    props.onDateClick?.(dateStr);
  };

  const getEventDot = (type: string) => {
    switch (type) {
      case 'target_deadline':
      case 'deadline':
        return 'bg-red-500';
      case 'milestone':
        return 'bg-yellow-500';
      case 'weekly_reminder':
      case 'reminder':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'target_deadline':
        return '🎯';
      case 'milestone':
        return '⭐';
      case 'weekly_reminder':
        return '🔔';
      case 'completed':
        return '✅';
      default:
        return '📅';
    }
  };

  return (
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-md mx-auto">
      {/* Compact Minimalist Header */}
      <div class="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <span class="text-sm">📅</span>
            </div>
            <h3 class="text-sm font-medium">Calendar</h3>
          </div>
          <div class="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="text-center min-w-[100px]">
              <div class="text-sm font-medium">
                {monthNames[currentDate().getMonth()]} {currentDate().getFullYear()}
              </div>
            </div>
            <button
              onClick={() => navigateMonth('next')}
              class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="p-4">
        {/* Compact Day Headers */}
        <div class="grid grid-cols-7 gap-1 mb-3">
          <For each={dayNames}>
            {(dayName) => (
              <div class="text-center text-xs font-medium text-gray-400 py-1">
                {dayName.slice(0, 1)}
              </div>
            )}
          </For>
        </div>

        {/* Compact Minimalist Calendar Grid */}
        <div class="grid grid-cols-7 gap-1">
          <For each={getDaysInMonth(currentDate())}>
            {(day) => {
              if (day === null) {
                return <div class="w-10 h-10"></div>;
              }

              const dayEvents = getEventsForDate(day);
              const dateStr = formatDateString(day);
              const isSelected = selectedDate() === dateStr;
              
              // Simplified - no marks, clean calendar only
              
              // STRONG DEBUG: Only show for August 2025 and correct dates
              const isAugust2025 = currentDate().getFullYear() === 2025 && currentDate().getMonth() === 7; // August = month 7
              const hasActualEvents = dayEvents.length > 0;
              const isTargetDay = false; // DISABLED: Don't force show fallback marks
              const forceShowForTargetDay = false; // DISABLED

              // Enhanced logic: Show events if we have them OR force show for target day  
              const shouldShowEvents = hasActualEvents;

              // DETAILED logging untuk debugging
              if (day === 5 || day === 15) {
                console.log(`🎯 DETAILED DAY ${day} DEBUG:`, {
                  day,
                  dateStr,
                  currentMonth: currentDate().getMonth(),
                  currentYear: currentDate().getFullYear(),
                  isAugust2025,
                  dayEvents: dayEvents.length,
                  dayEventsDetails: dayEvents.map(e => ({ 
                    title: e.title, 
                    type: e.type, 
                    is_completed: e.is_completed,
                    date: e.date 
                  })),
                  totalEvents: events().length,
                  hasCompletedEvent: dayEvents.some(e => e.type === 'completed'),
                  shouldShowEvents,
                  directEventsCheck: events().filter(e => {
                    let eventDate = e.date;
                    if (eventDate.includes('T')) eventDate = eventDate.split('T')[0];
                    return eventDate === dateStr;
                  })
                });
              }

              return (
                <div
                  class={`w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center relative group hover:scale-105 ${
                    isToday(day) 
                      ? 'bg-blue-500 text-white shadow-sm scale-105' 
                      : isSelected
                        ? 'bg-blue-50 border border-blue-200'
                        : shouldShowEvents
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {/* Compact Date Number */}
                  <div class={`text-sm font-medium ${
                    isToday(day) 
                      ? 'text-white' 
                      : shouldShowEvents 
                        ? 'text-gray-800' 
                        : 'text-gray-600'
                  }`}>
                    {day}
                  </div>
                  
                  {/* No marks/dots - clean calendar display */}

                  {/* Compact Fallback Indicators - DISABLED to prevent wrong marks
                  {isTargetDay && !shouldShowEvents && (
                    <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div class={`w-1.5 h-1.5 rounded-full ${
                        day === 5 ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                    </div>
                  )}
                  */}

                  {/* Emergency indicator - very small */}
                  {/* DISABLED: This was causing fake marks on day 6
                  {day === 6 && totalEventsAvailable > 0 && (
                    <div class="absolute top-0 right-0 w-0.5 h-0.5 bg-green-500 rounded-full" />
                  )}
                  */}

                </div>
              );
            }}
          </For>
        </div>
      </div>

      {/* Compact Selected Date Events */}
      {selectedDate() && (
        <div class="border-t border-gray-100 bg-gray-50 p-3">
          <div class="mb-2">
            <h4 class="text-sm font-medium text-gray-800 flex items-center space-x-2">
              <div class="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 text-xs">📍</span>
              </div>
              <span class="text-sm">
                {new Date(selectedDate()!).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </h4>
          </div>
          
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <For each={events().filter(event => {
              let eventDateStr = '';
              try {
                if (event.date.includes('T')) {
                  const eventDate = new Date(event.date);
                  eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
                } else if (event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  eventDateStr = event.date;
                } else {
                  const eventDate = new Date(event.date);
                  eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
                }
              } catch (e) {
                return false;
              }
              return eventDateStr === selectedDate();
            })}>
              {(event) => (
                <div class={`p-2 rounded-lg border-l-2 text-xs ${
                  event.type === 'completed'
                    ? 'border-l-green-500 bg-green-50'
                    : event.type === 'target_deadline' || event.type === 'deadline' 
                      ? 'border-l-red-500 bg-red-50' 
                      : event.type === 'milestone' 
                        ? 'border-l-amber-500 bg-amber-50' 
                        : 'border-l-blue-500 bg-blue-50'
                } ${event.is_completed ? 'opacity-60' : ''}`}>
                  <div class="flex items-start space-x-2">
                    <div class="text-sm">
                      {getEventIcon(event.type)}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h5 class={`font-medium text-xs ${
                        event.is_completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {event.title}
                      </h5>
                      <p class="text-xs text-gray-600 mt-0.5">{event.description}</p>
                      <div class="flex items-center space-x-2 mt-1">
                        <div class={`w-3 h-3 rounded ${event.target_icon_color} flex items-center justify-center text-xs text-white`}>
                          {event.target_icon}
                        </div>
                        <span class="text-xs text-gray-600">{event.target_name}</span>
                        {event.is_completed && (
                          <span class="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
            
            {events().filter(event => {
              let eventDateStr = '';
              try {
                if (event.date.includes('T')) {
                  const eventDate = new Date(event.date);
                  eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
                } else if (event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  eventDateStr = event.date;
                } else {
                  const eventDate = new Date(event.date);
                  eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
                }
              } catch (e) {
                return false;
              }
              return eventDateStr === selectedDate();
            }).length === 0 && (
              <div class="text-center text-gray-500 py-4">
                <div class="w-8 h-8 mx-auto mb-1 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-sm">📅</span>
                </div>
                <p class="text-xs">Tidak ada event</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetCalendar;
