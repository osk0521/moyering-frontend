import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { classLikesAtom } from '../../atom/classAtom';
import { myAxios } from '../../config';

const useClassLikesToAtom = (user, token) => {
    const setClassLikes = useSetAtom(classLikesAtom);

    return useQuery({
    queryKey: ['classLikes', user?.userId, token],
    queryFn: async () => {
        const res = await myAxios(token).get('/user/class-like-list');
        return res.data;
    },
    enabled: !!user?.userId && !!token,
    onSuccess: (data) => {
        setClassLikes(data);
    },
    });
};

export default useClassLikesToAtom;
