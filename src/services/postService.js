import { toast } from 'react-toastify';

const mockPosts = [
  {
    Id: 1,
    title: "한국어로 배우는 투자의 기초",
    content_richtext: `<h2>투자란 무엇인가요?</h2>
<p>투자는 미래의 수익을 기대하며 현재 자본을 투입하는 행위입니다. 주식, 채권, 부동산 등 다양한 투자 상품이 있습니다.</p>
<h3>투자의 기본 원칙</h3>
<ul>
<li>분산 투자로 위험을 줄이세요</li>
<li>장기적인 관점으로 접근하세요</li>
<li>자신의 위험 성향을 파악하세요</li>
</ul>
<img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop" alt="투자 개념" />
<p>투자는 경제적 자유를 위한 중요한 수단입니다.</p>`,
    thumbnail_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop",
    author_id: "user_1",
    author_name: "준태",
    created_at: "2024-01-15"
  },
  {
    Id: 2,
    title: "예산 관리의 중요성",
    content_richtext: `<h2>왜 예산을 세워야 할까요?</h2>
<p>예산 관리는 재정 건전성을 유지하는 핵심입니다. 수입과 지출을 체계적으로 관리하여 경제적 목표를 달성할 수 있습니다.</p>
<h3>예산 세우기 단계</h3>
<ol>
<li>월 수입 계산하기</li>
<li>고정비와 변동비 구분하기</li>
<li>저축 목표 설정하기</li>
<li>지출 추적하기</li>
</ol>
<img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop" alt="예산 계획" />
<p>체계적인 예산 관리로 경제적 안정을 확보하세요.</p>`,
    thumbnail_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop",
    author_id: "user_2",
    author_name: "경제전문가",
    created_at: "2024-01-10"
  },
  {
    Id: 3,
    title: "한국의 부동산 시장 이해하기",
    content_richtext: `<h2>부동산 시장의 현재</h2>
<p>한국의 부동산 시장은 다양한 요인에 의해 영향을 받습니다. 정부 정책, 금리, 공급량 등을 종합적으로 고려해야 합니다.</p>
<h3>부동산 투자 고려사항</h3>
<ul>
<li>지역별 성장 잠재력 분석</li>
<li>교통 인프라 개발 계획</li>
<li>인구 유입 추이</li>
<li>정부 정책 변화</li>
</ul>
<img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop" alt="부동산" />
<p>신중한 분석을 통해 현명한 부동산 투자를 하세요.</p>`,
    thumbnail_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop",
    author_id: "user_1",
    author_name: "준태",
    created_at: "2024-01-05"
  }
];

let postData = [...mockPosts];
let nextId = Math.max(...postData.map(p => p.Id)) + 1;

export const postService = {
  getAll: () => {
    return [...postData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getById: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }
    return postData.find(post => post.Id === numId) || null;
  },

  create: (postData) => {
    const newPost = {
      ...postData,
      Id: nextId++,
      created_at: new Date().toISOString().split('T')[0] // yyyy-mm-dd format
    };
    
    postData.push(newPost);
    toast.success('포스트가 성공적으로 생성되었습니다.');
    return { ...newPost };
  },

  update: (id, updateData) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }

    const index = postData.findIndex(post => post.Id === numId);
    if (index === -1) {
      throw new Error('포스트를 찾을 수 없습니다.');
    }

    postData[index] = {
      ...postData[index],
      ...updateData,
      Id: numId // Preserve original ID
    };

    toast.success('포스트가 성공적으로 수정되었습니다.');
    return { ...postData[index] };
  },

  delete: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('유효하지 않은 ID입니다.');
    }

    const index = postData.findIndex(post => post.Id === numId);
    if (index === -1) {
      throw new Error('포스트를 찾을 수 없습니다.');
    }

    const deletedPost = postData[index];
    postData.splice(index, 1);
    toast.success('포스트가 성공적으로 삭제되었습니다.');
    return deletedPost;
  },

  getByAuthor: (authorId) => {
    return postData.filter(post => post.author_id === authorId)
                   .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  search: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return postData.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content_richtext.toLowerCase().includes(lowercaseQuery) ||
      post.author_name.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

export default postService;