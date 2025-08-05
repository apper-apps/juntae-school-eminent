import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { lectureService } from '@/services/lectureService';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import LectureList from '@/components/organisms/LectureList';
import LectureForm from '@/components/organisms/LectureForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const LecturesPage = () => {
  const { user, hasAccess } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('sort_order');

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = lectureService.getAll();
      setLectures(data);
    } catch (err) {
      setError('강의 목록을 불러오는데 실패했습니다.');
      toast.error('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLecture = () => {
    setEditingLecture(null);
    setShowForm(true);
  };

  const handleEditLecture = (lecture) => {
    setEditingLecture(lecture);
    setShowForm(true);
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('정말로 이 강의를 삭제하시겠습니까?')) {
      return;
    }

    try {
      lectureService.delete(lectureId);
      await loadLectures();
    } catch (err) {
      toast.error(err.message || '강의 삭제에 실패했습니다.');
    }
  };

  const handleFormSubmit = async (lectureData) => {
    try {
      if (editingLecture) {
        lectureService.update(editingLecture.Id, lectureData);
      } else {
        lectureService.create(lectureData);
      }
      await loadLectures();
      setShowForm(false);
      setEditingLecture(null);
    } catch (err) {
      toast.error(err.message || '강의 저장에 실패했습니다.');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingLecture(null);
  };

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lecture.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || lecture.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'cohort_number':
        return a.cohort_number - b.cohort_number;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return a.sort_order - b.sort_order;
    }
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">로그인이 필요합니다</h1>
          <p className="text-slate-400">강의 관리 기능을 사용하려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLectures} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">강의 관리</h1>
            <p className="text-slate-400">강의를 생성, 수정, 삭제할 수 있습니다.</p>
          </div>
          {hasAccess('admin') && (
            <Button onClick={handleCreateLecture} className="w-full sm:w-auto">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              새 강의 추가
            </Button>
          )}
        </div>

        {/* Search and Filter Controls */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">검색</Label>
              <Input
                id="search"
                placeholder="강의명 또는 카테고리 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="filterType">유형 필터</Label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="membership">멤버십</option>
                <option value="master">마스터</option>
                <option value="master_common">마스터 공통</option>
              </select>
            </div>
            <div>
              <Label htmlFor="sortBy">정렬</Label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sort_order">정렬 순서</option>
                <option value="title">제목</option>
                <option value="cohort_number">코호트 번호</option>
                <option value="type">유형</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <LectureForm
              lecture={editingLecture}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Lecture List */}
      {filteredLectures.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="강의가 없습니다"
          description={searchTerm || filterType !== 'all' ? "검색 조건에 맞는 강의가 없습니다." : "아직 등록된 강의가 없습니다."}
        />
      ) : (
        <LectureList
          lectures={filteredLectures}
          onEdit={handleEditLecture}
          onDelete={handleDeleteLecture}
          canEdit={hasAccess('admin')}
        />
      )}
    </div>
  );
};

export default LecturesPage;