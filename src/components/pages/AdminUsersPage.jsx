import React, { useState, useEffect } from 'react';
import { usersExtService } from '@/services/usersExtService';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const AdminUsersPage = () => {
  const { is_admin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const roleOptions = [
    { value: 'free', label: '무료' },
    { value: 'member', label: '멤버' },
    { value: 'master', label: '마스터' },
    { value: 'both', label: '멤버+마스터' }
  ];

  useEffect(() => {
    if (!roleLoading && !is_admin) {
      setError('관리자 권한이 필요합니다.');
      setLoading(false);
      return;
    }

    if (!roleLoading && is_admin) {
      loadUsers();
    }
  }, [is_admin, roleLoading]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersExtService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user, field, value) => {
    setEditingUser({ ...user, [field]: value });
  };

  const handleSave = async (userId, field, value) => {
    try {
      setSaving(true);
      
      const updateData = { [field]: value };
      const updatedUser = await usersExtService.update(userId, updateData);
      
      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.Id === userId ? { ...user, [field]: value } : user
        ));
        setEditingUser(null);
      }
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAdmin = async (userId, currentValue) => {
    await handleSave(userId, 'is_admin', !currentValue);
  };

  const handleRoleChange = async (userId, newRole) => {
    await handleSave(userId, 'role', newRole);
  };

  const handleCohortChange = async (userId, field, value) => {
    const numValue = parseInt(value) || 0;
    await handleSave(userId, field, numValue);
  };

  if (roleLoading || loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUsers} />;
  }

  if (!is_admin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Shield" size={64} className="mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold text-white mb-2">접근 권한 없음</h1>
          <p className="text-slate-400">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="Users" size={32} className="text-blue-400" />
            <h1 className="text-3xl font-bold text-white">회원 등급 관리</h1>
          </div>
          <p className="text-slate-400">사용자의 역할과 권한을 관리합니다.</p>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <Empty 
            message="등록된 사용자가 없습니다." 
            icon="Users"
            action={
              <Button onClick={loadUsers} variant="outline">
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                새로고침
              </Button>
            }
          />
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">이메일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">역할</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-200">관리자</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-200">멤버십 기수</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-200">마스터 기수</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-200">가입일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((user) => (
                    <tr key={user.Id} className="hover:bg-slate-700/30 transition-colors">
                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold text-white">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{user.email}</div>
                            <div className="text-xs text-slate-400">ID: {user.auth_id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <select
                          value={user.role || 'free'}
                          onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                          disabled={saving}
                          className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {roleOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Admin Toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleAdmin(user.Id, user.is_admin)}
                          disabled={saving}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                            user.is_admin ? 'bg-blue-600' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              user.is_admin ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Membership Cohort */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          value={user.membership_cohort || 0}
                          onChange={(e) => handleCohortChange(user.Id, 'membership_cohort', e.target.value)}
                          disabled={saving}
                          min="0"
                          className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>

                      {/* Master Cohort */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          value={user.master_cohort || 0}
                          onChange={(e) => handleCohortChange(user.Id, 'master_cohort', e.target.value)}
                          disabled={saving}
                          min="0"
                          className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-slate-400">
                          {user.CreatedOn ? new Date(user.CreatedOn).toLocaleDateString('ko-KR') : '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            총 {users.length}명의 사용자가 등록되어 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;