import { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    name: string;
    gender: string;
    employeeId: string;
    birthDate: string;
    hometown: string;
    phone: string;
    email: string;
    hobbies: string;
    role: string;
    department: string;
  };
}

export function UserProfile({ open, onOpenChange, user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  
  // Profile info state (editable fields)
  const [profileData, setProfileData] = useState({
    birthDate: user.birthDate,
    hometown: user.hometown,
    phone: user.phone,
    email: user.email,
    hobbies: user.hobbies
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const handleSaveProfile = () => {
    console.log('保存个人信息:', profileData);
    // Here you would typically make an API call to save the profile
    onOpenChange(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('两次输入的新密码不一致！');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('密码长度不能少于6位！');
      return;
    }
    console.log('修改密码');
    setShowPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordSuccess(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl">个人中心</p>
              <p className="text-sm font-normal text-gray-600">{user.name} - {user.employeeId}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-white/40 p-2 rounded-xl">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'info'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">基本信息</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'password'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="font-medium">修改密码</span>
          </button>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6 py-4">
            {/* Read-only fields */}
            <div className="backdrop-blur-lg bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                基本信息（不可修改）
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-600">姓名</label>
                  <div className="px-4 py-3 rounded-xl bg-white/70 text-gray-800 font-medium border border-gray-200">
                    {user.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-600">性别</label>
                  <div className="px-4 py-3 rounded-xl bg-white/70 text-gray-800 font-medium border border-gray-200">
                    {user.gender}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-600">工号</label>
                  <div className="px-4 py-3 rounded-xl bg-white/70 text-gray-800 font-medium border border-gray-200">
                    {user.employeeId}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-600">权限</label>
                  <div className="px-4 py-3 rounded-xl bg-white/70 border border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
                      user.role === 'leader' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' :
                      'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                    }`}>
                      {user.role === 'admin' ? '系统管理员' : user.role === 'leader' ? 'Leader' : '普通用户'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-600">部门</label>
                  <div className="px-4 py-3 rounded-xl bg-white/70 text-gray-800 font-medium border border-gray-200">
                    {user.department}
                  </div>
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="backdrop-blur-lg bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
                个人信息（可修改）
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">出生年月</label>
                  <Input
                    type="month"
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/90 border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    籍贯
                  </label>
                  <Input
                    value={profileData.hometown}
                    onChange={(e) => setProfileData({ ...profileData, hometown: e.target.value })}
                    placeholder="请输入籍贯"
                    className="backdrop-blur-lg bg-white/90 border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    手机号码
                  </label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="13800138000"
                    className="backdrop-blur-lg bg-white/90 border-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    邮箱
                  </label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="backdrop-blur-lg bg-white/90 border-white/50"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-2 text-gray-700 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    个人爱好
                  </label>
                  <Textarea
                    value={profileData.hobbies}
                    onChange={(e) => setProfileData({ ...profileData, hobbies: e.target.value })}
                    placeholder="请输入个人爱好"
                    rows={3}
                    className="backdrop-blur-lg bg-white/90 border-white/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl"
              >
                保存修改
              </Button>
            </div>
          </div>
        )}

        {/* Password Change Tab */}
        {activeTab === 'password' && (
          <div className="space-y-6 py-4">
            {showPasswordSuccess ? (
              <div className="backdrop-blur-lg bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">密码修改成功！</h3>
                <p className="text-sm text-green-700">请使用新密码重新登录</p>
              </div>
            ) : (
              <>
                <div className="backdrop-blur-lg bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">密码安全提示</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>密码长度至少6位</li>
                        <li>建议包含字母、数字和特殊字符</li>
                        <li>不要使用过于简单的密码（如：123456）</li>
                        <li>定期更换密码以保证账户安全</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700 font-medium">当前密码</label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="请输入当前密码"
                      className="backdrop-blur-lg bg-white/90 border-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700 font-medium">新密码</label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="请输入新密码（至少6位）"
                      className="backdrop-blur-lg bg-white/90 border-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700 font-medium">确认新密码</label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="请再次输入新密码"
                      className="backdrop-blur-lg bg-white/90 border-white/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    取消
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-xl"
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    修改密码
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
