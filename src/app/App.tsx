import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { MyApplications } from './components/MyApplications';
import { ProjectManagement } from './components/ProjectManagement';
import { DailyWorkLog } from './components/DailyWorkLog';
import { ApprovalCenter } from './components/ApprovalCenter';
import { DataReports } from './components/DataReports';
import { Home, FileText, FolderKanban, Calendar, CheckSquare, BarChart3 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'applications' | 'projects' | 'worklog' | 'approval' | 'reports'>('dashboard');
  const [user] = useState({
    name: '张三',
    role: 'manager', // 'manager' or 'employee'
    department: '研发一部'
  });

  const navigation = [
    { id: 'dashboard', name: '工作台', icon: Home },
    { id: 'applications', name: '我的申请', icon: FileText },
    { id: 'worklog', name: '工作记录', icon: Calendar },
    { id: 'projects', name: '项目管理', icon: FolderKanban },
    ...(user.role === 'manager' ? [
      { id: 'approval', name: '审批中心', icon: CheckSquare },
      { id: 'reports', name: '数据报表', icon: BarChart3 }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Glassmorphism background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="relative min-h-screen">
        {/* Top Navigation Bar */}
        <header className="backdrop-blur-lg bg-white/40 border-b border-white/20 shadow-lg sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">企业工时管理系统</h1>
                  <p className="text-sm text-gray-600">{user.department} - {user.name}</p>
                </div>
              </div>
              
              <nav className="flex gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as any)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-white/80 text-indigo-600 shadow-lg backdrop-blur-xl' 
                          : 'text-gray-700 hover:bg-white/50 backdrop-blur-sm'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-6 py-8">
          {currentView === 'dashboard' && <Dashboard user={user} onNavigate={setCurrentView} />}
          {currentView === 'applications' && <MyApplications user={user} />}
          {currentView === 'projects' && <ProjectManagement user={user} />}
          {currentView === 'worklog' && <DailyWorkLog user={user} />}
          {currentView === 'approval' && user.role === 'manager' && <ApprovalCenter user={user} />}
          {currentView === 'reports' && user.role === 'manager' && <DataReports user={user} />}
        </main>
      </div>
    </div>
  );
}
