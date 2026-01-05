import { Clock, Calendar, Briefcase, Users, FileText, TrendingUp } from 'lucide-react';

interface DashboardProps {
  user: { name: string; role: string; department: string };
  onNavigate: (view: string) => void;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <div className="space-y-6">
      {/* Clock In/Out Card */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl text-gray-800 mb-2">今日打卡</h2>
            <p className="text-gray-600 mb-6">{currentDate}</p>
            <div className="text-5xl font-bold text-indigo-600 mb-8">{currentTime}</div>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Clock className="w-5 h-5 inline mr-2" />
                上班打卡
              </button>
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Clock className="w-5 h-5 inline mr-2" />
                下班打卡
              </button>
            </div>
          </div>
          <div className="backdrop-blur-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl p-6 border border-white/30">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">今日已工作</p>
              <p className="text-3xl font-bold text-indigo-600">8.5 <span className="text-lg">小时</span></p>
            </div>
            <div className="border-t border-white/30 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">上班时间</span>
                <span className="font-semibold">08:30</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">午休时间</span>
                <span className="font-semibold">12:00-13:00</span>
              </div>
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

      {/* Recent Activities */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <h3 className="text-xl text-gray-800 mb-4">最近动态</h3>
        <div className="space-y-3">
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
        </div>
      </div>
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
      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
}
