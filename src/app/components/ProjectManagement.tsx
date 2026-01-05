import { useState } from 'react';
import { Plus, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ProjectManagementProps {
  user: { name: string; role: string; department: string };
}

export function ProjectManagement({ user }: ProjectManagementProps) {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'condition' | 'member' | 'conservative'>('condition');
  const [expandedProject, setExpandedProject] = useState<string | null>('project-a');

  const projects = [
    {
      id: 'project-a',
      name: '项目A - ERP系统升级',
      group: '项目组A',
      leader: '王经理',
      members: 5,
      totalBudget: 200,
      used: 145,
      percentage: 72.5,
      status: 'normal',
      phases: [
        { name: '概要设计', budget: 30, used: 28, percentage: 93 },
        { name: '详细设计', budget: 40, used: 35, percentage: 87 },
        { name: '开发', budget: 80, used: 60, percentage: 75 },
        { name: '单体测试', budget: 30, used: 15, percentage: 50 },
        { name: '结合测试', budget: 20, used: 7, percentage: 35 },
      ]
    },
    {
      id: 'project-b',
      name: '项目B - 移动端开发',
      group: '项目组B',
      leader: '李经理',
      members: 3,
      totalBudget: 150,
      used: 95,
      percentage: 63.3,
      status: 'normal',
      phases: [
        { name: '概要设计', budget: 25, used: 25, percentage: 100 },
        { name: '详细设计', budget: 30, used: 30, percentage: 100 },
        { name: '开发', budget: 60, used: 35, percentage: 58 },
        { name: '单体测试', budget: 25, used: 5, percentage: 20 },
        { name: '结合测试', budget: 10, used: 0, percentage: 0 },
      ]
    },
    {
      id: 'project-enhance',
      name: 'Enhance - 维护项目',
      group: '项目组A',
      leader: '张经理',
      members: 4,
      totalBudget: 50,
      used: 106.5,
      percentage: 213,
      status: 'warning',
      phases: [
        { name: '开发', budget: 30, used: 65, percentage: 217 },
        { name: '测试', budget: 20, used: 41.5, percentage: 207 },
      ]
    }
  ];

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
        <div className="flex gap-2 bg-white/40 p-2 rounded-xl">
          <button
            onClick={() => setViewMode('condition')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              viewMode === 'condition'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            条件别
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
        {projects.map((project) => (
          <div
            key={project.id}
            className="backdrop-blur-xl bg-white/60 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Project Header */}
            <button
              onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              className="w-full p-6 hover:bg-white/40 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {project.status === 'warning' && (
                    <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">{project.group}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">Leader: {project.leader}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{project.members} 人</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
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
                  {expandedProject === project.id ? (
                    <ChevronUp className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  )}
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
            </button>

            {/* Project Details */}
            {expandedProject === project.id && (
              <div className="border-t border-white/20 p-6 bg-white/20">
                <h4 className="font-semibold text-gray-800 mb-4">工期明细</h4>
                <div className="space-y-3">
                  {project.phases.map((phase, index) => (
                    <div
                      key={index}
                      className="backdrop-blur-lg bg-white/70 rounded-2xl p-4 border border-white/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{phase.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {phase.used} / {phase.budget} MD
                          </span>
                          <span className={`text-sm font-bold ${
                            phase.percentage > 100 ? 'text-red-600' : 'text-indigo-600'
                          }`}>
                            {phase.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            phase.percentage > 100
                              ? 'bg-gradient-to-r from-red-400 to-red-500'
                              : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                          }`}
                          style={{ width: `${Math.min(phase.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <NewProjectDialog open={showNewProjectDialog} onClose={() => setShowNewProjectDialog(false)} />
      <BudgetDialog open={showBudgetDialog} onClose={() => setShowBudgetDialog(false)} />
    </div>
  );
}

function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    projectGroup: '',
    name: '',
    leader: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const projectGroups = ['项目组A', '项目组B', '项目组C'];

  const handleSubmit = () => {
    console.log('New project:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">新建案件</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div>
            <label className="block text-sm mb-3 text-gray-700">所属项目组</label>
            <div className="grid grid-cols-3 gap-3">
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

          <div>
            <label className="block text-sm mb-2 text-gray-700">案件名称</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入案件名称..."
              className="backdrop-blur-lg bg-white/70 border-white/30"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">项目Leader</label>
            <Input
              value={formData.leader}
              onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
              placeholder="输入Leader姓名..."
              className="backdrop-blur-lg bg-white/70 border-white/30"
            />
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
              <label className="block text-sm mb-2 text-gray-700">预计结束日期</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70">
            取消
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            创建案件
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
      <DialogContent className="backdrop-blur-2xl bg-white/90 border-white/20 shadow-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">保守工数设定</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div>
            <label className="block text-sm mb-3 text-gray-700">设定对象组</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">对象月</label>
              <Input
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">月次预算 (MD)</label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="输入预算..."
                className="backdrop-blur-lg bg-white/70 border-white/30"
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">历史设定</h4>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 backdrop-blur-lg bg-white/70 rounded-xl border border-white/30"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-800">{item.projectGroup}</span>
                    <span className="text-sm text-gray-600">{item.month}</span>
                  </div>
                  <span className="font-bold text-indigo-600">{item.budget} MD</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="backdrop-blur-lg bg-white/70">
            取消
          </Button>
          <Button onClick={onClose} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            保存设定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
