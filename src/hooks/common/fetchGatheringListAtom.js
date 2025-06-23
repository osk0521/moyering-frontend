import axios from 'axios';
import { atom } from 'jotai';
import { gatheringListAtom, currentPageAtom, totalPagesAtom, gatheringFilterAtom } from '../../atom/classAtom';
import { myAxios } from "../../config";
import { userAtom, tokenAtom } from "../../atoms";

export const fetchGatheringListAtom = atom(null, async (get, set) => {
  const page = get(currentPageAtom);
  const filters = get(gatheringFilterAtom);

  const body = {
    page: page - 1,
    size: 12,
    sido: filters.sido || null,
    category1: filters.category1 || null,
    category2: filters.category2 || null,
    startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : null,
    endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : null,
    maxAttendees: filters.maxAttendees || null,
    minAttendees: filters.minAttendees || null,
    title: filters.title || null,
  };

  try {
    const res = await myAxios().post("/gatheringList", body); 
    set(gatheringListAtom, res.data.content || []);
    set(totalPagesAtom, res.data.totalPages || 1);
  } catch (err) {
    console.error("게더링 리스트 조회 실패", err);
    set(gatheringListAtom, []);
    set(totalPagesAtom, 1);
  }
});
