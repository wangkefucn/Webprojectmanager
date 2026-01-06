import { useState } from 'react';
import { Plus, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Users, Edit, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Save } from 'lucide-react';

interface ProjectManagementProps {
  user: { name: string; role: string; department: string };
}

// 完整的22个工程列表
const ALL_PHASES = [
  '概要設計',
  '方式设计',
  '基本設計',
  '詳細設計',
  '開発',
  '単体测试准备',
  '単体测试实施',
  '連結测试（内部）准备',
  '連結测试（内部）实施',
  '連結测试（外部）准备',
  '連結测试（外部）实施',
  '系统间测试准备',
  '系统间测试实施',
  '综合测试准备',
  '综合测试实施',
  '性能测试准备',
  '性能测试实施',
  '发布演练准备',
  '发布演练实施',
  '生产发布准备',
  '生产发布实施',
  '经理（案件推进）',
  '缓冲',
];

export function ProjectManagement({ user }: ProjectManagementProps) {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'condition' | 'member' | 'conservative'>('condition');
  const [expandedProject, setExpandedProject] = useState<string | null>('project-a');
  
  // Helper function to format date to local YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 筛选条件 - 默认时间为本年1月1日到本月最后一天，案件名默认为"全部"
  const today = new Date();
  const firstDayOfYear = formatDate(new Date(today.getFullYear(), 0, 1));
  const lastDayOfMonth = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  
  const [filters, setFilters] = useState({
    projectGroup: '',
    caseName: '全部',
    member: '',
    startDate: firstDayOfYear,
    endDate: lastDayOfMonth
  });

  // 模拟人员数据
  const allMembers = [
    {
      id: 'member-1',
      name: '宋永赛',
      department: '开发部',
      workData: {
        '项目组A': {
          projects: [
            { name: '项目A - ERP系统升级', hours: 28.6, phases: { '概要設計': 8, '詳細設計': 12, '開発': 8.6 } }
          ],
          conservative: 5.5
        },
        '项目组B': {
          projects: [
            { name: '项目B - 移动端开发', hours: 12.0, phases: { '開発': 12 } }
          ],
          conservative: 2.0
        }
      }
    },
    {
      id: 'member-2',
      name: '张三',
      department: '开发部',
      workData: {
        '项目组A': {
          projects: [
            { name: '项目A - ERP系统升级', hours: 27.4, phases: { '詳細設計': 10, '開発': 17.4 } }
          ],
          conservative: 3.5
        }
      }
    },
    {
      id: 'member-3',
      name: '阮佩诗',
      department: '测试部',
      workData: {
        '项目组B': {
          projects: [
            { name: '项目B - 移动端开发', hours: 28.5, phases: { '単体测试准备': 10, '単体测试实施': 18.5 } }
          ],
          conservative: 4.5
        }
      }
    },
    {
      id: 'member-4',
      name: '李四',
      department: '开发部',
      workData: {
        '项目组A': {
          projects: [
            { name: '项目A - ERP系统升级', hours: 24.9, phases: { '開発': 15, '単体测试准备': 9.9 } }
          ],
          conservative: 6.0
        }
      }
    },
    {
      id: 'member-5',
      name: '王五',
      department: '开发部',
      workData: {
        '项目组A': {
          projects: [
            { name: '项目A - ERP系统升级', hours: 28.0, phases: { '開発': 19.5, '単体测试实施': 8.5 } }
          ],
          conservative: 4.0
        }
      }
    }
  ];

  const projects = [
    {
      id: 'project-a',
      name: '项目A - ERP系统升级',
      group: '项目组A',
      leader: '王经理',
      members: ['宋永赛', '张三', '李四', '王五', '赵六'],
      totalBudget: 200,
      used: 145,
      percentage: 72.5,
      status: 'normal',
      phases: {
        '概要設計': { budget: 30, used: 28 },
        '詳細設計': { budget: 40, used: 35 },
        '開発': { budget: 80, used: 60 },
        '単体测试准备': { budget: 15, used: 10 },
        '単体测试实施': { budget: 15, used: 5 },
        '連結测试（内部）实施': { budget: 20, used: 7 },
      }
    },
    {
      id: 'project-b',
      name: '项目B - 移动端开发',
      group: '项目组B',
      leader: '李经理',
      members: ['阮佩诗', '陈七', '周八'],
      totalBudget: 150,
      used: 95,
      percentage: 63.3,
      status: 'normal',
      phases: {
        '概要設計': { budget: 25, used: 25 },
        '詳細設計': { budget: 30, used: 30 },
        '開発': { budget: 60, used: 35 },
        '単体测试准备': { budget: 15, used: 3 },
        '単体测试实施': { budget: 10, used: 2 },
        '連結测试（内部）准备': { budget: 10, used: 0 },
      }
    },
    {
      id: 'project-enhance',
      name: 'Enhance - 维护项目',
      group: 'Enhance',
      leader: '张经理',
      members: ['刘九', '孙十', '郑十一', '钱十二'],
      totalBudget: 50,
      used: 106.5,
      percentage: 213,
      status: 'warning',
      phases: {
        '開発': { budget: 30, used: 65 },
        '単体测试实施': { budget: 20, used: 41.5 },
      }
    }
  ];

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowEditProjectDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">项目工时管理</h2>
            <p className="text-sm text-gray-600">管理项目预算和工时分配</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBudgetDialog(true)}
              className="flex items-center gap-2 px-6 py-3 backdrop-blur-lg bg-white/70 border border-white/30 text-gray-700 rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <TrendingUp className="w-5 h-5" />
              <span>保守工数设定</span>
            </button>
            <button
              onClick={() => setShowNewProjectDialog(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>新建案件</span>
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2 bg-white/40 p-2 rounded-xl mb-6">
          <button
            onClick={() => setViewMode('condition')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              viewMode === 'condition'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            项目别
          </button>
          <button
            onClick={() => setViewMode('member')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              viewMode === 'member'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            人员别
          </button>
          <button
            onClick={() => setViewMode('conservative')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              viewMode === 'conservative'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            保守
          </button>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-lg bg-white/40 rounded-2xl p-5 border border-white/30">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">筛选条件</h3>
          </div>
          <div className={`grid ${viewMode === 'member' ? 'grid-cols-5' : 'grid-cols-4'} gap-4`}>
            <div>
              <label className="block text-sm mb-2 text-gray-700">项目组</label>
              <select
                value={filters.projectGroup}
                onChange={(e) => setFilters({ ...filters, projectGroup: e.target.value })}
                className="w-full px-4 py-2 backdrop-blur-lg bg-white/70 border border-white/30 rounded-lg text-gray-800"
              >
                <option value="">全部</option>
                <option value="项目组A">项目组A</option>
                <option value="项目组B">项目组B</option>
                <option value="项目组C">项目组C</option>
                <option value="Enhance">Enhance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">案件名</label>
              <Input
                value={filters.caseName}
                onChange={(e) => setFilters({ ...filters, caseName: e.target.value })}
                placeholder="搜索案件..."
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
            {/* 人员筛选只在"人员别"视图中显示 */}
            {viewMode === 'member' && (
              <div>
                <label className="block text-sm mb-2 text-gray-700">人员</label>
                <select
                  value={filters.member}
                  onChange={(e) => setFilters({ ...filters, member: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-lg bg-white/70 border border-white/30 rounded-lg text-gray-800"
                >
                  <option value="">全部</option>
                  <option value="宋永赛">宋永赛</option>
                  <option value="张三">张三</option>
                  <option value="阮佩诗">阮佩诗</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm mb-2 text-gray-700">开始日期</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">结束日期</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
          <p className="text-sm text-gray-600 mb-2">总案件数</p>
          <p className="text-4xl font-bold text-indigo-600">{projects.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
          <p className="text-sm text-gray-600 mb-2">总预算 (MD)</p>
          <p className="text-4xl font-bold text-green-600">{projects.reduce((sum, p) => sum + p.totalBudget, 0)}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
          <p className="text-sm text-gray-600 mb-2">已使用 (MD)</p>
          <p className="text-4xl font-bold text-orange-600">{projects.reduce((sum, p) => sum + p.used, 0).toFixed(1)}</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {viewMode === 'condition' && projects.map((project) => (
          <div
            key={project.id}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Project Header */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  {project.status === 'warning' && (
                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">{project.group}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">Leader: {project.leader}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{project.members.length} 人</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    title="修改案件"
                  >
                    <Edit className="w-5 h-5 text-indigo-600" />
                  </button>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">预算/实绩</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {project.used} / {project.totalBudget} <span className="text-sm text-gray-600">MD</span>
                    </p>
                    <p className={`text-sm font-semibold ${
                      project.percentage > 100 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {project.percentage.toFixed(1)}%
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                    className="p-2"
                  >
                    {expandedProject === project.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    project.percentage > 100
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  }`}
                  style={{ width: `${Math.min(project.percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Project Details - 项目别：显示工程明细 */}
            {expandedProject === project.id && (
              <div className="border-t border-white/20 p-6 bg-white/20">
                <h4 className="font-semibold text-gray-800 mb-4">工程明细（有预算的工程）</h4>
                <div className="space-y-3">
                  {Object.entries(project.phases).map(([phaseName, phaseData]: [string, any]) => {
                    const percentage = phaseData.budget > 0 ? Math.round((phaseData.used / phaseData.budget) * 100) : 0;
                    return (
                      <div
                        key={phaseName}
                        className="backdrop-blur-lg bg-white/70 rounded-2xl p-4 border border-white/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{phaseName}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                              {phaseData.used} / {phaseData.budget} MD
                            </span>
                            <span className={`text-sm font-bold ${
                              percentage > 100 ? 'text-red-600' : 'text-indigo-600'
                            }`}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              percentage > 100
                                ? 'bg-gradient-to-r from-red-400 to-red-500'
                                : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 人员别视图 */}
        {viewMode === 'member' && allMembers.map((member) => {
          // 计算该人员的总工时
          let totalHours = 0;
          let projectsHours = 0;
          let conservativeHours = 0;
          
          Object.values(member.workData).forEach((groupData: any) => {
            groupData.projects.forEach((proj: any) => {
              projectsHours += proj.hours;
              totalHours += proj.hours;
            });
            conservativeHours += groupData.conservative;
            totalHours += groupData.conservative;
          });

          return (
            <div
              key={member.id}
              className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {member.name.substring(0, 1)}
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">{member.department}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">一般案件: {projectsHours.toFixed(1)} MD</span>
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">保守: {conservativeHours.toFixed(1)} MD</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">期间总工时</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {totalHours.toFixed(1)} <span className="text-sm text-gray-600">MD</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedProject(expandedProject === member.id ? null : member.id)}
                      className="p-2"
                    >
                      {expandedProject === member.id ? (
                        <ChevronUp className="w-6 h-6 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar - 显示一般案件和保守的比例 */}
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    style={{ width: `${(projectsHours / totalHours) * 100}%` }}
                    title={`一般案件: ${projectsHours.toFixed(1)} MD`}
                  ></div>
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                    style={{ width: `${(conservativeHours / totalHours) * 100}%` }}
                    title={`保守: ${conservativeHours.toFixed(1)} MD`}
                  ></div>
                </div>
              </div>

              {/* 人员详细工时分布 */}
              {expandedProject === member.id && (
                <div className="border-t border-white/20 p-6 bg-white/20 space-y-4">
                  {/* 按项目组展示 */}
                  {Object.entries(member.workData).map(([groupName, groupData]: [string, any]) => (
                    <div key={groupName} className="space-y-3">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                        {groupName}
                      </h4>
                      
                      {/* 一般案件对应 */}
                      {groupData.projects.length > 0 && (
                        <div className="backdrop-blur-lg bg-white/70 rounded-2xl p-4 border border-white/30">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">一般案件对应</span>
                            <span className="text-lg font-bold text-indigo-600">
                              {groupData.projects.reduce((sum: number, p: any) => sum + p.hours, 0).toFixed(1)} MD
                            </span>
                          </div>
                          
                          {/* 各案件明细 */}
                          <div className="space-y-2">
                            {groupData.projects.map((project: any, idx: number) => (
                              <div key={idx} className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl p-3 border border-blue-100/30">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-800">{project.name}</span>
                                  <span className="text-base font-bold text-blue-600">{project.hours.toFixed(1)} MD</span>
                                </div>
                                
                                {/* 工程明细 */}
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                  {Object.entries(project.phases).map(([phaseName, phaseHours]: [string, any]) => (
                                    <div key={phaseName} className="bg-white/60 rounded-lg p-2 text-center">
                                      <div className="text-xs text-gray-600 mb-1">{phaseName}</div>
                                      <div className="text-sm font-bold text-indigo-600">{phaseHours} MD</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 保守对应 */}
                      {groupData.conservative > 0 && (
                        <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50/70 to-red-50/70 rounded-2xl p-4 border border-orange-100/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-semibold text-gray-700">保守对应</span>
                              <p className="text-xs text-gray-600 mt-0.5">JIRA/チャット/维护工作</p>
                            </div>
                            <span className="text-lg font-bold text-orange-600">{groupData.conservative.toFixed(1)} MD</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* 保守视图 */}
        {viewMode === 'conservative' && (
          <div className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">保守工数统计</h3>
            <div className="space-y-4">
              {/* 按项目组汇总保守工数 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-4 border border-blue-100/50">
                  <p className="text-sm text-gray-600 mb-2">项目组A</p>
                  <p className="text-3xl font-bold text-blue-600">25.5 MD</p>
                  <p className="text-xs text-gray-500 mt-1">JIRA/チャット对应</p>
                </div>
                <div className="backdrop-blur-lg bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-4 border border-green-100/50">
                  <p className="text-sm text-gray-600 mb-2">项目组B</p>
                  <p className="text-3xl font-bold text-green-600">18.0 MD</p>
                  <p className="text-xs text-gray-500 mt-1">维护和支持</p>
                </div>
                <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-4 border border-purple-100/50">
                  <p className="text-sm text-gray-600 mb-2">项目组C</p>
                  <p className="text-3xl font-bold text-purple-600">12.5 MD</p>
                  <p className="text-xs text-gray-500 mt-1">日常运维</p>
                </div>
                <div className="backdrop-blur-lg bg-gradient-to-r from-orange-50/80 to-amber-50/80 rounded-xl p-4 border border-orange-100/50">
                  <p className="text-sm text-gray-600 mb-2">Enhance</p>
                  <p className="text-3xl font-bold text-orange-600">106.5 MD</p>
                  <p className="text-xs text-gray-500 mt-1">保守项目</p>
                </div>
              </div>

              {/* 保守工作类型分布 */}
              <div className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30">
                <h4 className="font-semibold text-gray-800 mb-4">保守工作类型分布</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">JIRA对应</p>
                      <p className="text-xs text-gray-600">问题修复和功能调整</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">68.5 MD</p>
                      <p className="text-xs text-gray-600">42.2%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">チャット/メール对应</p>
                      <p className="text-xs text-gray-600">用户咨询和技术支持</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">45.0 MD</p>
                      <p className="text-xs text-gray-600">27.7%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">系统维护</p>
                      <p className="text-xs text-gray-600">日常运维和监控</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">49.0 MD</p>
                      <p className="text-xs text-gray-600">30.1%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 月度趋势 */}
              <div className="backdrop-blur-lg bg-white/70 rounded-2xl p-5 border border-white/30">
                <h4 className="font-semibold text-gray-800 mb-4">本月保守工数趋势</h4>
                <div className="grid grid-cols-7 gap-2">
                  {['第1周', '第2周', '第3周', '第4周'].map((week, index) => {
                    const weekHours = (30 + Math.random() * 20).toFixed(1);
                    return (
                      <div key={week} className="text-center p-3 bg-gradient-to-b from-indigo-50 to-purple-50 rounded-xl">
                        <p className="text-xs text-gray-600 mb-1">{week}</p>
                        <p className="text-xl font-bold text-indigo-600">{weekHours}</p>
                        <p className="text-xs text-gray-500">MD</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ProjectDialog 
        open={showNewProjectDialog} 
        onClose={() => setShowNewProjectDialog(false)}
        project={null}
      />
      <ProjectDialog 
        open={showEditProjectDialog} 
        onClose={() => { setShowEditProjectDialog(false); setEditingProject(null); }}
        project={editingProject}
      />
      <BudgetDialog open={showBudgetDialog} onClose={() => setShowBudgetDialog(false)} />
    </div>
  );
}

function ProjectDialog({ open, onClose, project }: { open: boolean; onClose: () => void; project?: any }) {
  const isEditing = !!project;
  
  const [formData, setFormData] = useState({
    projectGroup: project?.group || '',
    name: project?.name || '',
    leader: project?.leader || '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  // 22个工程的预算，使用对象存储
  const [phaseBudgets, setPhaseBudgets] = useState<Record<string, string>>(
    project?.phases 
      ? Object.fromEntries(Object.entries(project.phases).map(([name, data]: [string, any]) => [name, data.budget.toString()]))
      : {}
  );

  const projectGroups = ['项目组A', '项目组B', '项目组C', 'Enhance'];

  const handleSubmit = () => {
    console.log('Project data:', { ...formData, phases: phaseBudgets });
    onClose();
  };

  const handlePhaseBudgetChange = (phase: string, value: string) => {
    setPhaseBudgets(prev => ({
      ...prev,
      [phase]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{isEditing ? '修改案件' : '新建案件'}</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {isEditing ? '修改案件的基本信息和各工程预算' : '填写新案件的基本信息和各工程预算'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {/* 基本信息 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
            <h3 className="text-xs font-bold text-gray-800 mb-2">基本信息</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs mb-2 text-gray-700 font-semibold">所属项目组</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">案件名称</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="输入案件名称..."
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">项目Leader</label>
                  <Input
                    value={formData.leader}
                    onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                    placeholder="输入Leader姓名..."
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">开始日期</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">预计结束日期</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 各工程見積工数 */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-3 border border-purple-100/50 shadow-inner">
            <h3 className="text-xs font-bold text-gray-800 mb-2">各工程見積工数 (MD)</h3>
            <p className="text-xs text-gray-600 mb-3">只需填写有预算的工程，留空的工程将不显示在案件详情中</p>
            <div className="grid grid-cols-6 gap-2">
              {ALL_PHASES.map((phase) => (
                <div key={phase}>
                  <label className="block text-xs mb-1 text-gray-700 font-medium">{phase}</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={phaseBudgets[phase] || ''}
                    onChange={(e) => handlePhaseBudgetChange(phase, e.target.value)}
                    placeholder="0"
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-gradient-to-r from-indigo-100/70 to-purple-100/70 rounded-lg border border-indigo-200/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-800">合计预算：</span>
                <span className="text-xl font-bold text-indigo-600">
                  {Object.values(phaseBudgets).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(1)} MD
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70 px-4 py-2">
            取消
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? '保存修改' : '创建案件'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BudgetDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    projectGroup: '',
    month: new Date().toISOString().substring(0, 7),
    budget: '',
  });

  const projectGroups = ['项目组A', '项目组B', '项目组C', 'Enhance'];

  const history = [
    { projectGroup: 'Enhance', month: '2025-12', budget: 50 },
    { projectGroup: '项目组A', month: '2025-12', budget: 200 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">保守工数设定</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">设定各项目组的月次保守工数预算</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="backdrop-blur-lg bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3 border border-teal-100/50 shadow-inner">
            <label className="block text-xs mb-2 text-gray-700 font-bold">设定对象组</label>
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

          <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50 shadow-inner">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5 text-gray-700 font-semibold">对象月</label>
                <Input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 text-gray-700 font-semibold">月次预算 (MD)</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="输入预算..."
                  className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
            <h4 className="text-xs font-bold text-gray-800 mb-2">历史设定</h4>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white/60 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-800">{item.projectGroup}</span>
                    <span className="text-xs text-gray-600">{item.month}</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{item.budget} MD</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70 px-4 py-2">
            取消
          </Button>
          <Button onClick={onClose} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2">
            <Save className="w-4 h-4 mr-2" />
            保存设定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}