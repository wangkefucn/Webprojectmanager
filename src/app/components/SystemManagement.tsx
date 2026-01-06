import { useState } from 'react';
import { Users, FolderKanban, Plus, Edit, Trash2, Key, UserX, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface SystemManagementProps {
  user: { name: string; role: string; department: string };
}

interface Member {
  id: string;
  name: string;
  gender: string;
  employeeId: string;
  birthDate: string;
  hometown: string;
  phone: string;
  email: string;
  hobbies: string;
  role: 'user' | 'leader' | 'admin';
  projectGroup: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface ProjectGroup {
  id: string;
  name: string;
  description: string;
  leader: string;
  memberCount: number;
}

export function SystemManagement({ user }: SystemManagementProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'projects'>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('全部');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [filterProjectGroup, setFilterProjectGroup] = useState('全部');
  
  // Member dialogs
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  // Project dialogs
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectGroup | null>(null);

  // Mock data - members
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: '宋永赛',
      gender: '男',
      employeeId: 'EMP001',
      birthDate: '1990-05',
      hometown: '北京',
      phone: '13800138000',
      email: 'song@company.com',
      hobbies: '编程、阅读',
      role: 'admin',
      projectGroup: 'APF',
      status: 'active',
      joinDate: '2020-01-15'
    },
    {
      id: '2',
      name: '张三',
      gender: '男',
      employeeId: 'EMP002',
      birthDate: '1992-03',
      hometown: '上海',
      phone: '13900139000',
      email: 'zhang@company.com',
      hobbies: '篮球、旅游',
      role: 'leader',
      projectGroup: 'WPF',
      status: 'active',
      joinDate: '2021-03-20'
    },
    {
      id: '3',
      name: '李四',
      gender: '女',
      employeeId: 'EMP003',
      birthDate: '1995-08',
      hometown: '广州',
      phone: '13700137000',
      email: 'li@company.com',
      hobbies: '绘画、音乐',
      role: 'user',
      projectGroup: 'APF',
      status: 'active',
      joinDate: '2022-06-10'
    },
    {
      id: '4',
      name: '王五',
      gender: '男',
      employeeId: 'EMP004',
      birthDate: '1988-12',
      hometown: '深圳',
      phone: '13600136000',
      email: 'wang@company.com',
      hobbies: '游泳、摄影',
      role: 'user',
      projectGroup: '認証＆AI',
      status: 'inactive',
      joinDate: '2019-09-01'
    }
  ]);

  // Mock data - project groups
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([
    {
      id: '1',
      name: 'APF',
      description: 'Application Framework项目组，负责应用框架开发',
      leader: '宋永赛',
      memberCount: 8
    },
    {
      id: '2',
      name: 'WPF',
      description: 'Web Platform Framework项目组，负责Web平台框架',
      leader: '张三',
      memberCount: 6
    },
    {
      id: '3',
      name: '認証＆AI',
      description: '认证与AI项目组，负责身份认证和AI功能开发',
      leader: '李经理',
      memberCount: 5
    },
    {
      id: '4',
      name: 'そのた',
      description: '其他项目组，负责各类支持性项目',
      leader: '刘主管',
      memberCount: 5
    }
  ]);

  const [newMember, setNewMember] = useState({
    name: '',
    gender: '男',
    employeeId: '',
    birthDate: '',
    hometown: '',
    phone: '',
    email: '',
    hobbies: '',
    role: 'user' as 'user' | 'leader' | 'admin',
    projectGroup: 'APF'
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    leader: ''
  });

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.includes(searchTerm) || 
                         member.employeeId.includes(searchTerm) ||
                         member.email.includes(searchTerm);
    const matchesRole = filterRole === '全部' || 
                       (filterRole === '管理员' && member.role === 'admin') ||
                       (filterRole === 'Leader' && member.role === 'leader') ||
                       (filterRole === '普通用户' && member.role === 'user');
    const matchesStatus = filterStatus === '全部' ||
                         (filterStatus === '在职' && member.status === 'active') ||
                         (filterStatus === '离职' && member.status === 'inactive');
    const matchesGroup = filterProjectGroup === '全部' || member.projectGroup === filterProjectGroup;
    
    return matchesSearch && matchesRole && matchesStatus && matchesGroup;
  });

  const handleAddMember = () => {
    const member: Member = {
      id: Date.now().toString(),
      ...newMember,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setMembers([...members, member]);
    setShowAddMemberDialog(false);
    setNewMember({
      name: '',
      gender: '男',
      employeeId: '',
      birthDate: '',
      hometown: '',
      phone: '',
      email: '',
      hobbies: '',
      role: 'user',
      projectGroup: 'APF'
    });
  };

  const handleEditMember = () => {
    if (!editingMember) return;
    setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
    setShowEditMemberDialog(false);
    setEditingMember(null);
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    ));
  };

  const handleResetPassword = () => {
    console.log('重置密码为: 123456', editingMember);
    setShowResetPasswordDialog(false);
    setEditingMember(null);
  };

  const handleAddProject = () => {
    const project: ProjectGroup = {
      id: Date.now().toString(),
      ...newProject,
      memberCount: 0
    };
    setProjectGroups([...projectGroups, project]);
    setShowAddProjectDialog(false);
    setNewProject({ name: '', description: '', leader: '' });
  };

  const handleEditProject = () => {
    if (!editingProject) return;
    setProjectGroups(projectGroups.map(p => p.id === editingProject.id ? editingProject : p));
    setShowEditProjectDialog(false);
    setEditingProject(null);
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
      leader: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
      user: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    };
    const labels = {
      admin: '系统管理员',
      leader: 'Leader',
      user: '普通用户'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        在职
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-400 to-gray-500 text-white">
        离职
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-800 mb-1">系统管理</h2>
            <p className="text-sm text-gray-600">管理团队成员和项目组信息</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mt-6 bg-white/40 p-2 rounded-xl">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'members'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">人员管理</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            <span className="font-medium">项目组管理</span>
          </button>
        </div>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm mb-2 text-gray-700">搜索</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="姓名/工号/邮箱"
                    className="pl-10 backdrop-blur-lg bg-white/70 border-white/30"
                  />
                </div>
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm mb-2 text-gray-700">权限</label>
                <div className="flex flex-wrap gap-2">
                  {['全部', '管理员', 'Leader', '普通用户'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        filterRole === role
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm mb-2 text-gray-700">状态</label>
                <div className="flex flex-wrap gap-2">
                  {['全部', '在职', '离职'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        filterStatus === status
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-[150px]">
                <label className="block text-sm mb-2 text-gray-700">项目组</label>
                <div className="flex flex-wrap gap-2">
                  {['全部', ...projectGroups.map(g => g.name)].map((group) => (
                    <button
                      key={group}
                      onClick={() => setFilterProjectGroup(group)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        filterProjectGroup === group
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'backdrop-blur-lg bg-white/70 text-gray-700 hover:bg-white/90'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setShowAddMemberDialog(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                添加成员
              </Button>
            </div>
          </div>

          {/* Members Table */}
          <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="mb-4 text-sm text-gray-600">
              共 {filteredMembers.length} 人
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/30">
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">姓名</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">工号</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">性别</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">项目组</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">权限</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">状态</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">入职日期</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-white/20 hover:bg-white/40 transition-colors duration-200"
                    >
                      <td className="p-4 font-medium text-gray-800">{member.name}</td>
                      <td className="p-4 text-gray-600">{member.employeeId}</td>
                      <td className="p-4 text-gray-600">{member.gender}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {member.projectGroup}
                        </span>
                      </td>
                      <td className="p-4">{getRoleBadge(member.role)}</td>
                      <td className="p-4">{getStatusBadge(member.status)}</td>
                      <td className="p-4 text-gray-600">{member.joinDate}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setShowEditMemberDialog(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-sm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>编辑</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setShowResetPasswordDialog(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors text-sm"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>重置密码</span>
                          </button>
                          <button
                            onClick={() => handleToggleMemberStatus(member.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                              member.status === 'active'
                                ? 'bg-red-50 hover:bg-red-100 text-red-700'
                                : 'bg-green-50 hover:bg-green-100 text-green-700'
                            }`}
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>{member.status === 'active' ? '设为离职' : '恢复在职'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAddProjectDialog(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              新建项目组
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectGroups.map((project) => (
              <div
                key={project.id}
                className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <FolderKanban className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-600">负责人: {project.leader}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowEditProjectDialog(true);
                    }}
                    className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-700 mb-4 min-h-[3rem]">{project.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">成员数量</span>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">{project.memberCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">添加团队成员</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">填写新成员的基本信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {/* 基本信息 */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50">
              <label className="block text-xs mb-2 text-gray-700 font-bold">基本信息</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">姓名 *</label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="请输入姓名"
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">工号 *</label>
                  <Input
                    value={newMember.employeeId}
                    onChange={(e) => setNewMember({ ...newMember, employeeId: e.target.value })}
                    placeholder="EMP001"
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">出生年月</label>
                  <Input
                    type="month"
                    value={newMember.birthDate}
                    onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 性别 */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-3 border border-purple-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">性别 *</label>
              <div className="grid grid-cols-6 gap-3">
                {['男', '女'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setNewMember({ ...newMember, gender })}
                    className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                      newMember.gender === gender
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* 联系方式 */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3 border border-teal-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">联系方式</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">籍贯</label>
                  <Input
                    value={newMember.hometown}
                    onChange={(e) => setNewMember({ ...newMember, hometown: e.target.value })}
                    placeholder="请输入籍贯"
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">手机</label>
                  <Input
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="13800138000"
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700 font-semibold">邮箱 *</label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="name@company.com"
                    className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 个人爱好 */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-amber-50/80 to-yellow-50/80 rounded-xl p-3 border border-amber-100/50 shadow-inner">
              <label className="block text-xs mb-1.5 text-gray-700 font-bold">个人爱好</label>
              <Textarea
                value={newMember.hobbies}
                onChange={(e) => setNewMember({ ...newMember, hobbies: e.target.value })}
                placeholder="请输入个人爱好"
                rows={2}
                className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
              />
            </div>

            {/* 权限设置 */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">权限 *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'user', label: '普通用户' },
                  { value: 'leader', label: 'Leader' },
                  { value: 'admin', label: '管理员' }
                ].map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setNewMember({ ...newMember, role: role.value as any })}
                    className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                      newMember.role === role.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 默认项目组 */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-3 border border-green-100/50 shadow-inner">
              <label className="block text-xs mb-2 text-gray-700 font-bold">默认项目组 *</label>
              <div className="grid grid-cols-6 gap-3">
                {projectGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setNewMember({ ...newMember, projectGroup: group.name })}
                    className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                      newMember.projectGroup === group.name
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                        : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              确认添加
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditMemberDialog} onOpenChange={setShowEditMemberDialog}>
        <DialogContent className="backdrop-blur-2xl bg-white/95 border-white/20 shadow-2xl !w-[96vw] !max-w-[96vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">编辑成员信息</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">修改成员的基本信息和权限</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-3 py-2">
              {/* 基本信息 */}
              <div className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl p-3 border border-blue-100/50">
                <label className="block text-xs mb-2 text-gray-700 font-bold">基本信息</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">姓名 *</label>
                    <Input
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">工号 *</label>
                    <Input
                      value={editingMember.employeeId}
                      onChange={(e) => setEditingMember({ ...editingMember, employeeId: e.target.value })}
                      className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">出生年月</label>
                    <Input
                      type="month"
                      value={editingMember.birthDate}
                      onChange={(e) => setEditingMember({ ...editingMember, birthDate: e.target.value })}
                      className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 性别 */}
              <div className="backdrop-blur-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl p-3 border border-purple-100/50 shadow-inner">
                <label className="block text-xs mb-2 text-gray-700 font-bold">性别 *</label>
                <div className="grid grid-cols-6 gap-3">
                  {['男', '女'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setEditingMember({ ...editingMember, gender })}
                      className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                        editingMember.gender === gender
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* 联系方式 */}
              <div className="backdrop-blur-lg bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl p-3 border border-teal-100/50 shadow-inner">
                <label className="block text-xs mb-2 text-gray-700 font-bold">联系方式</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">籍贯</label>
                    <Input
                      value={editingMember.hometown}
                      onChange={(e) => setEditingMember({ ...editingMember, hometown: e.target.value })}
                      className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">手机</label>
                    <Input
                      value={editingMember.phone}
                      onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                      className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 text-gray-700 font-semibold">邮箱 *</label>
                    <Input
                      type="email"
                      value={editingMember.email}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 个人爱好 */}
              <div className="backdrop-blur-lg bg-gradient-to-r from-amber-50/80 to-yellow-50/80 rounded-xl p-3 border border-amber-100/50 shadow-inner">
                <label className="block text-xs mb-1.5 text-gray-700 font-bold">个人爱好</label>
                <Textarea
                  value={editingMember.hobbies}
                  onChange={(e) => setEditingMember({ ...editingMember, hobbies: e.target.value })}
                  rows={2}
                  className="backdrop-blur-lg bg-white/80 border-white/50 font-medium"
                />
              </div>

              {/* 权限设置 */}
              <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl p-3 border border-indigo-100/50 shadow-inner">
                <label className="block text-xs mb-2 text-gray-700 font-bold">权限 *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'user', label: '普通用户' },
                    { value: 'leader', label: 'Leader' },
                    { value: 'admin', label: '管理员' }
                  ].map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setEditingMember({ ...editingMember, role: role.value as any })}
                      className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                        editingMember.role === role.value
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                          : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 默认项目组 */}
              <div className="backdrop-blur-lg bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl p-3 border border-green-100/50 shadow-inner">
                <label className="block text-xs mb-2 text-gray-700 font-bold">默认项目组 *</label>
                <div className="grid grid-cols-6 gap-3">
                  {projectGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setEditingMember({ ...editingMember, projectGroup: group.name })}
                      className={`px-4 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md text-sm ${
                        editingMember.projectGroup === group.name
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                          : 'backdrop-blur-lg bg-white/80 text-gray-700 hover:bg-white border border-white/50'
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowEditMemberDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleEditMember}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              保存修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="backdrop-blur-xl bg-white/95">
          <DialogHeader>
            <DialogTitle>重置密码</DialogTitle>
            <DialogDescription>
              确认要重置 <span className="font-bold text-gray-800">{editingMember?.name}</span> 的密码吗？
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="backdrop-blur-lg bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">新密码将被重置为:</span> 123456
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                建议用户登录后立即修改密码
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleResetPassword}
              className="bg-gradient-to-r from-orange-500 to-red-600"
            >
              确认重置
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog open={showAddProjectDialog} onOpenChange={setShowAddProjectDialog}>
        <DialogContent className="backdrop-blur-xl bg-white/95">
          <DialogHeader>
            <DialogTitle>新建项目组</DialogTitle>
            <DialogDescription>创建一个新的项目组</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700">项目组名称 *</label>
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="例如: APF"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">项目组负责人 *</label>
              <Input
                value={newProject.leader}
                onChange={(e) => setNewProject({ ...newProject, leader: e.target.value })}
                placeholder="负责人姓名"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">项目组描述</label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="简要描述项目组的职责和工作范围"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddProjectDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleAddProject}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              确认创建
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProjectDialog} onOpenChange={setShowEditProjectDialog}>
        <DialogContent className="backdrop-blur-xl bg-white/95">
          <DialogHeader>
            <DialogTitle>编辑项目组</DialogTitle>
            <DialogDescription>修改项目组信息</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">项目组名称 *</label>
                <Input
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">项目组负责人 *</label>
                <Input
                  value={editingProject.leader}
                  onChange={(e) => setEditingProject({ ...editingProject, leader: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">项目组描述</label>
                <Textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditProjectDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleEditProject}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              保存修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}