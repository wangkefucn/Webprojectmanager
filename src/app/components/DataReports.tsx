import { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, FolderKanban, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from './ui/button';

interface DataReportsProps {
  user: { name: string; role: string; department: string };
}

export function DataReports({ user }: DataReportsProps) {
  // Helper function to format date to local YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 时间范围选择，默认本年1月1日到本月最后一天
  const today = new Date();
  const firstDayOfYear = formatDate(new Date(today.getFullYear(), 0, 1));
  const lastDayOfMonth = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  const [startDate, setStartDate] = useState(firstDayOfYear);
  const [endDate, setEndDate] = useState(lastDayOfMonth);
  const [reportView, setReportView] = useState<'overview' | 'projects' | 'budget'>('overview');

  const overtimeByGroup = [
    { group: '项目组A', hours: 45.5 },
    { group: '项目组B', hours: 32.0 },
    { group: '项目组C', hours: 28.5 },
  ];

  const leaveByType = [
    { type: '年假', hours: 56, days: 7 },
    { type: '病假', hours: 16, days: 2 },
    { type: '事假', hours: 24, days: 3 },
    { type: '调休', hours: 8, days: 1 },
  ];

  const topOvertimeByProject = [
    {
      project: '项目A',
      top3: [
        { name: '张三', hours: 18.5 },
        { name: '李四', hours: 15.0 },
        { name: '王五', hours: 12.0 },
      ]
    },
    {
      project: '项目B',
      top3: [
        { name: '赵六', hours: 14.5 },
        { name: '钱七', hours: 11.0 },
        { name: '孙八', hours: 6.5 },
      ]
    },
    {
      project: '项目C',
      top3: [
        { name: '周九', hours: 13.0 },
        { name: '吴十', hours: 10.5 },
        { name: '郑一', hours: 5.0 },
      ]
    }
  ];

  // New: Project budget data by group
  const projectGroupBudget = [
    {
      group: '项目组A',
      projects: [
        { name: '项目A - ERP升级', budget: 200, actual: 145, percentage: 72.5, status: 'normal' },
        { name: 'Enhance - 维护', budget: 50, actual: 106.5, percentage: 213, status: 'warning' },
      ],
      totalBudget: 250,
      totalActual: 251.5,
      conservativeBudget: 230, // 保守工数
      conservativeActual: 251.5,
    },
    {
      group: '项目组B',
      projects: [
        { name: '项目B - 移动端', budget: 150, actual: 95, percentage: 63.3, status: 'normal' },
        { name: '项目D - 小程序', budget: 80, actual: 45, percentage: 56.3, status: 'normal' },
      ],
      totalBudget: 230,
      totalActual: 140,
      conservativeBudget: 210,
      conservativeActual: 140,
    },
    {
      group: '项目组C',
      projects: [
        { name: '项目C - 数据中台', budget: 180, actual: 120, percentage: 66.7, status: 'normal' },
      ],
      totalBudget: 180,
      totalActual: 120,
      conservativeBudget: 170,
      conservativeActual: 120,
    },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

  const handleExport = () => {
    console.log('Exporting report for period:', startDate, 'to', endDate);
    // Export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">数据报表</h2>
            <p className="text-sm text-gray-600">查看和导出团队工时统计数据</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 rounded-xl backdrop-blur-lg bg-white/70 border border-white/30 text-gray-800 font-medium"
                />
                <span className="text-gray-600">至</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 rounded-xl backdrop-blur-lg bg-white/70 border border-white/30 text-gray-800 font-medium"
                />
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>导出Excel</span>
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2 bg-white/40 p-2 rounded-xl">
          <button
            onClick={() => setReportView('overview')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              reportView === 'overview'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            概览报表
          </button>
          <button
            onClick={() => setReportView('projects')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              reportView === 'projects'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            项目工时分析
          </button>
          <button
            onClick={() => setReportView('budget')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              reportView === 'budget'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            保守工数报表
          </button>
        </div>
      </div>

      {/* Overview View */}
      {reportView === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">总加班工时</p>
                  <p className="text-2xl font-bold text-gray-800">106.0 <span className="text-sm text-gray-600">小时</span></p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">总休假工时</p>
                  <p className="text-2xl font-bold text-gray-800">104.0 <span className="text-sm text-gray-600">小时</span></p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">团队总人数</p>
                  <p className="text-2xl font-bold text-gray-800">24 <span className="text-sm text-gray-600">人</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overtime by Group */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">加班工时分布（按项目组）</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overtimeByGroup}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="group" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(200, 200, 200, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="hours" name="加班工时 (小时)" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Leave by Type */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">休假工时分布（按类型）</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="60%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveByType}
                      dataKey="hours"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.type}: ${entry.hours}h`}
                    >
                      {leaveByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(200, 200, 200, 0.3)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {leaveByType.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.type}</p>
                        <p className="text-xs text-gray-600">{item.days} 天 / {item.hours} 小时</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Overtime by Project */}
          <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">各项目加班 Top3 员工</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topOvertimeByProject.map((projectData, index) => (
                <div key={index} className="space-y-3">
                  <div className="backdrop-blur-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl p-4 border border-white/30">
                    <h4 className="font-semibold text-gray-800 text-center">{projectData.project}</h4>
                  </div>
                  <div className="space-y-2">
                    {projectData.top3.map((employee, idx) => (
                      <div
                        key={idx}
                        className="backdrop-blur-lg bg-white/70 rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white
                              ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : ''}
                              ${idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : ''}
                              ${idx === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' : ''}
                            `}>
                              {idx + 1}
                            </div>
                            <span className="font-medium text-gray-800">{employee.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-indigo-600">{employee.hours}</p>
                            <p className="text-xs text-gray-600">小时</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Projects Budget View */}
      {reportView === 'projects' && (
        <div className="space-y-6">
          <h3 className="text-xl text-gray-800">各项目组案件工时预实际分析</h3>
          {projectGroupBudget.map((group, groupIndex) => (
            <div key={groupIndex} className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">{group.group}</h4>
                    <p className="text-sm text-gray-600">总预算: {group.totalBudget}MD / 实际: {group.totalActual}MD</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    group.totalActual > group.totalBudget ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {((group.totalActual / group.totalBudget) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {group.projects.map((project, projectIndex) => (
                  <div key={projectIndex} className="backdrop-blur-lg bg-white/70 rounded-2xl p-4 border border-white/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {project.status === 'warning' && (
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-semibold text-gray-800">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          预算: <span className="font-bold">{project.budget}MD</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          实际: <span className="font-bold">{project.actual}MD</span>
                        </span>
                        <span className={`text-sm font-bold ${
                          project.percentage > 100 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {project.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.percentage > 100
                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600'
                        }`}
                        style={{ width: `${Math.min(project.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conservative Budget View */}
      {reportView === 'budget' && (
        <div className="space-y-6">
          <h3 className="text-xl text-gray-800">各项目组保守工数预实际分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectGroupBudget.map((group, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">{group.group}</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="backdrop-blur-lg bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">保守工数预算</p>
                    <p className="text-3xl font-bold text-indigo-600">{group.conservativeBudget} <span className="text-sm">MD</span></p>
                  </div>
                  
                  <div className="backdrop-blur-lg bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">实际使用</p>
                    <p className="text-3xl font-bold text-orange-600">{group.conservativeActual} <span className="text-sm">MD</span></p>
                  </div>
                  
                  <div className="backdrop-blur-lg bg-white/50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">完成度</p>
                    <p className={`text-3xl font-bold ${
                      group.conservativeActual > group.conservativeBudget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {((group.conservativeActual / group.conservativeBudget) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      group.conservativeActual > group.conservativeBudget
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                    }`}
                    style={{ width: `${Math.min((group.conservativeActual / group.conservativeBudget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Data Table */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">详细数据一览</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left p-4 text-sm font-semibold text-gray-700">员工姓名</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">部门</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">加班工时</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">休假天数</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">项目工时</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '张三', dept: '研发一部', overtime: 18.5, leave: 3, project: 145.5 },
                { name: '李四', dept: '研发一部', overtime: 15.0, leave: 0, project: 160.0 },
                { name: '王五', dept: '研发二部', overtime: 12.0, leave: 2, project: 140.0 },
                { name: '赵六', dept: '研发二部', overtime: 14.5, leave: 1, project: 155.0 },
                { name: '钱七', dept: '研发一部', overtime: 11.0, leave: 0, project: 165.0 },
              ].map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-white/20 hover:bg-white/40 transition-colors duration-200"
                >
                  <td className="p-4 font-medium text-gray-800">{row.name}</td>
                  <td className="p-4 text-gray-600">{row.dept}</td>
                  <td className="p-4 text-right font-semibold text-blue-600">{row.overtime}h</td>
                  <td className="p-4 text-right font-semibold text-purple-600">{row.leave}天</td>
                  <td className="p-4 text-right font-semibold text-green-600">{row.project}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}