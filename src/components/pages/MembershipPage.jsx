import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { lectureService } from '@/services/lectureService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { toast } from 'react-toastify';

const MembershipPage = () => {
  const { user, hasAccess, openAuthModal } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedLecture, setExpandedLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user has membership access
  const hasMembershipAccess = hasAccess(null, "membership");

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      setLoading(true);
      setError(null);
      
const membershipLectures = await lectureService.getByType('membership');
      setLectures(membershipLectures);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(membershipLectures.map(lecture => lecture.category))];
      setCategories(uniqueCategories);
      
      if (uniqueCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (err) {
      setError('강의 목록을 불러오는데 실패했습니다.');
      toast.error('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLectures = selectedCategory 
    ? lectures.filter(lecture => lecture.category === selectedCategory)
    : lectures;

  const handleLectureClick = (lectureId) => {
    if (!hasMembershipAccess) {
      toast.warning('멤버십 가입 후 시청 가능합니다.');
      return;
    }
    
    setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
  };

  const handleWatchLecture = (lecture) => {
    if (!hasMembershipAccess) {
      toast.warning('멤버십 가입 후 시청 가능합니다.');
      return;
    }
    
    if (lecture.embed_link) {
      window.open(lecture.embed_link, '_blank', 'noopener,noreferrer');
      toast.success(`"${lecture.title}" 강의를 시청합니다.`);
    } else {
      toast.error('강의 링크가 없습니다.');
    }
  };

  const handleJoinMembership = () => {
    toast.info('멤버십 가입 기능을 준비 중입니다.');
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLectures} />;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            멤버십 영상실
          </h1>
          <p className="text-slate-400 text-lg">
            프리미엄 영상 콘텐츠로 한국어 실력을 향상시키세요
          </p>
          {user?.membership_cohort > 0 && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <ApperIcon name="Crown" size={16} className="mr-2" />
                멤버십 코호트 {user.membership_cohort}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Layout (>1024px) */}
        <div className="hidden lg:flex gap-8">
          {/* Left Sidebar - Categories */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">카테고리</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Content - Lectures Accordion */}
          <div className="flex-1">
            {filteredLectures.length === 0 ? (
              <Card className="p-8 text-center">
                <ApperIcon name="BookOpen" size={48} className="mx-auto text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">강의가 없습니다</h3>
                <p className="text-slate-500">선택한 카테고리에 강의가 없습니다.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredLectures.map((lecture) => (
                  <Card key={lecture.Id} className="overflow-hidden">
                    <button
                      onClick={() => handleLectureClick(lecture.Id)}
                      className="w-full p-6 text-left hover:bg-slate-800/30 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-100 mb-2">
                            {lecture.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              멤버십
                            </span>
                            {lecture.cohort_number > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                                코호트 {lecture.cohort_number}
                              </span>
                            )}
                            <span className="text-sm text-slate-500">
                              순서: {lecture.sort_order}
                            </span>
                          </div>
                        </div>
                        <ApperIcon 
                          name={expandedLecture === lecture.Id ? "ChevronUp" : "ChevronDown"} 
                          size={20} 
                          className="text-slate-400"
                        />
                      </div>
                    </button>
                    
                    {expandedLecture === lecture.Id && (
                      <div className="px-6 pb-6 border-t border-slate-700">
                        <div className="pt-4">
                          <p className="text-slate-300 mb-4">카테고리: {lecture.category}</p>
                          {lecture.embed_link && (
                            <Button
                              onClick={() => handleWatchLecture(lecture)}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={!hasMembershipAccess}
                            >
                              <ApperIcon name="Play" size={16} className="mr-2" />
                              강의 시청하기
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout (<1024px) */}
        <div className="lg:hidden">
          {/* Category Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              카테고리 선택
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Lectures List */}
          {filteredLectures.length === 0 ? (
            <Card className="p-8 text-center">
              <ApperIcon name="BookOpen" size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">강의가 없습니다</h3>
              <p className="text-slate-500">선택한 카테고리에 강의가 없습니다.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredLectures.map((lecture) => (
                <Card key={lecture.Id} className="overflow-hidden">
                  <button
                    onClick={() => handleLectureClick(lecture.Id)}
                    className="w-full p-4 text-left hover:bg-slate-800/30 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-slate-100 mb-2">
                          {lecture.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            멤버십
                          </span>
                          {lecture.cohort_number > 0 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                              코호트 {lecture.cohort_number}
                            </span>
                          )}
                        </div>
                      </div>
                      <ApperIcon 
                        name={expandedLecture === lecture.Id ? "ChevronUp" : "ChevronDown"} 
                        size={20} 
                        className="text-slate-400"
                      />
                    </div>
                  </button>
                  
                  {expandedLecture === lecture.Id && (
                    <div className="px-4 pb-4 border-t border-slate-700">
                      <div className="pt-4">
                        <p className="text-slate-300 text-sm mb-4">카테고리: {lecture.category}</p>
                        {lecture.embed_link && (
                          <Button
                            onClick={() => handleWatchLecture(lecture)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!hasMembershipAccess}
                          >
                            <ApperIcon name="Play" size={16} className="mr-2" />
                            강의 시청하기
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Access Control Overlay */}
        {!hasMembershipAccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center">
              <ApperIcon name="Lock" size={64} className="mx-auto text-slate-600 mb-6" />
              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                멤버십 전용 콘텐츠
              </h2>
              <p className="text-slate-400 mb-8">
                멤버십 가입 후 시청 가능합니다.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleJoinMembership}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <ApperIcon name="Crown" size={16} className="mr-2" />
                  멤버십 가입하기
                </Button>
                {!user && (
                  <Button
                    onClick={openAuthModal}
                    variant="outline"
                    className="w-full"
                  >
                    로그인하기
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;