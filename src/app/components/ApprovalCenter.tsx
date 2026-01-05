import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, FileText, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ApprovalCenterProps {
  user: { name: string; role: string; department: string };
}

export function ApprovalCenter({ user }: ApprovalCenterProps) {
  const [activeTab, setActiveTab] = useState<'overtime' | 'leave'>('overtime');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showWorklogDialog, setShowWorklogDialog] = useState(false);

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
      submitTime: '2026-01-04 17:45'
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
      submitTime: '2026-01-03 17:30'
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
      submitTime: '2026-01-04 14:20'
    }
  ];

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
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">审批中心</h2>
            <p className="text-sm text-gray-600">处理团队成员的申请事项</p>
          </div>
          <div className="flex items-center gap-6 backdrop-blur-lg bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl px-6 py-4 border border-white/30">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">待审批</p>
              <p className="text-3xl font-bold text-orange-600">
                {overtimeApplications.length + leaveApplications.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="flex border-b border-white/20 bg-white/40">
          <button
            onClick={() => setActiveTab('overtime')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-all duration-200 ${
              activeTab === 'overtime'
                ? 'bg-white/80 text-indigo-600 shadow-lg backdrop-blur-xl border-b-2 border-indigo-600'
                : 'text-gray-600 hover:bg-white/40'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-semibold">加班审批</span>
            {overtimeApplications.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {overtimeApplications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-all duration-200 ${
              activeTab === 'leave'
                ? 'bg-white/80 text-indigo-600 shadow-lg backdrop-blur-xl border-b-2 border-indigo-600'
                : 'text-gray-600 hover:bg-white/40'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">休假审批</span>
            {leaveApplications.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {leaveApplications.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overtime' && (
            <div className="space-y-4">
              {overtimeApplications.length === 0 ? (
                <div className="text-center py-12">
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
                    onViewWorklog={() => {
                      setSelectedItem(item);
                      setShowWorklogDialog(true);
                    }}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'leave' && (
            <div className="space-y-4">
              {leaveApplications.length === 0 ? (
                <div className="text-center py-12">
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
                    onViewWorklog={() => {
                      setSelectedItem(item);
                      setShowWorklogDialog(true);
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
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

      {/* Worklog Dialog */}
      <WorklogDialog
        open={showWorklogDialog}
        onClose={() => {
          setShowWorklogDialog(false);
          setSelectedItem(null);
        }}
        applicant={selectedItem?.name}
      />
    </div>
  );
}

function OvertimeApprovalCard({ item, onApprove, onReject, onViewWorklog }: any) {
  return (
    <div className="backdrop-blur-lg bg-white/70 rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
            {item.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.department}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold inline-block">
            待审批
          </div>
          <p className="text-xs text-gray-500 mt-1">{item.submitTime}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
            <p className="text-sm text-gray-600 mb-1">加班日期</p>
            <p className="font-semibold text-gray-800">{item.date}</p>
          </div>
          <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
            <p className="text-sm text-gray-600 mb-1">加班时长</p>
            <p className="font-semibold text-indigo-600 text-lg">{item.hours} 小时</p>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
          <p className="text-sm text-gray-600 mb-1">加班时间</p>
          <p className="font-semibold text-gray-800">{item.startTime} - {item.endTime}</p>
        </div>

        <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
          <p className="text-sm text-gray-600 mb-1">加班事由</p>
          <p className="text-gray-800">{item.reason}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewWorklog}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 backdrop-blur-lg bg-white/70 border border-white/30 text-gray-700 rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <BarChart3 className="w-4 h-4" />
          <span>查看工时报表</span>
        </button>
        <button
          onClick={onReject}
          className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          驳回
        </button>
        <button
          onClick={onApprove}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          同意
        </button>
      </div>
    </div>
  );
}

function LeaveApprovalCard({ item, onApprove, onReject, onViewWorklog }: any) {
  return (
    <div className="backdrop-blur-lg bg-white/70 rounded-2xl p-6 border border-white/30 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
            {item.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.department}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold inline-block">
            待审批
          </div>
          <p className="text-xs text-gray-500 mt-1">{item.submitTime}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
            <p className="text-sm text-gray-600 mb-1">休假类型</p>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold inline-block">
              {item.type}
            </div>
          </div>
          <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
            <p className="text-sm text-gray-600 mb-1">休假天数</p>
            <p className="font-semibold text-indigo-600 text-lg">{item.days} 天</p>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
          <p className="text-sm text-gray-600 mb-1">休假时间</p>
          <p className="font-semibold text-gray-800">{item.startDate} 至 {item.endDate}</p>
        </div>

        <div className="backdrop-blur-lg bg-white/50 rounded-xl p-3">
          <p className="text-sm text-gray-600 mb-1">休假事由</p>
          <p className="text-gray-800">{item.reason}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewWorklog}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 backdrop-blur-lg bg-white/70 border border-white/30 text-gray-700 rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <BarChart3 className="w-4 h-4" />
          <span>查看工时报表</span>
        </button>
        <button
          onClick={onReject}
          className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          驳回
        </button>
        <button
          onClick={onApprove}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
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
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">驳回申请</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="block text-sm mb-2 text-gray-700">驳回理由</label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="请输入驳回原因..."
            className="backdrop-blur-lg bg-white/70 border-white/30 min-h-[120px]"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70">
            取消
          </Button>
          <Button onClick={onConfirm} className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            确认驳回
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WorklogDialog({ open, onClose, applicant }: { open: boolean; onClose: () => void; applicant?: string }) {
  const workLogs = [
    { date: '2026-01-04', project: '项目A', task: '障害分析', hours: 5.0 },
    { date: '2026-01-04', project: '项目A', task: '变更对应', hours: 3.5 },
    { date: '2026-01-03', project: '项目B', task: '开发', hours: 6.0 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{applicant} - 工时报表</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-3">
            {workLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 backdrop-blur-lg bg-white/70 rounded-xl border border-white/30"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{log.date.split('-')[2]}</div>
                    <div className="text-xs text-gray-600">{log.date.substring(0, 7)}</div>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div>
                    <p className="font-semibold text-gray-800">{log.project}</p>
                    <p className="text-sm text-gray-600">{log.task}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{log.hours}</p>
                  <p className="text-sm text-gray-600">小时</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
