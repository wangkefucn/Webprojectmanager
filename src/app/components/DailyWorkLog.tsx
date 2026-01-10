import { useState } from 'react';
import { Plus, Clock, Save, BarChart3, ChevronDown, ChevronUp, Edit, History, MessageSquare, Users, AlertCircle, CheckCircle2, Calendar as CalendarIcon, Info, Lightbulb, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DateRangePicker } from './DateRangePicker';
import { SAMPLE_WORK_LOGS } from '../data/sampleWorkLogs';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

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

  const [workLogs, setWorkLogs] = useState(SAMPLE_WORK_LOGS);

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
      <div className="space-y-6">
        {(() => {
          // 按日期分组工作记录
          const groupedByDate: Record<string, typeof workLogs> = {};
          workLogs.forEach(log => {
            if (!groupedByDate[log.date]) {
              groupedByDate[log.date] = [];
            }
            groupedByDate[log.date].push(log);
          });
          
          // 格式化日期：2026/01/04(日)
          const formatDateWithWeekday = (dateStr: string) => {
            const date = new Date(dateStr);
            const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
            const weekday = weekdays[date.getDay()];
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}/${month}/${day}(${weekday})`;
          };
          
          // 按日期排序（最新在前）
          const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));
          
          return sortedDates.map(date => {
            const logsForDate = groupedByDate[date];
            const dailyTotal = logsForDate.reduce((sum, log) => sum + log.hours, 0);
            
            return (
              <div key={date} className="space-y-3">
                {/* 日期标题栏 with 合计 */}
                <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-500/90 to-purple-600/90 rounded-2xl p-4 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {formatDateWithWeekday(date)}
                    </h3>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-xl">
                      <span className="text-sm text-white/90">日合计</span>
                      <span className="text-2xl font-bold text-white">{dailyTotal.toFixed(2)}h</span>
                    </div>
                  </div>
                </div>
                
                {/* 该日期的所有记录 */}
                <div className="space-y-3 pl-4">
                  {logsForDate.map((log) => {
                    // 判断作业类型，决定背景渐变色和图标
                    const getWorkCategoryStyles = () => {
                      if (log.workCategory === 'jira') {
                        return {
                          gradient: 'from-orange-50/60 to-red-50/60',
                          border: 'border-orange-100/40',
                          icon: <MessageSquare className="w-5 h-5 text-orange-600" />,
                          badge: 'bg-gradient-to-r from-orange-500 to-red-600 text-white',
                          label: '保守对应（JIRA/チャット）'
                        };
                      } else if (log.workCategory === 'management') {
                        return {
                          gradient: 'from-green-50/60 to-emerald-50/60',
                          border: 'border-green-100/40',
                          icon: <Users className="w-5 h-5 text-green-600" />,
                          badge: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
                          label: '保守对应（管理）'
                        };
                      } else if (log.workCategory === 'innovation') {
                        return {
                          gradient: 'from-cyan-50/60 to-blue-50/60',
                          border: 'border-cyan-100/40',
                          icon: <Lightbulb className="w-5 h-5 text-cyan-600" />,
                          badge: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
                          label: '成长与创新'
                        };
                      } else {
                        return {
                          gradient: 'from-indigo-50/40 to-purple-50/40',
                          border: 'border-indigo-100/30',
                          icon: <CheckCircle2 className="w-5 h-5 text-indigo-600" />,
                          badge: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
                          label: '一般案件对应'
                        };
                      }
                    };
                    
                              const styles = getWorkCategoryStyles();
                    
                    return (
                      <div
                        key={log.id}
                        className={`backdrop-blur-xl bg-gradient-to-r ${styles.gradient} rounded-2xl p-5 shadow-xl border ${styles.border} hover:shadow-2xl transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* 分类图标 */}
                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                              <div className="p-2 backdrop-blur-lg bg-white/80 rounded-lg shadow-md">
                                {styles.icon}
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${styles.badge} font-semibold`}>
                                {log.workCategory === 'jira' ? 'JIRA/Chat' : log.workCategory === 'management' ? '管理' : log.workCategory === 'innovation' ? '创新' : '开发'}
                              </span>
                            </div>
                            
                            <div className="h-16 w-px bg-gray-300"></div>
                  
                  {/* 主要内容 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* 项目组 */}
                      <span className="text-xs px-2.5 py-1 bg-teal-100 text-teal-700 rounded-lg font-bold border border-teal-200">
                        {log.projectGroup}
                      </span>
                      <span className="text-gray-400">·</span>
                      <h3 className="font-semibold text-gray-800 text-base">{log.project}</h3>
                      
                      {/* 一般案件：显示工程 */}
                      {log.phase !== '-' && (
                        <>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-medium">{log.phase}</span>
                        </>
                      )}
                      
                      {/* JIRA/チャット对应：显示类型和号码 */}
                      {log.workCategory === 'jira' && log.subType && (
                        <>
                          <span className="text-gray-400">|</span>
                          <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg font-medium">{log.subType}</span>
                          {log.jiraNumber && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className="text-xs px-2.5 py-1 bg-white/80 text-orange-800 rounded-lg font-bold border border-orange-200">
                                {log.jiraNumber}
                              </span>
                            </>
                          )}
                        </>
                      )}
                      
                      {/* 管理对应：显示类型和主题 */}
                      {log.workCategory === 'management' && log.subType && (
                        <>
                          <span className="text-gray-400">|</span>
                          <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg font-medium flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {log.subType}
                          </span>
                          {log.jiraNumber && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className="text-xs px-2.5 py-1 bg-white/80 text-green-800 rounded-lg font-bold border border-green-200">
                                {log.jiraNumber}
                              </span>
                            </>
                          )}
                        </>
                      )}
                      
                      {/* 成长与创新：显示类型和主题 */}
                      {log.workCategory === 'innovation' && log.subType && (
                        <>
                          <span className="text-gray-400">|</span>
                          <span className="text-xs px-2.5 py-1 bg-cyan-100 text-cyan-700 rounded-lg font-medium flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" />
                            {log.subType}
                          </span>
                          {log.jiraNumber && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className="text-xs px-2.5 py-1 bg-white/80 text-cyan-800 rounded-lg font-bold border border-cyan-200">
                                {log.jiraNumber}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* 作业内容描述 */}
                    <p className="text-sm text-gray-700 mb-1 pl-1">{log.description}</p>
                    
                    {/* 修改时间标记 */}
                    {log.modifiedAt && (
                      <div className="flex items-center gap-1 text-xs text-orange-600 pl-1">
                        <History className="w-3 h-3" />
                        <span>修改于 {log.modifiedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 右侧：时间和操作 */}
                <div className="flex items-center gap-6">
                  <div className="text-sm text-gray-600 min-w-[140px]">
                    <Clock className="w-4 h-4 inline mr-1" />
                    <span className="font-medium">{log.startTime} - {log.endTime}</span>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className={`px-3 py-1 rounded-lg text-sm mb-1 inline-block font-medium ${
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
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}
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
  // ADD_DIALOG_MARKER
  const [workCategory, setWorkCategory] = useState<'normal' | 'jira' | 'management' | 'innovation'>('normal');
  const [workType, setWorkType] = useState<'通常' | '残業' | '休日'>('通常');
  const [projectGroup, setProjectGroup] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [jiraNumber, setJiraNumber] = useState('');  // 用于JIRA号码和管理工作主题（统一UI）
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // [AddDialog] 时间选择 - 改为数组存储多个选中的时间段
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
  const innovationTypes = [
    '技术预研：学习 AI 工具、新框架、解决疑难 Bug 的新技术方案等。',
    '管理与文化：公司年会策划、团队分享会、内政事务支持等。',
    '职业进修：语言学习、考证准备、专业技能培训等。',
    '效率工具开发：针对日常重复工作的自动化脚本或小工具开发等。'
  ];
  // ADD_MANAGEMENT_INPUT_MARKER

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
          {/* ADD_DIALOG_CONTENT - 日期选择 */}
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
            <div className="grid grid-cols-4 gap-3">
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
              
              {/* 新增：成长与创新按钮 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setWorkCategory('innovation')}
                    className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap relative ${
                      workCategory === 'innovation'
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl scale-105 border-cyan-500 transform'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Lightbulb className="w-4 h-4" />
                      <div className="text-base font-bold">成长与创新</div>
                      <Info className="w-3 h-3 opacity-60" />
                    </div>
                    <div className="text-xs opacity-90">个人成长与探索</div>
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-cyan-500/95 to-blue-600/95 text-white border border-white/20 shadow-2xl p-4"
                  sideOffset={8}
                >
                  <div className="space-y-3 text-left">
                    <div className="font-bold text-base border-b border-white/30 pb-2">
                      ■ 关于"成长与创新"分类的使用说明
                    </div>
                    <p className="text-xs leading-relaxed">
                      持续的自我进化是团队核心竞争力的源泉。本分类用于记录员工在完成业务交付之余，为提升专业深度、探索前沿技术（如 AI 应用）及建设企业文化所投入的时间。
                    </p>
                    <div>
                      <div className="font-semibold text-sm mb-1.5">记录原则：</div>
                      <div className="space-y-1 text-xs pl-3">
                        <div>① <span className="font-semibold">自主性：</span> 鼓励探索与当前业务相关的技术前沿或公司组织的专项活动。</div>
                        <div>② <span className="font-semibold">透明性：</span> 请在"作业内容"中记录具体活动（例如：AI提效实践 或 XX 模块代码重构方案调研）。</div>
                        <div>③ <span className="font-semibold">价值导向：</span> 今天的个人成长即是明天部门创新的基石。</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1.5">管理细则：</div>
                      <div className="space-y-1 text-xs pl-3">
                        <div>① <span className="font-semibold">弹性时长：</span> 项目组提倡"精进不辍"。原则上，建议每位成员每月在此项投入的时间比例为总工数的 5%（暂定约 8 小时）。</div>
                        <div>② <span className="font-semibold">成果共享：</span> 鼓励"一人所得，全员受益"。在本分类下产生的学习心得、AI 提效工具、或技术调研报告，将通过文档化，分享会的方式沉淀。</div>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ADD_DIALOG_CATEGORIES - 根据作业分类显示不同内容 */}
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
              <div className="grid grid-cols-5 gap-2 mb-3">
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
              {selectedSubType && (
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">
                    会议主题/管理工作名称 <span className="text-gray-400">(可选)</span>
                  </label>
                  <Input
                    value={jiraNumber}
                    onChange={(e) => setJiraNumber(e.target.value)}
                    placeholder="例：Q1项目复盘会议、新员工入职培训..."
                    className="backdrop-blur-lg bg-white/80 border-white/50"
                  />
                </div>
              )}
            </div>
          )}

          {workCategory === 'innovation' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-violet-50/80 to-blue-50/80 rounded-xl p-3 border border-violet-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">成长与创新类型</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {innovationTypes.map((type) => {
                  const typeName = type.split('：')[0];
                  const typeDesc = type.split('：')[1];
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(typeName)}
                      className={`px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-left ${
                        selectedSubType === typeName
                          ? 'bg-gradient-to-r from-violet-500 to-blue-600 text-white shadow-lg scale-105'
                          : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                      }`}
                    >
                      <div className="text-sm font-bold mb-0.5">{typeName}</div>
                      <div className="text-xs opacity-75 leading-tight">{typeDesc}</div>
                    </button>
                  );
                })}
              </div>
              {selectedSubType && (
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">
                    活动主题 <span className="text-gray-400">(可选)</span>
                  </label>
                  <Input
                    value={jiraNumber}
                    onChange={(e) => setJiraNumber(e.target.value)}
                    placeholder={
                      selectedSubType === '技术预研' ? '例：探索 ChatGPT API 在代码审查中的应用...' :
                      selectedSubType === '管理与文化' ? '例：组织部门团建活动、年会策划...' :
                      selectedSubType === '职业进修' ? '例：AWS 认证备考、日语 N2 学习...' :
                      selectedSubType === '效率工具开发' ? '例：自动化部署脚本优化、工时填报助手...' :
                      '输入活动主题...'
                    }
                    className="backdrop-blur-lg bg-white/80 border-white/50"
                  />
                </div>
              )}
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
              placeholder={
                workCategory === 'innovation' 
                  ? '请简要描述您的提升内容或产出（例如：AI提效实践，XX系统重构调研）'
                  : '请输入作业内容描述...'
              }
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
  // EDIT_DIALOG_MARKER - Similar structure to AddWorkLogDialog but pre-filled with log data
  if (!log) return null;
  // EDIT_DIALOG_START

  const [workCategory, setWorkCategory] = useState<'normal' | 'jira' | 'management' | 'innovation'>(log.category || 'normal');
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
  const innovationTypes = [
    '技术预研：学习 AI 工具、新框架、解决疑难 Bug 的新技术方案等。',
    '管理与文化：公司年会策划、团队分享会、内政事务支持等。',
    '职业进修：语言学习、考证准备、专业技能培训等。',
    '效率工具开发：针对日常重复工作的自动化脚本或小工具开发等。'
  ];
  // EDITDIALOG_VARS

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
          {/* EDITDIALOG_CONTENT - 日期选择 */}
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
            <div className="grid grid-cols-4 gap-3">
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
              
              {/* 新增：成长与创新按钮 */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setWorkCategory('innovation')}
                    className={`p-3 rounded-xl transition-all duration-300 font-medium border-2 shadow-lg whitespace-nowrap relative ${
                      workCategory === 'innovation'
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl scale-105 border-cyan-500 transform'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white hover:scale-102 border-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Lightbulb className="w-4 h-4" />
                      <div className="text-base font-bold">成长与创新</div>
                      <Info className="w-3 h-3 opacity-60" />
                    </div>
                    <div className="text-xs opacity-90">个人成长与探索</div>
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-cyan-500/95 to-blue-600/95 text-white border border-white/20 shadow-2xl p-4"
                  sideOffset={8}
                >
                  <div className="space-y-3 text-left">
                    <div className="font-bold text-base border-b border-white/30 pb-2">
                      ■ 关于"成长与创新"分类的使用说明
                    </div>
                    <p className="text-xs leading-relaxed">
                      持续的自我进化是团队核心竞争力的源泉。本分类用于记录员工在完成业务交付之余，为提升专业深度、探索前沿技术（如 AI 应用）及建设企业文化所投入的时间。
                    </p>
                    <div>
                      <div className="font-semibold text-sm mb-1.5">记录原则：</div>
                      <div className="space-y-1 text-xs pl-3">
                        <div>① <span className="font-semibold">自主性：</span> 鼓励探索与当前业务相关的技术前沿或公司组织的专项活动。</div>
                        <div>② <span className="font-semibold">透明性：</span> 请在"作业内容"中记录具体活动（例如：AI提效实践 或 XX 模块代码重构方案调研）。</div>
                        <div>③ <span className="font-semibold">价值导向：</span> 今天的个人成长即是明天部门创新的基石。</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1.5">管理细则：</div>
                      <div className="space-y-1 text-xs pl-3">
                        <div>① <span className="font-semibold">弹性时长：</span> 项目组提倡"精进不辍"。原则上，建议每位成员每月在此项投入的时间比例为总工数的 5%（暂定约 8 小时）。</div>
                        <div>② <span className="font-semibold">成果共享：</span> 鼓励"一人所得，全员受益"。在本分类下产生的学习心得、AI 提效工具、或技术调研报告，将通过文档化，分享会的方式沉淀。</div>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* EDITDIALOG_CATEGORIES - 根据作业分类显示不同内容 */}
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
              <div className="grid grid-cols-5 gap-2 mb-3">
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
              {selectedSubType && (
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">
                    会议主题/管理工作名称 <span className="text-gray-400">(可选)</span>
                  </label>
                  <Input
                    value={jiraNumber}
                    onChange={(e) => setJiraNumber(e.target.value)}
                    placeholder="例：Q1项目复盘会议、新员工入职培训..."
                    className="backdrop-blur-lg bg-white/80 border-white/50"
                  />
                </div>
              )}
            </div>
          )}

          {workCategory === 'innovation' && (
            <div className="backdrop-blur-lg bg-gradient-to-r from-violet-50/80 to-blue-50/80 rounded-xl p-3 border border-violet-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">成长与创新类型</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {innovationTypes.map((type) => {
                  const typeName = type.split('：')[0];
                  const typeDesc = type.split('：')[1];
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedSubType(typeName)}
                      className={`px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-left ${
                        selectedSubType === typeName
                          ? 'bg-gradient-to-r from-violet-500 to-blue-600 text-white shadow-lg scale-105'
                          : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                      }`}
                    >
                      <div className="text-sm font-bold mb-0.5">{typeName}</div>
                      <div className="text-xs opacity-75 leading-tight">{typeDesc}</div>
                    </button>
                  );
                })}
              </div>
              {selectedSubType && (
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">
                    活动主题 <span className="text-gray-400">(可选)</span>
                  </label>
                  <Input
                    value={jiraNumber}
                    onChange={(e) => setJiraNumber(e.target.value)}
                    placeholder={
                      selectedSubType === '技术预研' ? '例：探索 ChatGPT API 在代码审查中的应用...' :
                      selectedSubType === '管理与文化' ? '例：组织部门团建活动、年会策划...' :
                      selectedSubType === '职业进修' ? '例：AWS 认证备考、日语 N2 学习...' :
                      selectedSubType === '效率工具开发' ? '例：自动化部署脚本优化、工时填报助手...' :
                      '输入活动主题...'
                    }
                    className="backdrop-blur-lg bg-white/80 border-white/50"
                  />
                </div>
              )}
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
  // 统计时间范围 - 默认使用当前薪资周期
  const getCurrentSalaryPeriod = () => {
    const now = new Date();
    const currentDay = now.getDate();
    
    let start: Date, end: Date;
    
    if (currentDay >= 21) {
      start = new Date(now.getFullYear(), now.getMonth(), 21);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 20);
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 21);
      end = new Date(now.getFullYear(), now.getMonth(), 20);
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const salaryPeriod = getCurrentSalaryPeriod();
  const [statsStartDate, setStatsStartDate] = useState(salaryPeriod.start);
  const [statsEndDate, setStatsEndDate] = useState(salaryPeriod.end);

  // 计算统计数据
  const calculateStats = () => {
    const filteredLogs = SAMPLE_WORK_LOGS.filter(log => 
      log.date >= statsStartDate && log.date <= statsEndDate
    );

    // 总工时
    const totalHours = filteredLogs.reduce((sum, log) => sum + log.hours, 0);

    // 工作天数
    const workDays = new Set(filteredLogs.map(log => log.date)).size;

    // 平均每日工时
    const avgHours = workDays > 0 ? totalHours / workDays : 0;

    // 加班工时（假设超过8小时的部分为加班）
    const dailyHours = new Map<string, number>();
    filteredLogs.forEach(log => {
      const current = dailyHours.get(log.date) || 0;
      dailyHours.set(log.date, current + log.hours);
    });
    const overtimeHours = Array.from(dailyHours.values()).reduce(
      (sum, hours) => sum + Math.max(0, hours - 8), 0
    );

    // 按作业分类统计
    const categoryStats = new Map<string, number>();
    filteredLogs.forEach(log => {
      const current = categoryStats.get(log.workCategory) || 0;
      categoryStats.set(log.workCategory, current + log.hours);
    });

    // 按项目组统计
    const projectGroupStats = new Map<string, number>();
    filteredLogs.forEach(log => {
      const current = projectGroupStats.get(log.projectGroup) || 0;
      projectGroupStats.set(log.projectGroup, current + log.hours);
    });

    // 按项目统计（Top 5）
    const projectStats = new Map<string, number>();
    filteredLogs.forEach(log => {
      const current = projectStats.get(log.project) || 0;
      projectStats.set(log.project, current + log.hours);
    });
    const topProjects = Array.from(projectStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalHours,
      avgHours,
      overtimeHours,
      workDays,
      categoryStats,
      projectGroupStats,
      topProjects,
    };
  };

  const stats = calculateStats();

  // 作业分类饼图数据
  const categoryData = [
    { name: '一般案件对应', value: stats.categoryStats.get('normal') || 0, color: '#8b5cf6' },
    { name: 'JIRA/チャット', value: stats.categoryStats.get('jira') || 0, color: '#f97316' },
    { name: '保守对应（管理）', value: stats.categoryStats.get('management') || 0, color: '#10b981' },
    { name: '成长与创新', value: stats.categoryStats.get('innovation') || 0, color: '#06b6d4' },
  ].filter(item => item.value > 0);

  // 项目组柱状图数据
  const projectGroupData = Array.from(stats.projectGroupStats.entries()).map(([name, value]) => ({
    name,
    hours: value,
  }));

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/95 p-3 rounded-lg shadow-xl border border-purple-200">
          <p className="text-sm font-bold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-purple-600 font-semibold">
            {payload[0].value.toFixed(1)}小时
            {stats.totalHours > 0 && (
              <span className="text-xs text-gray-600 ml-1">
                ({((payload[0].value / stats.totalHours) * 100).toFixed(1)}%)
              </span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            工时统计分析
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            查看指定时间范围内的详细工时统计数据，包括作业分类、项目分布等多维度分析
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          {/* 时间范围选择 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-2xl p-4 border border-purple-100/50 shadow-lg">
            <label className="flex items-center gap-2 text-sm mb-3 text-gray-800 font-bold">
              <CalendarIcon className="w-4 h-4 text-purple-600" />
              统计时间范围
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">开始日期</label>
                <Input
                  type="date"
                  value={statsStartDate}
                  onChange={(e) => setStatsStartDate(e.target.value)}
                  className="backdrop-blur-lg bg-white/90 border-purple-200 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 text-gray-600 font-semibold">结束日期</label>
                <Input
                  type="date"
                  value={statsEndDate}
                  onChange={(e) => setStatsEndDate(e.target.value)}
                  className="backdrop-blur-lg bg-white/90 border-purple-200 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 核心指标卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-5 border border-blue-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-700 font-semibold">总工时</p>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-blue-600 mb-1">{stats.totalHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-600">统计期间累计工时</p>
            </div>
            
            <div className="backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-5 border border-green-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-700 font-semibold">平均每日</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-600 mb-1">{stats.avgHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-600">日均工作时长</p>
            </div>
            
            <div className="backdrop-blur-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-5 border border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-700 font-semibold">加班工时</p>
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-4xl font-bold text-orange-600 mb-1">{stats.overtimeHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-600">超过8小时/天的部分</p>
            </div>
            
            <div className="backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-5 border border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-700 font-semibold">工作天数</p>
                <CalendarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-purple-600 mb-1">{stats.workDays}天</p>
              <p className="text-xs text-gray-600">有记录的工作日</p>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 作业分类饼图 */}
            <div className="backdrop-blur-lg bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-2xl p-5 border border-indigo-100/50 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-gray-800">作业分类工时分布</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 项目组柱状图 */}
            <div className="backdrop-blur-lg bg-gradient-to-br from-teal-50/80 to-cyan-50/80 rounded-2xl p-5 border border-teal-100/50 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-gray-800">项目组工时统计</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={projectGroupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="backdrop-blur-xl bg-white/95 p-3 rounded-lg shadow-xl border border-teal-200">
                            <p className="text-sm font-bold text-gray-800">{payload[0].payload.name}</p>
                            <p className="text-sm text-teal-600 font-semibold">
                              {payload[0].value?.toFixed(1)}小时
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="hours" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 项目工时明细 */}
          <div className="backdrop-blur-lg bg-gradient-to-br from-pink-50/80 to-rose-50/80 rounded-2xl p-5 border border-pink-100/50 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-pink-600" />
              <h3 className="text-sm font-bold text-gray-800">Top 5 项目工时明细</h3>
            </div>
            <div className="space-y-3">
              {stats.topProjects.map(([project, hours], index) => {
                const percentage = (hours / stats.totalHours) * 100;
                return (
                  <div key={project} className="relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-800 font-medium">{project}</span>
                      </div>
                      <span className="text-sm font-bold text-pink-600">
                        {hours.toFixed(1)}h ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 作业分类详细数据 */}
          <div className="grid grid-cols-4 gap-3">
            {categoryData.map((category) => {
              const percentage = (category.value / stats.totalHours) * 100;
              return (
                <div
                  key={category.name}
                  className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-gray-200/50 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <p className="text-xs text-gray-700 font-semibold">{category.name}</p>
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ color: category.color }}>
                    {category.value.toFixed(1)}h
                  </p>
                  <p className="text-xs text-gray-600">
                    占比 {percentage.toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200/50">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="backdrop-blur-lg bg-white/70 px-6 py-2 hover:bg-white/90"
          >
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}