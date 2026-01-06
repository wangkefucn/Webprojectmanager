import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from './ui/input';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange }: DateRangePickerProps) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Helper function to format date to local YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Calculate salary period dates (21st of last month to 20th of current month)
  const getCurrentSalaryPeriod = () => {
    const now = new Date();
    const currentDay = now.getDate();
    
    let start: Date, end: Date;
    
    if (currentDay >= 21) {
      // Current period: 21st of this month to 20th of next month
      start = new Date(now.getFullYear(), now.getMonth(), 21);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 20);
    } else {
      // Current period: 21st of last month to 20th of this month
      start = new Date(now.getFullYear(), now.getMonth() - 1, 21);
      end = new Date(now.getFullYear(), now.getMonth(), 20);
    }
    
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  const getLastSalaryPeriod = () => {
    const now = new Date();
    const currentDay = now.getDate();
    
    let start: Date, end: Date;
    
    if (currentDay >= 21) {
      // Last period: 21st of last month to 20th of this month
      start = new Date(now.getFullYear(), now.getMonth() - 1, 21);
      end = new Date(now.getFullYear(), now.getMonth(), 20);
    } else {
      // Last period: 21st of two months ago to 20th of last month
      start = new Date(now.getFullYear(), now.getMonth() - 2, 21);
      end = new Date(now.getFullYear(), now.getMonth() - 1, 20);
    }
    
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  const getCurrentMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  const getLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return {
      start: formatDate(monday),
      end: formatDate(sunday)
    };
  };

  const getLastWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const lastMondayOffset = dayOfWeek === 0 ? -13 : -6 - dayOfWeek;
    
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() + lastMondayOffset);
    
    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);
    
    return {
      start: formatDate(lastMonday),
      end: formatDate(lastSunday)
    };
  };

  const quickSelections = [
    { label: '今日', action: () => ({ start: todayStr, end: todayStr }) },
    { label: '本周', action: getCurrentWeek },
    { label: '上周', action: getLastWeek },
    { label: '本月', action: getCurrentMonth },
    { label: '上月', action: getLastMonth },
    { label: '本薪资周期', action: getCurrentSalaryPeriod },
    { label: '上薪资周期', action: getLastSalaryPeriod },
  ];

  const handleQuickSelect = (action: () => { start: string; end: string }) => {
    const { start, end } = action();
    onStartDateChange(start);
    onEndDateChange(end);
  };

  // Check if current selection matches a quick selection
  const isSelected = (action: () => { start: string; end: string }) => {
    const { start, end } = action();
    return startDate === start && endDate === end;
  };

  return (
    <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-gray-800">筛选期间</h4>
        </div>
        
        {/* Quick Selection Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickSelections.map((item) => {
            const selected = isSelected(item.action);
            return (
              <button
                key={item.label}
                onClick={() => handleQuickSelect(item.action)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  selected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-600 shadow-lg'
                    : 'backdrop-blur-lg bg-white/70 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white border-white/30 text-gray-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/30">
          <div>
            <label className="block text-sm mb-2 text-gray-700">开始日期</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="backdrop-blur-lg bg-white/70 border-white/30"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-700">结束日期</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="backdrop-blur-lg bg-white/70 border-white/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}