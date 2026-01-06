import { useState } from 'react';
import { Clock, Calendar, Umbrella, Plus, CheckCircle, XCircle, AlertCircle, Edit, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { DateRangePicker } from './DateRangePicker';

interface MyApplicationsProps {
  user: { name: string; role: string; department: string };
}

export function MyApplications({ user }: MyApplicationsProps) {
  const [activeTab, setActiveTab] = useState<'overtime' | 'leave' | 'attendance'>('overtime');
  const [showOvertimeDialog, setShowOvertimeDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Helper function to format date to local YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Date range filter state - default to current salary period (21st to 20th)
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

  const salaryPeriod = getCurrentSalaryPeriod();
  const [startDate, setStartDate] = useState(salaryPeriod.start);
  const [endDate, setEndDate] = useState(salaryPeriod.end);

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/20 bg-white/40">
          <TabButton
            active={activeTab === 'overtime'}
            onClick={() => setActiveTab('overtime')}
            icon={Clock}
            label="加班记录"
          />
          <TabButton
            active={activeTab === 'leave'}
            onClick={() => setActiveTab('leave')}
            icon={Umbrella}
            label="休假记录"
          />
          <TabButton
            active={activeTab === 'attendance'}
            onClick={() => setActiveTab('attendance')}
            icon={Calendar}
            label="考勤打卡"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overtime' && <OvertimeTab onAdd={() => { setEditingItem(null); setShowOvertimeDialog(true); }} onEdit={(item) => { setEditingItem(item); setShowOvertimeDialog(true); }} />}
          {activeTab === 'leave' && <LeaveTab onAdd={() => { setEditingItem(null); setShowLeaveDialog(true); }} onEdit={(item) => { setEditingItem(item); setShowLeaveDialog(true); }} />}
          {activeTab === 'attendance' && <AttendanceTab />}
        </div>
      </div>

      {/* Overtime Application Dialog */}
      <OvertimeDialog 
        open={showOvertimeDialog} 
        onClose={() => { setShowOvertimeDialog(false); setEditingItem(null); }}
        editingItem={editingItem}
      />
      
      {/* Leave Application Dialog */}
      <LeaveDialog 
        open={showLeaveDialog} 
        onClose={() => { setShowLeaveDialog(false); setEditingItem(null); }}
        editingItem={editingItem}
      />
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
  const [records, setRecords] = useState([
    { id: 1, date: '2026-01-06', clockIn: '08:30', clockOut: '18:00', hours: 8.5, status: 'normal' },
    { id: 2, date: '2026-01-05', clockIn: '08:30', clockOut: '18:00', hours: 8.5, status: 'normal' },
    { id: 3, date: '2026-01-04', clockIn: '08:25', clockOut: '17:55', hours: 8.5, status: 'normal' },
    { id: 4, date: '2026-01-03', clockIn: '08:35', clockOut: '18:10', hours: 8.5, status: 'normal' },
    { id: 5, date: '2026-01-02', clockIn: '--', clockOut: '--', hours: 0, status: 'missing' },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ clockIn: '', clockOut: '' });

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setEditData({ clockIn: record.clockIn, clockOut: record.clockOut });
  };

  const handleSave = (id: number) => {
    setRecords(records.map(r => 
      r.id === id 
        ? { ...r, clockIn: editData.clockIn, clockOut: editData.clockOut, status: 'normal', hours: 8.5 }
        : r
    ));
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-center min-w-[80px]">
                <div className="text-2xl font-bold text-gray-800">{record.date.split('-')[2]}</div>
                <div className="text-sm text-gray-600">{record.date.substring(0, 7)}</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              
              {editingId === record.id ? (
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">上班：</span>
                    <Input
                      type="time"
                      value={editData.clockIn}
                      onChange={(e) => setEditData({ ...editData, clockIn: e.target.value })}
                      className="w-32 backdrop-blur-lg bg-white/70 border-white/30"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">下班：</span>
                    <Input
                      type="time"
                      value={editData.clockOut}
                      onChange={(e) => setEditData({ ...editData, clockOut: e.target.value })}
                      className="w-32 backdrop-blur-lg bg-white/70 border-white/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(record.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:shadow-lg transition-all"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
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
                  <div className="flex items-center gap-3">
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
                    <button
                      onClick={() => handleEdit(record)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      title="修改打卡时间"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OvertimeTab({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: any) => void }) {
  const records = [
    { id: 1, date: '2026-01-04', hours: 3.5, reason: '项目上线紧急处理', status: 'approved', approver: '李经理', projectGroup: '项目组A', overtimeType: '通常' },
    { id: 2, date: '2026-01-03', hours: 2.0, reason: '需求变更对应', status: 'pending', projectGroup: '项目组B', overtimeType: '通常' },
    { id: 3, date: '2026-01-02', hours: 4.0, reason: '测试环境问题排查', status: 'rejected', rejectReason: '加班时长过长，请分批申请', projectGroup: '项目组A', overtimeType: '休日' },
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
          {records.map((record) => (
            <div
              key={record.id}
              className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-gray-800">{record.date}</span>
                    <span className={`text-xs px-3 py-1 rounded-lg ${
                      record.overtimeType === '休日' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {record.overtimeType}加班
                    </span>
                    <span className="text-sm text-gray-600">加班 {record.hours} 小时</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{record.projectGroup}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">事由：{record.reason}</p>
                  {record.status === 'approved' && (
                    <p className="text-sm text-gray-500">审批人：{record.approver}</p>
                  )}
                  {record.status === 'rejected' && (
                    <p className="text-sm text-red-600">驳回理由：{record.rejectReason}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={record.status} />
                  {record.status === 'pending' && (
                    <button
                      onClick={() => onEdit(record)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      title="修改申请"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeaveTab({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: any) => void }) {
  const records = [
    { 
      id: 1,
      type: '年假', 
      startDate: '2026-01-10', 
      endDate: '2026-01-12', 
      days: 3, 
      hours: 24,
      reason: '家庭事务', 
      status: 'approved',
      approver: '李经理',
      projectGroup: '项目组A'
    },
    { 
      id: 2,
      type: '病假', 
      startDate: '2025-12-28', 
      endDate: '2025-12-28', 
      startTime: '08:30',
      endTime: '12:30',
      days: 0, 
      hours: 4,
      reason: '感冒就医', 
      status: 'pending',
      projectGroup: '项目组B'
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
        {records.map((record) => (
          <div
            key={record.id}
            className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                  {record.type}
                </div>
                <span className="text-sm text-gray-600">{record.hours} 小时</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{record.projectGroup}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={record.status} />
                {record.status === 'pending' && (
                  <button
                    onClick={() => onEdit(record)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    title="修改申请"
                  >
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {record.startDate} {record.startTime && `${record.startTime}`} 至 {record.endDate} {record.endTime && `${record.endTime}`}
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

function OvertimeDialog({ open, onClose, editingItem }: { open: boolean; onClose: () => void; editingItem?: any }) {
  const [formData, setFormData] = useState({
    projectGroup: editingItem?.projectGroup || '',
    overtimeType: editingItem?.overtimeType || '通常',
    startDate: editingItem?.startDate || new Date().toISOString().split('T')[0],
    startTime: editingItem?.startTime || '18:00',
    endDate: editingItem?.endDate || new Date().toISOString().split('T')[0],
    endTime: editingItem?.endTime || '21:00',
    reason: editingItem?.reason || ''
  });

  const projectGroups = ['项目组A', '项目组B', '项目组C', 'Enhance'];

  // 计算加班时长（小时）
  const calculateHours = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) return 0;
    
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // 最低1小时起步，半小时累计
    if (diffHours < 1) return 0;
    return Math.floor(diffHours * 2) / 2; // 四舍五入到0.5
  };

  const hours = calculateHours();

  const handleSubmit = () => {
    if (hours < 1) {
      alert('加班时长最低1小时起步！');
      return;
    }
    console.log('Overtime application:', { ...formData, hours });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{editingItem ? '修改加班申请' : '提交加班申请'}</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">填写加班信息，最低1小时起步，半小时累计</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {/* 所属项目组 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3 border border-teal-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">所属项目组</label>
            <div className="grid grid-cols-4 gap-3">
              {projectGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setFormData({ ...formData, projectGroup: group })}
                  className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                    formData.projectGroup === group
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* 加班类型 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-3 border border-purple-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">加班类型</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({ ...formData, overtimeType: '通常' })}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  formData.overtimeType === '通常'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                平日加班
              </button>
              <button
                onClick={() => setFormData({ ...formData, overtimeType: '休日' })}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  formData.overtimeType === '休日'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                休日加班
              </button>
            </div>
          </div>

          {/* 加班时间 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">加班时间</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">开始时间</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">结束时间</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>
            </div>
            {hours > 0 && (
              <div className="mt-3 p-3 bg-gradient-to-r from-indigo-100/70 to-purple-100/70 rounded-lg border border-indigo-200/50">
                <span className="text-xs text-gray-700 font-semibold">预计加班时长：</span>
                <span className="text-xl font-bold text-indigo-600 ml-2">{hours}小时</span>
              </div>
            )}
          </div>

          {/* 加班原因 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-gray-50/80 to-slate-50/80 rounded-xl p-3 border border-gray-100/50 shadow-inner">
            <label className="block text-xs mb-1.5 text-gray-700 font-bold">加班原因</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="请输入加班原因..."
              rows={2}
              className="w-full px-3 py-2 backdrop-blur-lg bg-white/80 border border-white/50 rounded-lg text-gray-800 resize-none font-medium text-sm"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70 px-4 py-2">
            取消
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2">
            <Save className="w-4 h-4 mr-2" />
            {editingItem ? '保存修改' : '提交申请'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LeaveDialog({ open, onClose, editingItem }: { open: boolean; onClose: () => void; editingItem?: any }) {
  const [formData, setFormData] = useState({
    projectGroup: editingItem?.projectGroup || '',
    type: editingItem?.type || '事假',
    startDate: editingItem?.startDate || new Date().toISOString().split('T')[0],
    startTime: editingItem?.startTime || '08:30',
    endDate: editingItem?.endDate || new Date().toISOString().split('T')[0],
    endTime: editingItem?.endTime || '17:30',
    reason: editingItem?.reason || ''
  });

  const projectGroups = ['项目组A', '项目组B', '项目组C', 'Enhance'];
  const leaveTypes = ['事假', '年假', '病假', '调休', '婚假', '产假', '陪产假'];

  // 计算请假时长
  const calculateHours = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) return 0;
    
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    
    // 如果是同一天
    if (formData.startDate === formData.endDate) {
      const diffMs = end.getTime() - start.getTime();
      return diffMs / (1000 * 60 * 60);
    }
    
    // 跨天计算 - 每天算8小时
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return (daysDiff + 1) * 8;
  };

  const hours = calculateHours();

  // 快捷输入
  const quickSelect = (type: string) => {
    const today = new Date().toISOString().split('T')[0];
    switch (type) {
      case 'morning':
        setFormData({ ...formData, startDate: today, startTime: '08:30', endDate: today, endTime: '12:30' });
        break;
      case 'afternoon':
        setFormData({ ...formData, startDate: today, startTime: '13:30', endDate: today, endTime: '17:30' });
        break;
      case 'fullday':
        setFormData({ ...formData, startDate: today, startTime: '08:30', endDate: today, endTime: '17:30' });
        break;
    }
  };

  const handleSubmit = () => {
    if (hours < 1) {
      alert('请假时长最低1小时起步！');
      return;
    }
    console.log('Leave application:', { ...formData, hours });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{editingItem ? '修改休假申请' : '提交休假申请'}</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">填写休假信息，可按小时请假，连续多天每天换算8小时</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {/* 所属项目组 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3 border border-teal-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">所属项目组</label>
            <div className="grid grid-cols-4 gap-3">
              {projectGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setFormData({ ...formData, projectGroup: group })}
                  className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                    formData.projectGroup === group
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* 休假类型 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-3 border border-purple-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">休假类型</label>
            <div className="grid grid-cols-7 gap-2">
              {leaveTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    formData.type === type
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 快捷选择 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50/80 to-amber-50/80 rounded-xl p-3 border border-orange-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">快捷选择</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => quickSelect('morning')}
                className="px-4 py-2.5 rounded-lg backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white border border-white/50 transition-all duration-200 font-medium"
              >
                <div className="font-bold">上午休 (4h)</div>
                <div className="text-xs opacity-75">08:30-12:30</div>
              </button>
              <button
                onClick={() => quickSelect('afternoon')}
                className="px-4 py-2.5 rounded-lg backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white border border-white/50 transition-all duration-200 font-medium"
              >
                <div className="font-bold">下午休 (4h)</div>
                <div className="text-xs opacity-75">13:30-17:30</div>
              </button>
              <button
                onClick={() => quickSelect('fullday')}
                className="px-4 py-2.5 rounded-lg backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white border border-white/50 transition-all duration-200 font-medium"
              >
                <div className="font-bold">休一天 (8h)</div>
                <div className="text-xs opacity-75">08:30-17:30</div>
              </button>
            </div>
          </div>

          {/* 休假时间 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">休假时间</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">开始时间</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">结束时间</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>
            </div>
            
            {/* 自动计算时长 */}
            {hours > 0 && (
              <div className="mt-3 p-3 bg-gradient-to-r from-indigo-100/70 to-purple-100/70 rounded-lg border border-indigo-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-semibold">休假时长：</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-indigo-600">{hours.toFixed(1)} 小时</span>
                    {formData.startDate !== formData.endDate && (
                      <span className="text-xs text-blue-600">（连续多天，每天换算8小时）</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 休假事由 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-gray-50/80 to-slate-50/80 rounded-xl p-3 border border-gray-100/50 shadow-inner">
            <label className="block text-xs mb-1.5 text-gray-700 font-bold">休假事由</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="请输入休假原因..."
              rows={2}
              className="w-full px-3 py-2 backdrop-blur-lg bg-white/80 border border-white/50 rounded-lg text-gray-800 resize-none font-medium text-sm"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70 px-4 py-2">
            取消
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2">
            <Save className="w-4 h-4 mr-2" />
            {editingItem ? '保存修改' : '提交申请'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}