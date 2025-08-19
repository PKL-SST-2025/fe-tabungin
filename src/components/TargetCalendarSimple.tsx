import { Component, createSignal, For, onMount, createEffect, createMemo } from 'solid-js';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'deadline' | 'target_deadline' | 'reminder' | 'completed';
  is_completed?: boolean;
  target_name?: string;
}

interface Props {
  events: CalendarEvent[];
}

const TargetCalendar: Component<Props> = (props) => {
  const [currentDate, setCurrentDate] = createSignal(new Date());
  const [selectedDate, setSelectedDate] = createSignal<string>('');

  // Simple events signal
  const events = createMemo(() => props.events || []);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    // Add empty cells for previous month days
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDateString = (day: number) => {
    if (!day) return '';
    const date = new Date(currentDate().getFullYear(), currentDate().getMonth(), day);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getEventsForDate = (day: number) => {
    if (!day) return [];
    const targetDate = formatDateString(day);
    const currentEvents = events();
    
    return currentEvents.filter(event => {
      if (!event || !event.date) return false;
      let eventDate = event.date;
      if (eventDate.includes('T')) {
        eventDate = eventDate.split('T')[0];
      }
      return eventDate === targetDate;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate());
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    
    // Notify parent about month change
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
    const dateStr = formatDateString(day);
    setSelectedDate(dateStr);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'completed': return '✅';
      case 'deadline': 
      case 'target_deadline': return '⏰';
      case 'milestone': return '🎯';
      case 'reminder': return '🔔';
      default: return '📌';
    }
  };

  return (
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div class="flex items-center justify-between p-4 bg-slate-800 text-white">
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
            <span class="text-white text-xs">📅</span>
          </div>
          <span class="font-medium">Calendar</span>
        </div>
        
        <div class="flex items-center space-x-4">
          <button
            class="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
            onClick={() => navigateMonth('prev')}
          >
            <span class="text-sm">‹</span>
          </button>
          
          <div class="text-sm font-medium min-w-[100px] text-center">
            {monthNames[currentDate().getMonth()]} {currentDate().getFullYear()}
          </div>
          
          <button
            class="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
            onClick={() => navigateMonth('next')}
          >
            <span class="text-sm">›</span>
          </button>
        </div>
      </div>

      {/* Calendar Body */}
      <div class="p-4">
        {/* Day Headers */}
        <div class="grid grid-cols-7 gap-1 mb-2">
          <For each={dayNames}>
            {(dayName) => (
              <div class="w-10 h-8 flex items-center justify-center">
                <span class="text-xs font-medium text-gray-500">{dayName}</span>
              </div>
            )}
          </For>
        </div>

        {/* Calendar Grid - Clean, no marks */}
        <div class="grid grid-cols-7 gap-1">
          <For each={getDaysInMonth(currentDate())}>
            {(day) => {
              if (day === null) {
                return <div class="w-10 h-10"></div>;
              }

              const dateStr = formatDateString(day);
              const isSelected = selectedDate() === dateStr;
              
              return (
                <div
                  class={`w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isToday(day) 
                      ? 'bg-blue-500 text-white shadow-sm scale-105' 
                      : isSelected
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  <span class={`text-sm font-medium ${
                    isToday(day) ? 'text-white' : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                </div>
              );
            }}
          </For>
        </div>
      </div>

      {/* Event Details */}
      {selectedDate() && (
        <div class="border-t border-gray-200">
          <div class="p-4">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-sm text-gray-500">📅</span>
              <span class="text-sm font-medium text-gray-700">
                {new Date(selectedDate()).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            {getEventsForDate(parseInt(selectedDate().split('-')[2])).length === 0 ? (
              <div class="text-center py-8">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-400">📅</span>
                </div>
                <p class="text-sm text-gray-500">Tidak ada event</p>
              </div>
            ) : (
              <div class="space-y-2">
                <For each={getEventsForDate(parseInt(selectedDate().split('-')[2]))}>
                  {(event) => (
                    <div class={`p-2 rounded-lg border-l-2 text-xs ${
                      event.type === 'completed'
                        ? 'border-l-green-500 bg-green-50'
                        : event.type === 'target_deadline' || event.type === 'deadline' 
                          ? 'border-l-red-500 bg-red-50' 
                          : event.type === 'milestone' 
                            ? 'border-l-amber-500 bg-amber-50' 
                            : 'border-l-blue-500 bg-blue-50'
                    }`}>
                      <div class="flex items-start space-x-2">
                        <div class="text-sm">
                          {getEventIcon(event.type)}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h5 class="font-medium text-xs text-gray-800">
                            {event.title}
                          </h5>
                          {event.description && (
                            <p class="text-xs text-gray-600 mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetCalendar;
