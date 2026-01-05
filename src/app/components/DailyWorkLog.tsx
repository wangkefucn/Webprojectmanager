import { useState } from 'react';
import { Plus, Clock, Save, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DailyWorkLogProps {
  user: { name: string; role: string; department: string };
}

export function DailyWorkLog({ user }: DailyWorkLogProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [expandedDate, setExpandedDate] = useState<string | null>('2026-01-05');

  const workLogs = [
    {
      date: '2026-01-05',
      totalHours: 8.5,
      entries: [
        { project: '项目A', task: '需求分析', category: '设计', hours: 2.5, timeRange: '09:00-11:30' },
        { project: '项目A', task: '接口设计', category: '开发', hours: 3.0, timeRange: '13:00-16:00' },
        { project: '通勤', task: '通勤时间', category: '通勤', hours: 1.0, timeRange: '08:00-09:00' },
        { project: '项目B', task: 'Code Review', category: '开发', hours: 2.0, timeRange: '16:00-18:00' },
      ]
    },
    {
      date: '2026-01-04',
      totalHours: 9.0,
      entries: [
        { project: '项目A', task: '编码实现', category: '开发', hours: 5.0, timeRange: '09:00-14:00' },
        { project: '项目C', task: '测试', category: '测试', hours: 3.0, timeRange: '14:00-17:00' },
        { project: '通勤', task: '通勤时间', category: '通勤', hours: 1.0, timeRange: '08:00-09:00' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">每日工作记录</h2>
            <p className="text-sm text-gray-600">记录您的工作时间和项目进度</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowStatsDialog(true)}
              className="flex items-center gap-2 px-6 py-3 backdrop-blur-lg bg-white/70 border border-white/30 text-gray-700 rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <BarChart3 className="w-5 h-5" />
              <span>工时统计</span>
            </button>
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>添加工作记录</span>
            </button>
          </div>
        </div>
      </div>

      {/* Work Logs by Date */}
      <div className="space-y-4">
        {workLogs.map((dayLog) => (
          <div
            key={dayLog.date}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Date Header */}
            <button
              onClick={() => setExpandedDate(expandedDate === dayLog.date ? null : dayLog.date)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/40 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{dayLog.date.split('-')[2]}</div>
                  <div className="text-sm text-gray-600">{dayLog.date.substring(0, 7)}</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{dayLog.entries.length} 条记录</p>
                  <p className="text-sm text-gray-600">总计 {dayLog.totalHours} 小时</p>
                </div>
              </div>
              {expandedDate === dayLog.date ? (
                <ChevronUp className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-600" />
              )}
            </button>

            {/* Entries */}
            {expandedDate === dayLog.date && (
              <div className="border-t border-white/20 p-6 space-y-3 bg-white/20">
                {dayLog.entries.map((entry, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-lg bg-white/70 rounded-2xl p-4 border border-white/30 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`px-3 py-1 rounded-lg font-semibold text-sm ${getCategoryColor(entry.category)}`}>
                          {entry.project}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{entry.task}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-600">{entry.category}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{entry.timeRange}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{entry.hours}</div>
                        <div className="text-sm text-gray-600">小时</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Work Log Dialog */}
      <AddWorkLogDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
      
      {/* Statistics Dialog */}
      <StatsDialog open={showStatsDialog} onClose={() => setShowStatsDialog(false)} />
    </div>
  );
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    '设计': 'bg-purple-100 text-purple-700',
    '开发': 'bg-blue-100 text-blue-700',
    '测试': 'bg-green-100 text-green-700',
    '通勤': 'bg-gray-100 text-gray-700',
    '会议': 'bg-orange-100 text-orange-700',
    '其他': 'bg-pink-100 text-pink-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

function AddWorkLogDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    projectGroup: '',
    project: '',
    category: '',
    task: '',
    startTime: '',
    endTime: '',
    phase: '',
  });

  const projectGroups = ['项目组A', '项目组B', '项目组C', '通勤/充电'];
  const projects = ['项目A', '项目B', '项目C', '项目D', '通勤', '充电'];
  const categories = ['概要设计', '详细设计', '开发', '单体测试', '结合测试', '总合测试', '通勤', '充电', '休日'];
  const phases = ['需求分析', '设计', '编码', '测试', 'Code Review', '文档编写', '会议'];

  const timeSlots = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const [saveAndNext, setSaveAndNext] = useState(false);

  const handleSubmit = () => {
    console.log('Work log:', formData);
    if (saveAndNext) {
      // Reset form for next entry
      setFormData({
        ...formData,
        task: '',
        startTime: formData.endTime,
        endTime: '',
      });
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">添加工作记录</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Date */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">日期</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="backdrop-blur-lg bg-white/70 border-white/30 max-w-xs"
            />
          </div>

          {/* Project Group - Quick Select Buttons */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">所属项目组</label>
            <div className="grid grid-cols-4 gap-3">
              {projectGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setFormData({ ...formData, projectGroup: group })}
                  className={`
                    px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${formData.projectGroup === group
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30'
                    }
                  `}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Project - Quick Select Buttons */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">项目名称</label>
            <div className="grid grid-cols-6 gap-3">
              {projects.map((project) => (
                <button
                  key={project}
                  onClick={() => setFormData({ ...formData, project })}
                  className={`
                    px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${formData.project === project
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30'
                    }
                  `}
                >
                  {project}
                </button>
              ))}
            </div>
          </div>

          {/* Category - Quick Select Buttons */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">作业分类</label>
            <div className="grid grid-cols-5 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFormData({ ...formData, category })}
                  className={`
                    px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${formData.category === category
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Phase - Quick Select Buttons */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">工程阶段</label>
            <div className="grid grid-cols-7 gap-3">
              {phases.map((phase) => (
                <button
                  key={phase}
                  onClick={() => setFormData({ ...formData, phase })}
                  className={`
                    px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${formData.phase === phase
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30'
                    }
                  `}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">任务名称</label>
            <Input
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="输入具体任务内容..."
              className="backdrop-blur-lg bg-white/70 border-white/30"
            />
          </div>

          {/* Time Range - Enhanced Time Picker */}
          <div>
            <label className="block text-sm mb-3 text-gray-700">作业时间</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-2 text-gray-600">开始时间</label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-lg bg-white/70 border border-white/30 text-gray-800 font-medium"
                >
                  <option value="">选择时间</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-2 text-gray-600">结束时间</label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-lg bg-white/70 border border-white/30 text-gray-800 font-medium"
                >
                  <option value="">选择时间</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            {formData.startTime && formData.endTime && (
              <div className="mt-3 p-3 bg-indigo-50 rounded-xl">
                <p className="text-sm text-indigo-700">
                  工作时长：<span className="font-bold">{calculateHours(formData.startTime, formData.endTime)} 小时</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end border-t border-white/20 pt-4">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70">
            取消
          </Button>
          <Button 
            onClick={() => { setSaveAndNext(true); handleSubmit(); }}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            保存并下一条
          </Button>
          <Button 
            onClick={() => { setSaveAndNext(false); handleSubmit(); }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function calculateHours(start: string, end: string): number {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return ((endMinutes - startMinutes) / 60).toFixed(2) as any;
}

function StatsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const stats = {
    totalHours: 12.5,
    commute: 1.3,
    charging: 0.0,
    休日: 11.3,
    projects: [
      { name: '项目A', hours: 8.5, percentage: 68 },
      { name: '项目B', hours: 2.0, percentage: 16 },
      { name: '项目C', hours: 2.0, percentage: 16 },
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">工时统计分析</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Total Hours */}
          <div className="text-center p-6 backdrop-blur-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl border border-white/30">
            <p className="text-sm text-gray-600 mb-2">本周期总工时</p>
            <p className="text-5xl font-bold text-indigo-600">{stats.totalHours} <span className="text-2xl">h</span></p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 backdrop-blur-lg bg-white/70 rounded-xl border border-white/30">
              <p className="text-sm text-gray-600 mb-1">通勤</p>
              <p className="text-2xl font-bold text-gray-800">{stats.commute}h</p>
            </div>
            <div className="text-center p-4 backdrop-blur-lg bg-white/70 rounded-xl border border-white/30">
              <p className="text-sm text-gray-600 mb-1">充电</p>
              <p className="text-2xl font-bold text-gray-800">{stats.charging}h</p>
            </div>
            <div className="text-center p-4 backdrop-blur-lg bg-white/70 rounded-xl border border-white/30">
              <p className="text-sm text-gray-600 mb-1">休日</p>
              <p className="text-2xl font-bold text-gray-800">{stats.休日}h</p>
            </div>
          </div>

          {/* Project Breakdown */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">项目工时分布</h4>
            <div className="space-y-3">
              {stats.projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{project.name}</span>
                    <span className="text-sm font-bold text-indigo-600">{project.hours}h</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${project.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
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
