import { useState, useEffect } from 'react';
import { Clock, Calendar, Briefcase, Users, FileText, TrendingUp, Quote } from 'lucide-react';

interface DashboardProps {
  user: { name: string; role: string; department: string };
  onNavigate: (view: string) => void;
}

// Mock data for daily quotes
const quotes = [
  { text: '路虽远，行则将至；事虽难，做则必成。', author: '荀子' },
  { text: '不积跬步，无以至千里；不积小流，无以成江海。', author: '荀子' },
  { text: '天行健，君子以自强不息。', author: '周易' },
  { text: '博学之，审问之，慎思之，明辨之，笃行之。', author: '中庸' },
  { text: '合抱之木，生于毫末；九层之台，起于累土。', author: '老子' },
];

// Lunar calendar data (simplified version)
const solarTerms = [
  { date: '01-06', term: '小寒' },
  { date: '01-20', term: '大寒' },
  { date: '02-04', term: '立春' },
];

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [dailyQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  
  // Get solar term
  const monthDay = currentTime.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  const solarTerm = solarTerms.find(st => st.date === monthDay);

  const handleClockIn = () => {
    setClockedIn(true);
    // Here you would make an API call to record the clock in time
  };

  const handleClockOut = () => {
    setClockedOut(true);
    // Here you would make an API call to record the clock out time
  };

  return (
    <div className="space-y-6">
      {/* Daily Quote Banner */}
      <div className="relative backdrop-blur-xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 animate-pulse animation-delay-2000"></div>
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center flex-shrink-0">
            <Quote className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-lg text-white font-medium mb-2 animate-fadeIn">{dailyQuote.text}</p>
            <p className="text-sm text-white/80">—— {dailyQuote.author}</p>
          </div>
        </div>
      </div>

      {/* Clock In/Out Card with Recent Activities */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
          {/* Left: Clock Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-800 mb-2">今日打卡</h2>
              <div className="flex items-baseline gap-2">
                <p className="text-lg text-gray-600">{dateString}</p>
                {solarTerm && (
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full">
                    {solarTerm.term}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {timeString}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleClockIn}
                disabled={clockedIn}
                className={`
                  flex-1 px-8 py-4 rounded-2xl transition-all duration-300 font-medium flex items-center justify-center gap-2
                  ${clockedIn 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105'
                  }
                `}
              >
                <Clock className="w-5 h-5" />
                {clockedIn ? '已上班打卡' : '上班打卡'}
              </button>
              <button 
                onClick={handleClockOut}
                disabled={clockedOut || !clockedIn}
                className={`
                  flex-1 px-8 py-4 rounded-2xl transition-all duration-300 font-medium flex items-center justify-center gap-2
                  ${clockedOut 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : !clockedIn
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-xl hover:scale-105'
                  }
                `}
              >
                <Clock className="w-5 h-5" />
                {clockedOut ? '已下班打卡' : '下班打卡'}
              </button>
            </div>

            {clockedIn && (
              <div className="backdrop-blur-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl p-4 border border-white/30 animate-fadeIn">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">上班打卡时间</span>
                  <span className="font-semibold text-gray-800">08:30:15</span>
                </div>
                {clockedOut && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">下班打卡时间</span>
                    <span className="font-semibold text-gray-800">18:05:42</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Recent Activities */}
          <div className="lg:border-l lg:border-white/30 lg:pl-8">
            <h3 className="text-xl text-gray-800 mb-4">最近动态</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              <ActivityItem
                title="工作记录已保存"
                description="项目A - 需求分析 (2.5小时)"
                time="10分钟前"
              />
              <ActivityItem
                title="加班申请已通过"
                description="2026-01-04 加班申请已审批通过"
                time="1小时前"
              />
              <ActivityItem
                title="打卡记录"
                description="上班打卡成功 08:30"
                time="2小时前"
              />
              <ActivityItem
                title="休假申请已提交"
                description="2026-01-10至2026-01-12 年假申请"
                time="昨天"
              />
              <ActivityItem
                title="项目进度更新"
                description="项目B - 开发阶段完成度 75%"
                time="2天前"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="加班申请"
          description="提交加班申请单"
          icon={Calendar}
          color="from-blue-500 to-cyan-600"
          onClick={() => onNavigate('applications')}
        />
        <QuickActionCard
          title="休假申请"
          description="提交休假申请单"
          icon={FileText}
          color="from-purple-500 to-pink-600"
          onClick={() => onNavigate('applications')}
        />
        <QuickActionCard
          title="工作记录"
          description="记录今日工作内容"
          icon={Briefcase}
          color="from-green-500 to-emerald-600"
          onClick={() => onNavigate('worklog')}
        />
      </div>

      {/* Manager Dashboard */}
      {user.role === 'manager' && (
        <>
          <h3 className="text-xl text-gray-800 mt-8 mb-4">管理者功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="审批中心"
              description="处理待审批事项"
              icon={FileText}
              color="from-orange-500 to-red-600"
              badge="3"
              onClick={() => onNavigate('approval')}
            />
            <QuickActionCard
              title="项目工时总览"
              description="查看团队项目进度"
              icon={TrendingUp}
              color="from-indigo-500 to-purple-600"
              onClick={() => onNavigate('projects')}
            />
            <QuickActionCard
              title="数据报表"
              description="导出统计数据"
              icon={Users}
              color="from-teal-500 to-cyan-600"
              onClick={() => onNavigate('reports')}
            />
          </div>
        </>
      )}
    </div>
  );
}

function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  badge,
  onClick 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  color: string; 
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-200 hover:scale-105 text-left relative group"
    >
      {badge && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
          {badge}
        </div>
      )}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

function ActivityItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors duration-200">
      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-sm text-gray-600 truncate">{description}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
}
