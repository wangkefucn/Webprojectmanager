import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { MyApplications } from "./components/MyApplications";
import { ProjectManagement } from "./components/ProjectManagement";
import { DailyWorkLog } from "./components/DailyWorkLog";
import { ApprovalCenter } from "./components/ApprovalCenter";
import { DataReports } from "./components/DataReports";
import { SystemManagement } from "./components/SystemManagement";
import { UserProfile } from "./components/UserProfile";
import { Login } from "./components/Login";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Home, FileText, FolderKanban, Calendar, CheckSquare, BarChart3, LogOut, Settings, User, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'applications' | 'projects' | 'worklog' | 'approval' | 'reports' | 'system'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [user, setUser] = useState({
    name: '张三',
    role: 'employee', // 'admin', 'leader', or 'employee'
    department: '研发一部',
    gender: '男',
    employeeId: 'EMP002',
    birthDate: '1992-03',
    hometown: '上海',
    phone: '13900139000',
    email: 'zhang@company.com',
    hobbies: '篮球、旅游'
  });

  const handleLogin = (username: string, password: string) => {
    // Check if using default password
    const isDefaultPassword = password === '123456';
    
    // Simple demo login logic
    if (username === 'admin' && password === 'admin123') {
      setUser({ 
        name: '宋永赛', 
        role: 'admin', 
        department: 'APF',
        gender: '男',
        employeeId: 'EMP001',
        birthDate: '1990-05',
        hometown: '北京',
        phone: '13800138000',
        email: 'song@company.com',
        hobbies: '编程、阅读'
      });
      setIsLoggedIn(true);
    } else if (username === 'leader' && password === 'leader123') {
      setUser({ 
        name: '李经理', 
        role: 'leader', 
        department: 'WPF',
        gender: '男',
        employeeId: 'EMP005',
        birthDate: '1988-09',
        hometown: '广州',
        phone: '13700137000',
        email: 'li@company.com',
        hobbies: '阅读、运动'
      });
      setIsLoggedIn(true);
    } else if (username === 'employee' && password === 'employee123') {
      setUser({ 
        name: '张三', 
        role: 'employee', 
        department: '研发一部',
        gender: '男',
        employeeId: 'EMP002',
        birthDate: '1992-03',
        hometown: '上海',
        phone: '13900139000',
        email: 'zhang@company.com',
        hobbies: '篮球、旅游'
      });
      setIsLoggedIn(true);
    } else if (password === '123456') {
      // Allow login with default password but require password change
      setUser({ 
        name: username, 
        role: 'employee', 
        department: '研发部',
        gender: '男',
        employeeId: 'EMP999',
        birthDate: '1990-01',
        hometown: '未填写',
        phone: '未填写',
        email: `${username}@company.com`,
        hobbies: '未填写'
      });
      setIsLoggedIn(true);
      setRequirePasswordChange(true);
      setPasswordForm({ ...passwordForm, oldPassword: '123456' });
    } else {
      alert('用户名或密码错误');
    }
  };

  const handlePasswordChange = () => {
    // Validate password
    if (passwordForm.newPassword.length < 6) {
      alert('新密码长度至少为6位');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    
    if (passwordForm.newPassword === '123456') {
      alert('新密码不能与初始密码相同，请设置一个更安全的密码');
      return;
    }
    
    // Success - close dialog
    setRequirePasswordChange(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    alert('密码修改成功！');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const navigation = [
    { id: "dashboard", name: "工作台", icon: Home },
    { id: "applications", name: "我的申请", icon: FileText },
    { id: "worklog", name: "工作记录", icon: Calendar },
    ...(user.role === "admin" || user.role === "leader"
      ? [
          { id: "projects", name: "项目管理", icon: FolderKanban },
        ]
      : []),
    ...(user.role === "admin" || user.role === "leader"
      ? [
          {
            id: "approval",
            name: "审批中心",
            icon: CheckSquare,
          },
        ]
      : []),
    ...(user.role === "admin"
      ? [
          { id: "reports", name: "数据报表", icon: BarChart3 },
          { id: "system", name: "系统管理", icon: Settings },
        ]
      : user.role === "leader"
      ? [
          { id: "reports", name: "数据报表", icon: BarChart3 },
          { id: "system", name: "人员管理", icon: Settings },
        ]
      : []),
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
                  <h1 className="text-xl font-semibold text-gray-800">
                    企业工时管理系统
                  </h1>
                  <button
                    onClick={() => setShowUserProfile(true)}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{user.department} - {user.name}</span>
                  </button>
                </div>
              </div>

              <nav className="flex gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setCurrentView(item.id as any)
                      }
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? "bg-white/80 text-indigo-600 shadow-lg backdrop-blur-xl"
                            : "text-gray-700 hover:bg-white/50 backdrop-blur-sm"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-gray-700 hover:bg-white/50 backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>登出</span>
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-6 py-8">
          {currentView === "dashboard" && (
            <Dashboard
              user={user}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === "applications" && (
            <MyApplications user={user} />
          )}
          {currentView === "projects" && (
            <ProjectManagement user={user} />
          )}
          {currentView === "worklog" && (
            <DailyWorkLog user={user} />
          )}
          {currentView === "approval" &&
            (user.role === "admin" || user.role === "leader") && (
              <ApprovalCenter user={user} />
            )}
          {currentView === "reports" &&
            (user.role === "admin" || user.role === "leader") && (
              <DataReports user={user} />
            )}
          {currentView === "system" &&
            (user.role === "admin" || user.role === "leader") && (
              <SystemManagement user={user} />
            )}
        </main>
      </div>

      {/* User Profile Dialog */}
      <UserProfile
        open={showUserProfile}
        onOpenChange={setShowUserProfile}
        user={user}
      />

      {/* Password Change Dialog */}
      <Dialog open={requirePasswordChange} onOpenChange={() => {}}>
        <DialogContent className="backdrop-blur-xl bg-white/95 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              强制修改密码
            </DialogTitle>
            <DialogDescription>
              检测到您正在使用初始密码，为了账户安全，请立即修改密码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Warning Banner */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-800 mb-1">安全提示</p>
                  <ul className="text-xs text-orange-700 space-y-1">
                    <li>• 新密码长度至少为6位</li>
                    <li>• 不能使用初始密码123456</li>
                    <li>• 建议使用字母、数字和符号组合</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Old Password - Read Only */}
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-semibold">当前密码（初始密码）</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value="123456"
                  disabled
                  className="pl-10 backdrop-blur-lg bg-gray-100 border-gray-200"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-semibold">新密码 *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="请输入新密码"
                  className="pl-10 pr-10 backdrop-blur-lg bg-white/80 border-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-semibold">确认新密码 *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="请再次输入新密码"
                  className="pl-10 pr-10 backdrop-blur-lg bg-white/80 border-white/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <Button
              onClick={handlePasswordChange}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl"
            >
              确认修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}