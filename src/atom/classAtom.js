import { atom } from 'jotai';

export const recommendClassAtom = atom([]);
export const hotClassAtom = atom([]);
export const recommendGatheringAtom = atom([]);
export const mainBannerList = atom([]);
export const userClassList = atom([]);
export const category = atom([]);
export const subCategory = atom([]);

//클래스 리스트 전용
export const classListAtom = atom([]); // 현재 페이지에 표시될 클래스들
export const totalPagesAtom = atom(1); // 전체 페이지 수
export const currentPageAtom = atom(1); // 현재 페이지

// 검색 조건 atom (원하는 조건만 추가 가능)
export const classFilterAtom = atom({
  sido: '',
  startDate: null,
  endDate: null,
  category1: '',
  category2: '',
  priceMin: '',
  priceMax: '',
  name:'',
});

//공통 카테고리
export const categoryListAtom  = atom([]);

//클래스 리스트 전용
export const gatheringListAtom = atom([]); // 현재 페이지에 표시될 클래스들

// 검색 조건 atom (원하는 조건만 추가 가능)
export const gatheringFilterAtom = atom({
  sido: '',
  startDate: null,
  endDate: null,
  category1: '',
  category2: '',
  maxAttendees: '',
  minAttendees:'',
  title:'',
});

//클래스 detail
export const calendarListAtom  = atom([]);
export const classDetailAtom = atom();
export const currListAtom = atom([]);
export const hostAtom = atom();
export const reviewListAtom = atom([]);
export const inquiryListAtom = atom([]);

//클래스 리뷰
export const allReviewListAtom = atom([]);

//로그인한 사용자의 좋아요 리스트
export const classLikesAtom  = atom([]);