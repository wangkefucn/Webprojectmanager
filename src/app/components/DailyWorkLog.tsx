import { useState } from 'react';
import { Plus, Clock, Save, BarChart3, ChevronDown, ChevronUp, Edit, History } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DateRangePicker } from './DateRangePicker';

interface DailyWorkLogProps {
  user: { name: string; role: string; department: string };
}

// 22个工程列表
const ALL_PHASES = [
  '概要設計', '方式设计', '基本設計', '詳細設計', '開発',
  '単体测试準備', '単体测试実施',
  '連結测试（内部）準備', '連結测试（内部）実施',
  '連結测试（外部）準備', '連結测试（外部）実施',
  'システム間测试準備', 'システム間测试実施',
  '総合测试準備', '総合测试実施',
  '性能测试準備', '性能测试実施',
  'リリースリハ準備', 'リリースリハ実施',
  '本番リリース準備', '本番リリース実施',
  'マネージャー（案件推進）', 'バッファ',
];

export function DailyWorkLog({ user }: DailyWorkLogProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  
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

  const [workLogs, setWorkLogs] = useState([
    {
      id: 1,
      date: '2026-01-06',
      project: '项目A - ERP系统升级',
      phase: '開発',
      hours: 8.0,
      startTime: '08:30',
      endTime: '17:30',
      description: '用户管理模块开发',
      workType: '通常',
      modifiedAt: null
    },
    {
      id: 2,
      date: '2026-01-05',
      project: '项目B - 移动端开发',
      phase: '単体测试実施',
      hours: 6.5,
      startTime: '08:30',
      endTime: '15:00',
      description: 'UI组件单元测试',
      workType: '通常',
      modifiedAt: '2026-01-05 16:30'
    },
    {
      id: 3,
      date: '2026-01-05',
      project: 'JIRA对应',
      phase: '-',
      hours: 1.5,
      startTime: '15:00',
      endTime: '16:30',
      description: 'JIRA-1234 问题处理',
      workType: '通常',
      modifiedAt: null
    },
  ]);

  const handleEdit = (log: any) => {
    setEditingLog(log);
    setShowEditDialog(true);
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

      {/* Header */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">工作记录</h2>
            <p className="text-sm text-gray-600">记录每日工作内容和工时</p>
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
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>添加工作记录</span>
            </button>
          </div>
        </div>
      </div>

      {/* Work Logs */}
      <div className="space-y-3">
        {workLogs.map((log) => (
          <div
            key={log.id}
            className="backdrop-blur-xl bg-white/60 rounded-2xl p-5 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl font-bold text-gray-800">{log.date.split('-')[2]}</div>
                  <div className="text-sm text-gray-600">{log.date.substring(0, 7)}</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{log.project}</h3>
                    {log.phase !== '-' && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg">{log.phase}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.description}</p>
                  {log.modifiedAt && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <History className="w-3 h-3" />
                      <span>修改于 {log.modifiedAt}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {log.startTime} - {log.endTime}
                </div>
                <div className="text-right min-w-[120px]">
                  <div className={`px-3 py-1 rounded-lg text-sm mb-1 inline-block ${
                    log.workType === '残業' ? 'bg-orange-100 text-orange-700' :
                    log.workType === '休日' ? 'bg-red-100 text-red-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {log.workType}
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">{log.hours}h</div>
                </div>
                <button
                  onClick={() => handleEdit(log)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  title="修改记录"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <AddWorkLogDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
      <EditWorkLogDialog 
        open={showEditDialog} 
        onClose={() => { setShowEditDialog(false); setEditingLog(null); }} 
        log={editingLog}
      />
      <StatsDialog open={showStatsDialog} onClose={() => setShowStatsDialog(false)} />
    </div>
  );
}

function AddWorkLogDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [workCategory, setWorkCategory] = useState<'normal' | 'jira' | 'management'>('normal');
  const [workType, setWorkType] = useState<'通常' | '残業' | '休日'>('通常');
  const [projectGroup, setProjectGroup] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [jiraNumber, setJiraNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 时间选择 - 改为数组存储多个选中的时间段
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [showMorningHours, setShowMorningHours] = useState(false);
  const [showNightHours, setShowNightHours] = useState(false);

  // 生成15分钟步频的时间选项
  const generateTimeSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const morningSlots = generateTimeSlots(0, 8);
  const normalSlots = generateTimeSlots(8, 20);
  const nightSlots = generateTimeSlots(20, 24);

  // 模拟项目数据 - 只显示有预算的工程
  const projects = [
    { 
      name: '项目A - ERP系统升级', 
      phases: ['概要設計', '詳細設計', '開発', '単体测试準備', '単体测试実施', '連結测试（内部）実施']
    },
    { 
      name: '项目B - 移动端开发', 
      phases: ['概要設計', '詳細設計', '開発', '単体测试準備', '単体测试実施']
    },
  ];

  const projectGroups = ['项目组A', '项目组B', '项目组C', 'Enhance'];
  const jiraTypes = ['JIRA对应', 'チャット对应', 'メール对应', 'そのた'];
  const managementTypes = ['マネジメント会議', '日次定例', '週次定例', '内部管理', 'そのた'];

  // 切换时间段选中状态
  const toggleTimeSlot = (time: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        // 如果已选中，则取消选中
        return prev.filter(t => t !== time);
      } else {
        // 如果未选中，则添加
        return [...prev, time].sort();
      }
    });
  };

  // 计算总工时：选中的时间段数量 * 0.25h
  const totalHours = selectedTimeSlots.length * 0.25;

  // 获取选中时间段的范围显示
  const getTimeRangeDisplay = () => {
    if (selectedTimeSlots.length === 0) return null;
    
    const sortedSlots = [...selectedTimeSlots].sort();
    const firstSlot = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];
    
    // 计算最后一个时间段的结束时间
    const [hour, minute] = lastSlot.split(':').map(Number);
    const endMinute = (minute + 15) % 60;
    const endHour = minute + 15 >= 60 ? hour + 1 : hour;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return { start: firstSlot, end: endTime };
  };

  const handleSubmit = () => {
    console.log('Work log submitted:', {
      workCategory,
      workType,
      projectGroup,
      selectedProject,
      selectedPhase,
      selectedSubType,
      jiraNumber,
      description,
      selectedDate,
      selectedTimeSlots,
      totalHours,
    });
    onClose();
  };

  const TimeButton = ({ time, selected, onClick }: any) => {
    // 计算结束时间（加15分钟）
    const [hour, minute] = time.split(':').map(Number);
    const endMinute = (minute + 15) % 60;
    const endHour = minute + 15 >= 60 ? hour + 1 : hour;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return (
      <button
        onClick={() => onClick(time)}
        className={`px-2 py-2 rounded-lg text-xs transition-all duration-200 font-medium ${
          selected
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
            : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30'
        }`}
      >
        <div className="font-bold">{time}</div>
        <div className="text-[10px] opacity-75">~{endTime}</div>
      </button>
    );
  };

  const timeRange = getTimeRangeDisplay();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">添加工作记录</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">填写工作内容和时间信息</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {/* 日期选择 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50">
            <label className="block text-xs mb-1.5 text-gray-700 font-semibold">作业日期</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="backdrop-blur-lg bg-white/80 border-white/50 max-w-xs font-medium"
            />
          </div>

          {/* 项目组 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3 border border-teal-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">项目组</label>
            <div className="grid grid-cols-4 gap-3">
              {projectGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setProjectGroup(group)}
                  className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                    projectGroup === group
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* 作业分类 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-3 border border-purple-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">作业分类</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setWorkCategory('normal')}
                className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap ${
                  workCategory === 'normal'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl scale-105 border-indigo-600 transform'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                }`}
              >
                <div className="text-base font-bold mb-1">一般案件对应</div>
                <div className="text-xs opacity-90">项目开发工作</div>
              </button>
              <button
                onClick={() => setWorkCategory('jira')}
                className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap ${
                  workCategory === 'jira'
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl scale-105 border-orange-600 transform'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                }`}
              >
                <div className="text-base font-bold mb-1">保守对应（JIRA/チャット）</div>
                <div className="text-xs opacity-90">日常维护工作</div>
              </button>
              <button
                onClick={() => setWorkCategory('management')}
                className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap ${
                  workCategory === 'management'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl scale-105 border-green-600 transform'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                }`}
              >
                <div className="text-base font-bold mb-1">保守对应（管理）</div>
                <div className="text-xs opacity-90">会议和管理工作</div>
              </button>
            </div>
          </div>

          {/* 根据作业分类显示不同内容 */}
          {workCategory === 'normal' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">选择案件</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">案件</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                      setSelectedPhase('');
                    }}
                    className="w-full px-3 py-2 backdrop-blur-lg bg-white/80 border border-white/50 rounded-lg text-gray-800 font-medium"
                  >
                    <option value="">请选择案件...</option>
                    {projects.map((project) => (
                      <option key={project.name} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedProject && (
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">工程</label>
                    <div className="grid grid-cols-6 gap-2">
                      {ALL_PHASES.map((phase) => (
                        <button
                          key={phase}
                          onClick={() => setSelectedPhase(phase)}
                          className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-xs ${
                            selectedPhase === phase
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                              : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                          }`}
                        >
                          {phase}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {workCategory === 'jira' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50/80 to-red-50/80 rounded-xl p-3 border border-orange-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">保守对应类型</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {jiraTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      selectedSubType === type
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {selectedSubType && (
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">
                    {selectedSubType.includes('JIRA') ? 'JIRA号码' : selectedSubType.includes('チャット') ? 'チャット主题' : '主题'}
                  </label>
                  <Input
                    value={jiraNumber}
                    onChange={(e) => setJiraNumber(e.target.value)}
                    placeholder={selectedSubType.includes('JIRA') ? '例：JIRA-1234' : '输入主题...'}
                    className="backdrop-blur-lg bg-white/80 border-white/50"
                  />
                </div>
              )}
            </div>
          )}

          {workCategory === 'management' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-3 border border-green-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">管理对应类型</label>
              <div className="grid grid-cols-5 gap-2">
                {managementTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      selectedSubType === type
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 作业时间分类 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-yellow-50/80 to-amber-50/80 rounded-xl p-3 border border-yellow-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">作业时间分类</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setWorkType('通常')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  workType === '通常'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                通常
              </button>
              <button
                onClick={() => setWorkType('残業')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  workType === '残業'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                残業
              </button>
              <button
                onClick={() => setWorkType('休日')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  workType === '休日'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                休日
              </button>
            </div>
          </div>

          {/* 时间带选择 - 15分钟步频 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-blue-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-gray-700 font-bold">时间带选择（15分钟步频）</label>
              <span className="text-xs text-gray-500">可复数选择时间带，请选择您想记录的时间</span>
            </div>
            
            {/* 早晨时段（可折叠） */}
            <div className="mb-2">
              <button
                onClick={() => setShowMorningHours(!showMorningHours)}
                className="flex items-center gap-2 text-xs text-gray-700 mb-1.5 hover:text-indigo-600 font-semibold"
              >
                {showMorningHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>早晨时段 (00:00 - 08:00)</span>
              </button>
              {showMorningHours && (
                <div className="grid grid-cols-16 gap-1 p-2 bg-white/60 rounded-lg shadow-inner">
                  {morningSlots.map((time) => (
                    <TimeButton
                      key={time}
                      time={time}
                      selected={selectedTimeSlots.includes(time)}
                      onClick={toggleTimeSlot}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 正常时段 */}
            <div className="mb-2">
              <div className="text-xs text-gray-700 mb-1.5 font-semibold">正常时段 (08:00 - 20:00)</div>
              <div className="grid grid-cols-16 gap-1 p-2 bg-white/60 rounded-lg shadow-inner">
                {normalSlots.map((time) => (
                  <TimeButton
                    key={time}
                    time={time}
                    selected={selectedTimeSlots.includes(time)}
                    onClick={toggleTimeSlot}
                  />
                ))}
              </div>
            </div>

            {/* 深夜时段（可折叠） */}
            <div className="mb-2">
              <button
                onClick={() => setShowNightHours(!showNightHours)}
                className="flex items-center gap-2 text-xs text-gray-700 mb-1.5 hover:text-indigo-600 font-semibold"
              >
                {showNightHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>深夜时段 (20:00 - 24:00)</span>
              </button>
              {showNightHours && (
                <div className="grid grid-cols-16 gap-1 p-2 bg-white/60 rounded-lg shadow-inner">
                  {nightSlots.map((time) => (
                    <TimeButton
                      key={time}
                      time={time}
                      selected={selectedTimeSlots.includes(time)}
                      onClick={toggleTimeSlot}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 选中的时间显示 */}
            {selectedTimeSlots.length > 0 && (
              <div className="p-3 bg-gradient-to-r from-indigo-100/70 to-purple-100/70 rounded-lg border border-indigo-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-semibold">已选择时段：</span>
                  <div className="flex items-center gap-3">
                    {timeRange && (
                      <>
                        <span className="px-3 py-1.5 bg-white text-indigo-700 rounded-lg font-bold text-sm shadow-md">
                          {timeRange.start}
                        </span>
                        <span className="text-gray-500 font-bold">~</span>
                        <span className="px-3 py-1.5 bg-white text-indigo-700 rounded-lg font-bold text-sm shadow-md">
                          {timeRange.end}
                        </span>
                      </>
                    )}
                    <span className="text-xl font-bold text-indigo-600 ml-2">
                      {totalHours.toFixed(2)}h
                    </span>
                    <span className="text-xs text-gray-600">
                      (共{selectedTimeSlots.length}个时间带)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 作业内容 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-gray-50/80 to-slate-50/80 rounded-xl p-3 border border-gray-100/50 shadow-inner">
            <label className="block text-xs mb-1.5 text-gray-700 font-bold">作业内容</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入作业内容描述..."
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
            保存记录
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditWorkLogDialog({ open, onClose, log }: { open: boolean; onClose: () => void; log: any }) {
  // Similar structure to AddWorkLogDialog but pre-filled with log data
  if (!log) return null;

  const [workCategory, setWorkCategory] = useState<'normal' | 'jira' | 'management'>(log.category || 'normal');
  const [workType, setWorkType] = useState<'通常' | '残業' | '休日'>(log.type || '通常');
  const [projectGroup, setProjectGroup] = useState(log.projectGroup || '');
  const [selectedProject, setSelectedProject] = useState(log.project || '');
  const [selectedPhase, setSelectedPhase] = useState(log.phase || '');
  const [selectedSubType, setSelectedSubType] = useState(log.subType || '');
  const [jiraNumber, setJiraNumber] = useState(log.jiraNumber || '');
  const [description, setDescription] = useState(log.description || '');
  const [selectedDate, setSelectedDate] = useState(log.date || new Date().toISOString().split('T')[0]);
  
  // 时间选择 - 预填充已选择的时间段
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(log.timeSlots || []);
  const [showMorningHours, setShowMorningHours] = useState(false);
  const [showNightHours, setShowNightHours] = useState(false);

  // 生成15分钟步频的时间选项
  const generateTimeSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const morningSlots = generateTimeSlots(0, 8);
  const normalSlots = generateTimeSlots(8, 20);
  const nightSlots = generateTimeSlots(20, 24);

  // 模拟项目数据 - 只显示有预算的工程
  const projects = [
    { 
      name: '项目A - ERP系统升级', 
      phases: ['概要設計', '詳細設計', '開発', '単体测试準備', '単体测试実施', '連結测试（内部）実施']
    },
    { 
      name: '项目B - 移动端开发', 
      phases: ['概要設計', '詳細設計', '開発', '単体测试準備', '単体测试実施']
    },
  ];

  const projectGroups = ['项目组A', '项目组B', '项目组C', 'Enhance'];
  const jiraTypes = ['JIRA对应', 'チャット对应', 'メール对应', 'そのた'];
  const managementTypes = ['マネジメント会議', '日次定例', '週次定例', '内部管理', 'そのた'];

  // 切换时间段选中状态
  const toggleTimeSlot = (time: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  // 计算总工时：选中的时间段数量 * 0.25h
  const totalHours = selectedTimeSlots.length * 0.25;

  // 获取选中时间段的范围显示
  const getTimeRangeDisplay = () => {
    if (selectedTimeSlots.length === 0) return null;
    
    const sortedSlots = [...selectedTimeSlots].sort();
    const firstSlot = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];
    
    // 计算最后一个时间段的结束时间
    const [hour, minute] = lastSlot.split(':').map(Number);
    const endMinute = (minute + 15) % 60;
    const endHour = minute + 15 >= 60 ? hour + 1 : hour;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return { start: firstSlot, end: endTime };
  };

  const handleSubmit = () => {
    console.log('Work log updated:', {
      workCategory,
      workType,
      projectGroup,
      selectedProject,
      selectedPhase,
      selectedSubType,
      jiraNumber,
      description,
      selectedDate,
      selectedTimeSlots,
      totalHours,
    });
    onClose();
  };

  const TimeButton = ({ time, selected, onClick }: any) => {
    const [hour, minute] = time.split(':').map(Number);
    const endMinute = (minute + 15) % 60;
    const endHour = minute + 15 >= 60 ? hour + 1 : hour;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return (
      <button
        onClick={() => onClick(time)}
        className={`px-2 py-2 rounded-lg text-xs transition-all duration-200 font-medium ${
          selected
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
            : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90 border border-white/30'
        }`}
      >
        <div className="font-bold">{time}</div>
        <div className="text-[10px] opacity-75">~{endTime}</div>
      </button>
    );
  };

  const timeRange = getTimeRangeDisplay();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">修改工作记录</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">修改后将记录修改时间</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {/* 日期选择 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50">
            <label className="block text-xs mb-1.5 text-gray-700 font-semibold">作业日期</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="backdrop-blur-lg bg-white/80 border-white/50 max-w-xs font-medium"
            />
          </div>

          {/* 项目组 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3 border border-teal-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">项目组</label>
            <div className="grid grid-cols-4 gap-3">
              {projectGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setProjectGroup(group)}
                  className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                    projectGroup === group
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105'
                      : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* 作业分类 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-3 border border-purple-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">作业分类</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setWorkCategory('normal')}
                className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap ${
                  workCategory === 'normal'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl scale-105 border-indigo-600 transform'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                }`}
              >
                <div className="text-base font-bold mb-1">一般案件对应</div>
                <div className="text-xs opacity-90">项目开发工作</div>
              </button>
              <button
                onClick={() => setWorkCategory('jira')}
                className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap ${
                  workCategory === 'jira'
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl scale-105 border-orange-600 transform'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                }`}
              >
                <div className="text-base font-bold mb-1">保守对应（JIRA/チャット）</div>
                <div className="text-xs opacity-90">日常维护工作</div>
              </button>
              <button
                onClick={() => setWorkCategory('management')}
                className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap ${
                  workCategory === 'management'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl scale-105 border-green-600 transform'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                }`}
              >
                <div className="text-base font-bold mb-1">保守对应（管理）</div>
                <div className="text-xs opacity-90">会议和管理工作</div>
              </button>
            </div>
          </div>

          {/* 根据作业分类显示不同内容 */}
          {workCategory === 'normal' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">选择案件</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">案件</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                      setSelectedPhase('');
                    }}
                    className="w-full px-3 py-2 backdrop-blur-lg bg-white/80 border border-white/50 rounded-lg text-gray-800 font-medium"
                  >
                    <option value="">请选择案件...</option>
                    {projects.map((project) => (
                      <option key={project.name} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedProject && (
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">工程</label>
                    <div className="grid grid-cols-6 gap-2">
                      {ALL_PHASES.map((phase) => (
                        <button
                          key={phase}
                          onClick={() => setSelectedPhase(phase)}
                          className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-xs ${
                            selectedPhase === phase
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                              : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                          }`}
                        >
                          {phase}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {workCategory === 'jira' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50/80 to-red-50/80 rounded-xl p-3 border border-orange-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">保守对应类型</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {jiraTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      selectedSubType === type
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {selectedSubType && (
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">
                    {selectedSubType.includes('JIRA') ? 'JIRA号码' : selectedSubType.includes('チャット') ? 'チャット主题' : '主题'}
                  </label>
                  <Input
                    value={jiraNumber}
                    onChange={(e) => setJiraNumber(e.target.value)}
                    placeholder={selectedSubType.includes('JIRA') ? '例：JIRA-1234' : '输入主题...'}
                    className="backdrop-blur-lg bg-white/80 border-white/50"
                  />
                </div>
              )}
            </div>
          )}

          {workCategory === 'management' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-3 border border-green-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">管理对应类型</label>
              <div className="grid grid-cols-5 gap-2">
                {managementTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      selectedSubType === type
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 作业时间分类 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-yellow-50/80 to-amber-50/80 rounded-xl p-3 border border-yellow-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">作业时间分类</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setWorkType('通常')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  workType === '通常'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                通常
              </button>
              <button
                onClick={() => setWorkType('残業')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  workType === '残業'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                残業
              </button>
              <button
                onClick={() => setWorkType('休日')}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                  workType === '休日'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                }`}
              >
                休日
              </button>
            </div>
          </div>

          {/* 时间带选择 - 15分钟步频 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-blue-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-gray-700 font-bold">时间带选择（15分钟步频）</label>
              <span className="text-xs text-gray-500">可复数选择时间带，请选择您想记录的时间</span>
            </div>
            
            {/* 早晨时段（可折叠） */}
            <div className="mb-2">
              <button
                onClick={() => setShowMorningHours(!showMorningHours)}
                className="flex items-center gap-2 text-xs text-gray-700 mb-1.5 hover:text-indigo-600 font-semibold"
              >
                {showMorningHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>早晨时段 (00:00 - 08:00)</span>
              </button>
              {showMorningHours && (
                <div className="grid grid-cols-16 gap-1 p-2 bg-white/60 rounded-lg shadow-inner">
                  {morningSlots.map((time) => (
                    <TimeButton
                      key={time}
                      time={time}
                      selected={selectedTimeSlots.includes(time)}
                      onClick={toggleTimeSlot}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 正常时段 */}
            <div className="mb-2">
              <div className="text-xs text-gray-700 mb-1.5 font-semibold">正常时段 (08:00 - 20:00)</div>
              <div className="grid grid-cols-16 gap-1 p-2 bg-white/60 rounded-lg shadow-inner">
                {normalSlots.map((time) => (
                  <TimeButton
                    key={time}
                    time={time}
                    selected={selectedTimeSlots.includes(time)}
                    onClick={toggleTimeSlot}
                  />
                ))}
              </div>
            </div>

            {/* 深夜时段（可折叠） */}
            <div className="mb-2">
              <button
                onClick={() => setShowNightHours(!showNightHours)}
                className="flex items-center gap-2 text-xs text-gray-700 mb-1.5 hover:text-indigo-600 font-semibold"
              >
                {showNightHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>深夜时段 (20:00 - 24:00)</span>
              </button>
              {showNightHours && (
                <div className="grid grid-cols-16 gap-1 p-2 bg-white/60 rounded-lg shadow-inner">
                  {nightSlots.map((time) => (
                    <TimeButton
                      key={time}
                      time={time}
                      selected={selectedTimeSlots.includes(time)}
                      onClick={toggleTimeSlot}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 选中的时间显示 */}
            {selectedTimeSlots.length > 0 && (
              <div className="p-3 bg-gradient-to-r from-indigo-100/70 to-purple-100/70 rounded-lg border border-indigo-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-semibold">已选择时段：</span>
                  <div className="flex items-center gap-3">
                    {timeRange && (
                      <>
                        <span className="px-3 py-1.5 bg-white text-indigo-700 rounded-lg font-bold text-sm shadow-md">
                          {timeRange.start}
                        </span>
                        <span className="text-gray-500 font-bold">~</span>
                        <span className="px-3 py-1.5 bg-white text-indigo-700 rounded-lg font-bold text-sm shadow-md">
                          {timeRange.end}
                        </span>
                      </>
                    )}
                    <span className="text-xl font-bold text-indigo-600 ml-2">
                      {totalHours.toFixed(2)}h
                    </span>
                    <span className="text-xs text-gray-600">
                      (共{selectedTimeSlots.length}个时间带)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 作业内容 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-gray-50/80 to-slate-50/80 rounded-xl p-3 border border-gray-100/50 shadow-inner">
            <label className="block text-xs mb-1.5 text-gray-700 font-bold">作业内容</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入作业内容描述..."
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
            保存修改
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  // 统计时间范围
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
  const [statsStartDate, setStatsStartDate] = useState(firstDayOfMonth);
  const [statsEndDate, setStatsEndDate] = useState(lastDayOfMonth);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">工时统计分析</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">查看指定时间范围的工作时间统计数据</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {/* 时间范围选择 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">统计时间范围</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">开始日期</label>
                <Input
                  type="date"
                  value={statsStartDate}
                  onChange={(e) => setStatsStartDate(e.target.value)}
                  className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">结束日期</label>
                <Input
                  type="date"
                  value={statsEndDate}
                  onChange={(e) => setStatsEndDate(e.target.value)}
                  className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-4 border border-blue-100/50 shadow-inner">
              <p className="text-xs text-gray-600 mb-2 font-semibold">总工时</p>
              <p className="text-3xl font-bold text-blue-600">168.5h</p>
            </div>
            <div className="backdrop-blur-lg bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-4 border border-green-100/50 shadow-inner">
              <p className="text-xs text-gray-600 mb-2 font-semibold">平均每日</p>
              <p className="text-3xl font-bold text-green-600">8.4h</p>
            </div>
            <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50/80 to-red-50/80 rounded-xl p-4 border border-orange-100/50 shadow-inner">
              <p className="text-xs text-gray-600 mb-2 font-semibold">加班工时</p>
              <p className="text-3xl font-bold text-orange-600">15.5h</p>
            </div>
            <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-4 border border-purple-100/50 shadow-inner">
              <p className="text-xs text-gray-600 mb-2 font-semibold">工作天数</p>
              <p className="text-3xl font-bold text-purple-600">20天</p>
            </div>
          </div>

          {/* 项目分布 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">项目工时分布</label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">项目A - ERP系统升级</span>
                <span className="text-sm font-bold text-indigo-600">85.5h (50.7%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">项目B - 移动端开发</span>
                <span className="text-sm font-bold text-indigo-600">65.0h (38.6%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">JIRA/チャット对应</span>
                <span className="text-sm font-bold text-indigo-600">18.0h (10.7%)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70 px-4 py-2">
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}