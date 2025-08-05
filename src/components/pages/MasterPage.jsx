import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { lectureService } from "@/services/lectureService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import LectureList from "@/components/organisms/LectureList";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const MasterPage = () => {
  const { user, hasAccess } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState(1);
  const [courseType, setCourseType] = useState("공통 과정");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Available cohorts (1-10 for dropdown)
  const cohortOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    if (user?.master_cohort) {
      setSelectedCohort(user.master_cohort);
    }
  }, [user]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const cohortToUse = courseType === "기수별 과정" ? selectedCohort : 0;
const data = await lectureService.getMasterLectures(courseType, cohortToUse);
        setLectures(data);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
        setLectures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseType, selectedCohort]);

  // Check if user has access to master content
  const hasAccessToMaster = hasAccess() && user && ["master", "both", "admin"].includes(user.role);

  if (!hasAccessToMaster) {
    return (
      <div className="min-h-screen bg-slate-950 relative">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              마스터 과정
            </h1>
            <p className="text-slate-400 text-lg">
              전문가 수준의 한국어 실력을 완성하는 심화 과정
            </p>
          </div>
        </div>

        {/* Access Restriction Overlay */}
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Lock" size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              마스터 과정 접근 제한
            </h3>
            <p className="text-slate-400 mb-6">
              마스터 과정은 특별 권한이 필요한 고급 과정입니다. 
              관리자에게 문의하여 권한을 요청해주세요.
            </p>
            <Button variant="outline" className="w-full">
              문의하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
            마스터 과정
          </h1>
          <p className="text-slate-400 text-lg">
            전문가 수준의 한국어 실력을 완성하는 심화 과정
          </p>
        </div>

        {/* Top Bar Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          {/* Cohort Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              기수 선택
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 hover:bg-slate-600 transition-colors min-w-[120px] justify-between"
            >
              <span>{selectedCohort}기</span>
              <ApperIcon 
                name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} 
                size={16} 
              />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                {cohortOptions.map((cohort) => (
                  <button
                    key={cohort}
                    onClick={() => {
                      setSelectedCohort(cohort);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors ${
                      selectedCohort === cohort ? 'bg-slate-600 text-blue-400' : 'text-slate-100'
                    }`}
                  >
                    {cohort}기
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Course Type Toggle */}
          <div className="flex gap-2">
            {["공통 과정", "기수별 과정"].map((type) => (
              <button
                key={type}
                onClick={() => setCourseType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  courseType === type
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : lectures.length === 0 ? (
          <Empty 
            title="강의가 없습니다"
            description={
              courseType === "공통 과정" 
                ? "공통 과정 강의가 아직 등록되지 않았습니다."
                : `${selectedCohort}기 전용 강의가 아직 등록되지 않았습니다.`
            }
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-100">
                {courseType === "공통 과정" 
                  ? "공통 과정 강의" 
                  : `${selectedCohort}기 전용 강의`}
              </h2>
              <span className="text-sm text-slate-400">
                총 {lectures.length}개 강의
              </span>
            </div>
            
            <LectureList lectures={lectures} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterPage;