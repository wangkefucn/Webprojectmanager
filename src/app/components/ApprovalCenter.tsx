import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, FileText, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { DateRangePicker } from './DateRangePicker';

interface ApprovalCenterProps {
  user: { name: string; role: string; department: string };
}

export function ApprovalCenter({ user }: ApprovalCenterProps) {
  const [activeTab, setActiveTab] = useState<'overtime' | 'leave'>('overtime');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
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

  const overtimeApplications = [
    {
      id: 1,
      name: '宋永赛',
      department: '研发一部',
      date: '2026-01-04',
      hours: 8.5,
      startTime: '18:00',
      endTime: '22:30',
      reason: '变更对应，障害分析',
      status: 'pending',
      submitTime: '2026-01-04 17:45',
      approver: '李经理'
    },
    {
      id: 2,
      name: '张三',
      department: '研发一部',
      date: '2026-01-03',
      hours: 3.0,
      startTime: '18:00',
      endTime: '21:00',
      reason: '项目上线准备工作',
      status: 'pending',
      submitTime: '2026-01-03 17:30',
      approver: '李经理'
    }
  ];

  const leaveApplications = [
    {
      id: 1,
      name: '阮佩诗',
      department: '研发二部',
      type: '年假',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      days: 3,
      reason: '家庭事务',
      status: 'pending',
      submitTime: '2026-01-04 14:20',
      approver: '李经理'
    }
  ];

  // Calculate statistics for the selected date range
  const stats = {
    pending: activeTab === 'overtime' 
      ? overtimeApplications.filter(a => a.status === 'pending').length 
      : leaveApplications.filter(a => a.status === 'pending').length,
    approved: 3, // Mock data
    rejected: 1, // Mock data
  };

  const handleApprove = (item: any) => {
    console.log('Approve:', item);
    // Handle approval logic
  };

  const handleReject = () => {
    console.log('Reject with reason');
    setShowRejectDialog(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Header with Statistics */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">审批中心</h2>
            <p className="text-sm text-gray-600">处理团队成员的申请事项</p>
          </div>
          
          {/* Statistics Cards */}
          <div className="flex gap-4">
            <div className="backdrop-blur-lg bg-orange-100/60 rounded-2xl px-5 py-3 border border-orange-200/30 text-center min-w-[100px]">
              <p className="text-xs text-orange-600 mb-1">待审批</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="backdrop-blur-lg bg-green-100/60 rounded-2xl px-5 py-3 border border-green-200/30 text-center min-w-[100px]">
              <p className="text-xs text-green-600 mb-1">已通过</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="backdrop-blur-lg bg-red-100/60 rounded-2xl px-5 py-3 border border-red-200/30 text-center min-w-[100px]">
              <p className="text-xs text-red-600 mb-1">已驳回</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/40 p-2 rounded-xl">
          <button
            onClick={() => setActiveTab('overtime')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'overtime'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-semibold">加班审批</span>
            {overtimeApplications.filter(a => a.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {overtimeApplications.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'leave'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">休假审批</span>
            {leaveApplications.filter(a => a.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {leaveApplications.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'overtime' && (
          <>
            {overtimeApplications.length === 0 ? (
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-12 shadow-2xl border border-white/20 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">暂无待审批的加班申请</p>
              </div>
            ) : (
              overtimeApplications.map((item) => (
                <OvertimeApprovalCard
                  key={item.id}
                  item={item}
                  onApprove={() => handleApprove(item)}
                  onReject={() => {
                    setSelectedItem(item);
                    setShowRejectDialog(true);
                  }}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'leave' && (
          <>
            {leaveApplications.length === 0 ? (
              <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-12 shadow-2xl border border-white/20 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">暂无待审批的休假申请</p>
              </div>
            ) : (
              leaveApplications.map((item) => (
                <LeaveApprovalCard
                  key={item.id}
                  item={item}
                  onApprove={() => handleApprove(item)}
                  onReject={() => {
                    setSelectedItem(item);
                    setShowRejectDialog(true);
                  }}
                />
              ))
            )}
          </>
        )}
      </div>

      {/* Reject Dialog */}
      <RejectDialog
        open={showRejectDialog}
        onClose={() => {
          setShowRejectDialog(false);
          setSelectedItem(null);
        }}
        onConfirm={handleReject}
      />
    </div>
  );
}

function OvertimeApprovalCard({ item, onApprove, onReject }: any) {
  return (
    <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {item.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.department}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-semibold inline-block mb-2">
            待审批
          </div>
          <p className="text-xs text-gray-500">{item.submitTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30">
          <p className="text-sm text-gray-600 mb-1">加班日期</p>
          <p className="font-semibold text-gray-800 text-lg">{item.date}</p>
        </div>
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30">
          <p className="text-sm text-gray-600 mb-1">加班时长</p>
          <p className="font-semibold text-indigo-600 text-2xl">{item.hours} <span className="text-sm">小时</span></p>
        </div>
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30">
          <p className="text-sm text-gray-600 mb-1">加班时间</p>
          <p className="font-semibold text-gray-800">{item.startTime} - {item.endTime}</p>
        </div>
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30">
          <p className="text-sm text-gray-600 mb-1">审批人</p>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <p className="font-semibold text-gray-800">{item.approver}</p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30 mb-6">
        <p className="text-sm text-gray-600 mb-2">加班事由</p>
        <p className="text-gray-800">{item.reason}</p>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onReject}
          className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium"
        >
          驳回
        </button>
        <button
          onClick={onApprove}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium"
        >
          同意
        </button>
      </div>
    </div>
  );
}

function LeaveApprovalCard({ item, onApprove, onReject }: any) {
  return (
    <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {item.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.department}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-semibold inline-block mb-2">
            待审批
          </div>
          <p className="text-xs text-gray-500">{item.submitTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30">
          <p className="text-sm text-gray-600 mb-1">休假类型</p>
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold inline-block">
            {item.type}
          </div>
        </div>
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30">
          <p className="text-sm text-gray-600 mb-1">休假天数</p>
          <p className="font-semibold text-indigo-600 text-2xl">{item.days} <span className="text-sm">天</span></p>
        </div>
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30 col-span-2">
          <p className="text-sm text-gray-600 mb-1">休假时间</p>
          <p className="font-semibold text-gray-800">{item.startDate} 至 {item.endDate}</p>
        </div>
        <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30 col-span-2">
          <p className="text-sm text-gray-600 mb-1">审批人</p>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <p className="font-semibold text-gray-800">{item.approver}</p>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30 mb-6">
        <p className="text-sm text-gray-600 mb-2">休假事由</p>
        <p className="text-gray-800">{item.reason}</p>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onReject}
          className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium"
        >
          驳回
        </button>
        <button
          onClick={onApprove}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium"
        >
          同意
        </button>
      </div>
    </div>
  );
}

function RejectDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const [reason, setReason] = useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">驳回申请</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">请填写驳回理由</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="backdrop-blur-lg bg-gradient-to-r from-gray-50/80 to-slate-50/80 rounded-xl p-3 border border-gray-100/50 shadow-inner">
            <label className="block text-xs mb-1.5 text-gray-700 font-bold">驳回理由</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="请输入驳回理由..."
              rows={4}
              className="w-full px-3 py-2 backdrop-blur-lg bg-white/80 border border-white/50 rounded-lg text-gray-800 resize-none font-medium text-sm"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70 px-4 py-2">
            取消
          </Button>
          <Button 
            onClick={() => { onConfirm(); onClose(); }} 
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2"
          >
            <XCircle className="w-4 h-4 mr-2" />
            确认驳回
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}