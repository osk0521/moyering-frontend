import { atom } from 'jotai';
import axios from 'axios';
import { categoryListAtom } from '../../atom/classAtom';
import { url } from '../../config';

export const fetchCategoryListAtom = atom(null, async (get, set) => {
  const res = await axios.get(`${url}/categories/suball`); 
  set(categoryListAtom, res.data); 
});