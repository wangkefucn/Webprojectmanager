import { useState } from 'react';
import { Lock, User, LogIn, Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin(formData.username, formData.password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden flex items-center justify-center">
      {/* Glassmorphism background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="backdrop-blur-2xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl mx-auto mb-4">
              <LogIn className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">企业工时管理系统</h1>
            <p className="text-gray-600">请登录您的账号</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">用户名</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="请输入用户名"
                  className="pl-12 backdrop-blur-lg bg-white/70 border-white/30 h-12"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">密码</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码"
                  className="pl-12 pr-12 backdrop-blur-lg bg-white/70 border-white/30 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-start text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">记住我</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full h-12 rounded-xl font-medium text-white transition-all duration-200
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-[1.02]'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-white/30">
            <p className="text-xs text-gray-600 text-center mb-3">演示账号</p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => setFormData({ username: 'admin', password: 'admin123' })}
                className="p-2 backdrop-blur-lg bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
              >
                <p className="font-semibold text-gray-700">管理员</p>
                <p className="text-gray-500">admin / admin123</p>
              </button>
              <button
                onClick={() => setFormData({ username: 'leader', password: 'leader123' })}
                className="p-2 backdrop-blur-lg bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
              >
                <p className="font-semibold text-gray-700">Leader</p>
                <p className="text-gray-500">leader / leader123</p>
              </button>
              <button
                onClick={() => setFormData({ username: 'employee', password: 'employee123' })}
                className="p-2 backdrop-blur-lg bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
              >
                <p className="font-semibold text-gray-700">员工</p>
                <p className="text-gray-500">employee / employee123</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 企业工时管理系统. All rights reserved.
        </p>
      </div>
    </div>
  );
}