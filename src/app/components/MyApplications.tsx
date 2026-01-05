import { useState } from 'react';
import { Clock, Calendar, Umbrella, Plus, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface MyApplicationsProps {
  user: { name: string; role: string; department: string };
}

export function MyApplications({ user }: MyApplicationsProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'overtime' | 'leave'>('attendance');
  const [showOvertimeDialog, setShowOvertimeDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/20 bg-white/40">
          <TabButton
            active={activeTab === 'attendance'}
            onClick={() => setActiveTab('attendance')}
            icon={Clock}
            label="考勤打卡"
          />
          <TabButton
            active={activeTab === 'overtime'}
            onClick={() => setActiveTab('overtime')}
            icon={Calendar}
            label="加班记录"
          />
          <TabButton
            active={activeTab === 'leave'}
            onClick={() => setActiveTab('leave')}
            icon={Umbrella}
            label="休假记录"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'attendance' && <AttendanceTab />}
          {activeTab === 'overtime' && <OvertimeTab onAdd={() => setShowOvertimeDialog(true)} />}
          {activeTab === 'leave' && <LeaveTab onAdd={() => setShowLeaveDialog(true)} />}
        </div>
      </div>

      {/* Overtime Application Dialog */}
      <OvertimeDialog open={showOvertimeDialog} onClose={() => setShowOvertimeDialog(false)} />
      
      {/* Leave Application Dialog */}
      <LeaveDialog open={showLeaveDialog} onClose={() => setShowLeaveDialog(false)} />
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-all duration-200 ${
        active
          ? 'bg-white/80 text-indigo-600 shadow-lg backdrop-blur-xl border-b-2 border-indigo-600'
          : 'text-gray-600 hover:bg-white/40'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function AttendanceTab() {
  const records = [
    { date: '2026-01-05', clockIn: '08:30', clockOut: '18:00', hours: 8.5, status: 'normal' },
    { date: '2026-01-04', clockIn: '08:25', clockOut: '17:55', hours: 8.5, status: 'normal' },
    { date: '2026-01-03', clockIn: '08:35', clockOut: '18:10', hours: 8.5, status: 'normal' },
    { date: '2026-01-02', clockIn: '--', clockOut: '--', hours: 0, status: 'missing' },
  ];

  return (
    <div className="space-y-3">
      {records.map((record, index) => (
        <div
          key={index}
          className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{record.date.split('-')[2]}</div>
                <div className="text-sm text-gray-600">{record.date.substring(0, 7)}</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="space-y-1">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-sm text-gray-600">上班：</span>
                    <span className="font-semibold text-gray-800">{record.clockIn}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">下班：</span>
                    <span className="font-semibold text-gray-800">{record.clockOut}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  工作时长：<span className="font-semibold text-indigo-600">{record.hours}小时</span>
                </div>
              </div>
            </div>
            <div>
              {record.status === 'normal' ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">正常</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">缺卡</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OvertimeTab({ onAdd }: { onAdd: () => void }) {
  const records = [
    { date: '2026-01-04', hours: 3.5, reason: '项目上线紧急处理', status: 'approved' },
    { date: '2026-01-03', hours: 2.0, reason: '需求变更对应', status: 'pending' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>新建加班申请</span>
        </button>
      </div>
      
      {records.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">暂无加班记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, index) => (
            <div
              key={index}
              className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-gray-800">{record.date}</span>
                    <span className="text-sm text-gray-600">加班 {record.hours} 小时</span>
                  </div>
                  <p className="text-sm text-gray-600">事由：{record.reason}</p>
                </div>
                <StatusBadge status={record.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeaveTab({ onAdd }: { onAdd: () => void }) {
  const records = [
    { 
      type: '年假', 
      startDate: '2026-01-10', 
      endDate: '2026-01-12', 
      days: 3, 
      reason: '家庭事务', 
      status: 'approved',
      approver: '李经理'
    },
    { 
      type: '病假', 
      startDate: '2025-12-28', 
      endDate: '2025-12-28', 
      days: 1, 
      reason: '感冒就医', 
      status: 'approved',
      approver: '李经理'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>新建休假申请</span>
        </button>
      </div>

      <div className="space-y-3">
        {records.map((record, index) => (
          <div
            key={index}
            className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                  {record.type}
                </div>
                <span className="text-sm text-gray-600">{record.days} 天</span>
              </div>
              <StatusBadge status={record.status} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {record.startDate} 至 {record.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600">事由：{record.reason}</p>
              {record.status === 'approved' && (
                <p className="text-sm text-gray-500">审批人：{record.approver}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold">已通过</span>
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-xl">
        <AlertCircle className="w-5 h-5" />
        <span className="font-semibold">待审批</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl">
      <XCircle className="w-5 h-5" />
      <span className="font-semibold">已驳回</span>
    </div>
  );
}

function OvertimeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '21:00',
    reason: ''
  });

  const handleSubmit = () => {
    console.log('Overtime application:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">提交加班申请</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">加班日期</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">开始时间</label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">结束时间</label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">加班事由</label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="请输入加班原因..."
              className="backdrop-blur-lg bg-white/70 border-white/30 min-h-[120px]"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70">
            取消
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            提交申请
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LeaveDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    type: '年假',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const leaveTypes = ['年假', '病假', '事假', '调休', '婚假', '产假', '陪产假'];

  const handleSubmit = () => {
    console.log('Leave application:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">提交休假申请</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div>
            <label className="block text-sm mb-3 text-gray-700">休假类型</label>
            <div className="grid grid-cols-4 gap-3">
              {leaveTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`
                    px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${formData.type === type
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">开始日期</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">结束日期</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">休假事由</label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="请输入休假原因..."
              className="backdrop-blur-lg bg-white/70 border-white/30 min-h-[120px]"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70">
            取消
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            提交申请
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
