import axios from 'axios';
import { atom } from 'jotai';
import { classListAtom, currentPageAtom, totalPagesAtom, classFilterAtom } from '../../atom/classAtom';

export const fetchClassListAtom = atom(null, async (get, set) => {
  const page = get(currentPageAtom);
  const filters = get(classFilterAtom);

  const params = {
    page: page - 1,
    size: 12,
    sido: filters.sido,
    startDate: filters.startDate?.toISOString().slice(0, 10),
    endDate: filters.endDate?.toISOString().slice(0, 10),
    category1: filters.category1,
    category2: filters.category2,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    startTime: filters.startTime,
    endTime: filters.endTime,
  };
  const res = await axios.get('/classlist', { params });
  set(classListAtom, res.data.content);
  set(totalPagesAtom, res.data.totalPages);
});
