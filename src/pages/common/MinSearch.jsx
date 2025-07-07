import { useEffect, useState } from 'react';
import { myAxios, url } from '../../config';
import Header from './Header';
import './MainSearch.css';
import { useLocation } from 'react-router';

export default function MainSearch() {
    const [feedList, setFeedList] = useState([]);
    const [hostClassList, setHostClassList] = useState([]);
    const [gatheringList, setGatheringList] = useState([]);



    // 통합 리스트 만들기
    const totalList = [
        ...feedList.map(item => ({
            id: item.feedId,
            title: item.content,
            img: item.img1,
            content: item.content,
            type: 'feed',
        })),
        ...hostClassList.map(item => ({
            id: item.classId,
            title: item.name,
            img: item.thumbnailUrl || item.imageList?.[0] || '', // 예시
            content: item.detailDescription,
            type: 'class',
        })),
        ...gatheringList.map(item => ({
            id: item.gatheringId,
            title: item.title,
            img: item.thumbnail || '',
            content: item.intro,
            type: 'gathering',
        })),
    ];

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery().get('query');

    // 랜덤 섞기
    const shuffledList = [...totalList].sort(() => Math.random() - 0.5);

    useEffect(() => {
        const params = { searchQuery: query };

        myAxios().post('/searchAll', params)
            .then(res => {
                setFeedList(res.data.feedList);
                setHostClassList(res.data.hostClassList);
                setGatheringList(res.data.gatheringList);
            })
            .catch(err => console.log(err));
    }, [query]);

    const getLabel = (type) => {
        switch (type) {
            case 'feed': return '소셜링';
            case 'class': return '클래스링';
            case 'gathering': return '게더링';
            default: return '';
        }
    };

    const truncate = (str, length = 20) => {
        if (!str) return '';
        return str.length > length ? str.slice(0, length) + '...' : str;
    };

    return (
        <>
            <Header />
            <main className="main-container">
                <h2 className="section-title">"{query}" 검색 결과</h2>

                <div className="card-grid">
                    {shuffledList.map(item => (
                        <div className="card" key={`${item.type}-${item.id}`}>
                            <div className="card-image">
                                <img src={`{/${url}/iupload/${item.img} || '/no-image.png'}`} alt={item.title} />
                                <span className={`label ${item.type}`}>{getLabel(item.type)}</span>
                            </div>
                            <div className="card-content">
                                <h4>{item.title}</h4>
                                <h4>{truncate(item.content, 10)}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
