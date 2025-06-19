import axios from 'axios';
import { atom } from 'jotai';
import { classListAtom, currentPageAtom, totalPagesAtom, classFilterAtom } from '../../atom/classAtom';
import { myAxios } from "../../config";
import { userAtom, tokenAtom } from "../../atoms";

export const fetchClassListAtom = atom(null, async (get, set) => {
  const page = get(currentPageAtom);
  const filters = get(classFilterAtom);

  const params = {
    page: page - 1,
    size: 12,
    sido: filters.sido || null,
    category1: filters.category1 || null,
    category2: filters.category2 || null,
    startDate: filters.startDate?.toISOString().split('T')[0] || null,
    endDate: filters.endDate?.toISOString().split('T')[0] || null,
    priceMin: filters.priceMin || null,
    priceMax: filters.priceMax || null,
  };

  try {
    const res = await myAxios().get("/classRing/list", { params });
    set(classListAtom, res.data.content || []);
    set(totalPagesAtom, res.data.totalPages || 1);
  } catch (err) {
    console.error("❌ 클래스 리스트 조회 실패", err);
    set(classListAtom, []);
    set(totalPagesAtom, 1);
  }

});
