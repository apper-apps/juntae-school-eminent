import { toast } from 'react-toastify';

const mockLectures = [
  {
    Id: 1,
    title: "React 기초 강의",
    cohort_number: 1,
    category: "프론트엔드",
    embed_link: "https://example.com/embed/1",
    sort_order: 1,
    type: "membership"
  },
  {
    Id: 2,
    title: "JavaScript 심화 과정",
    cohort_number: 2,
    category: "프로그래밍",
    embed_link: "https://example.com/embed/2",
    sort_order: 2,
    type: "master"
  },
  {
    Id: 3,
    title: "웹 개발 공통 강의",
    cohort_number: 0,
    category: "기초",
    embed_link: "https://example.com/embed/3",
    sort_order: 3,
    type: "master_common"
  }
];

let lectureData = [...mockLectures];
let nextId = Math.max(...lectureData.map(l => l.Id)) + 1;

export const lectureService = {
  getAll: () => {
    return [...lectureData].sort((a, b) => a.sort_order - b.sort_order);
  },

  getById: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }
    return lectureData.find(lecture => lecture.Id === numId) || null;
  },

  create: (lectureData) => {
    const newLecture = {
      ...lectureData,
      Id: nextId++,
      cohort_number: parseInt(lectureData.cohort_number) || 0,
      sort_order: parseInt(lectureData.sort_order) || 0
    };
    
    lectureData.push(newLecture);
    toast.success('강의가 성공적으로 생성되었습니다.');
    return { ...newLecture };
  },

  update: (id, updateData) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }

    const index = lectureData.findIndex(lecture => lecture.Id === numId);
    if (index === -1) {
      throw new Error('강의를 찾을 수 없습니다.');
    }

    lectureData[index] = {
      ...lectureData[index],
      ...updateData,
      Id: numId,
      cohort_number: parseInt(updateData.cohort_number) || lectureData[index].cohort_number,
      sort_order: parseInt(updateData.sort_order) || lectureData[index].sort_order
    };

    toast.success('강의가 성공적으로 수정되었습니다.');
    return { ...lectureData[index] };
  },

  delete: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }

    const index = lectureData.findIndex(lecture => lecture.Id === numId);
    if (index === -1) {
      throw new Error('강의를 찾을 수 없습니다.');
    }

    const deletedLecture = lectureData[index];
    lectureData.splice(index, 1);
    toast.success('강의가 성공적으로 삭제되었습니다.');
    return deletedLecture;
  },

  getByType: (type) => {
    return lectureData.filter(lecture => lecture.type === type)
                     .sort((a, b) => a.sort_order - b.sort_order);
  },

  getByCohort: (cohortNumber) => {
    const numCohort = parseInt(cohortNumber);
    return lectureData.filter(lecture => lecture.cohort_number === numCohort)
                     .sort((a, b) => a.sort_order - b.sort_order);
  }
};

export default lectureService;