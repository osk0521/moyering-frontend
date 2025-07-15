import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { myAxios } from '../../config';
import Header from './Header';
import './MainSearch.css';
import Footer from './Footer';

export default function MainSearch() {
    const [feedList, setFeedList] = useState([]);
    const [hostClassList, setHostClassList] = useState([]);
    const [gatheringList, setGatheringList] = useState([]);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery().get('query');

    // 🔄 검색어가 바뀔 때 페이지 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    useEffect(() => {
        const params = { searchQuery: query, page: currentPage - 1, size: itemsPerPage };
        myAxios()
            .post('/searchAll', params)
            .then(res => {
                console.log(res.data);
                setFeedList(res.data.feedList);
                setHostClassList(res.data.hostClassList);
                setGatheringList(res.data.gatheringList);
                setTotalPages(res.data.totalPages)
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

    function truncateHtml(html, maxLength) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    }

    // 🔄 섞기: useMemo로 캐싱
    const shuffledList = useMemo(() => {
        return [
            ...feedList.map(item => ({
                id: item.feedId,
                title: item.content,
                content: item.content,
                date: item.createdAt,
                type: 'feed',
            })),
            ...hostClassList.map(item => ({
                id: item.classId,
                title: item.name,
                content: item.detailDescription,
                date: item.regDate,
                type: 'class',
            })),
            ...gatheringList.map(item => ({
                id: item.gatheringId,
                title: item.title,
                content: item.intro,
                date: item.createDate,
                type: 'gathering',
            })),
        ].sort(() => Math.random() - 0.5);
    }, [feedList, hostClassList, gatheringList]);

    // 페이지네이션 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = shuffledList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(shuffledList.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <Header />
            <main className="main-container">
                <h2 className="section-title">“{query}”에 대한 검색 결과입니다 </h2>

                <div className="result-wrapper">
                    {shuffledList.length === 0 ? (
                        <div className="no-result">😢 결과가 없습니다. 다른 키워드를 입력해보세요.</div>
                    ) : (
                        currentItems.map((item, index) => (
                            <div
                                key={`${item.type}-${item.id}`}
                                className="card row-style"
                                onClick={() => {
                                    if (item.type === 'feed') navigate(`/feed/${item.id}`);
                                    if (item.type === 'gathering') navigate(`/gatheringDetail/${item.id}`);
                                    if (item.type === 'class') navigate(`/class/classRingDetail/${item.id}`);
                                }}
                            >
                                <div className="card-content">
                                    <div className="card-title">
                                        <span className={`type-text ${item.type}`}>{getLabel(item.type)} | </span>
                                        {truncate(item.title, 30)}
                                    </div>
                                    <br />
                                    {item.content && (
                                        <div className="card-content-text viewer-wrapper">
                                            {item.content.includes('<') || item.content.includes('>') ? (
                                                <div dangerouslySetInnerHTML={{ __html: truncateHtml(item.content, 100) }} />
                                            ) : (
                                                <div>{truncate(item.content, 100)}</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="card-date">{item.date}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {totalPages > 1 && (
                <div className="pagination-wrapper">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}

            <Footer />
        </>
    );
}
