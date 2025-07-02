// ClassRingDetail.jsx
import React, { useState, useEffect } from "react";
import { CiHeart, CiCalendar, CiClock1, CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { BiChevronDown } from "react-icons/bi";
import styles from "./ClassRingDetail.module.css";
import Header from "./Header";
import { useNavigate, useParams } from "react-router";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import {
  calendarListAtom,
  classDetailAtom,
  currListAtom,
  hostAtom,
  reviewListAtom,
  classLikesAtom,
} from '../../atom/classAtom';
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";
import KakaoMap from "./KakaoMap";
import { url } from '../../config';
import { FaStar } from "react-icons/fa";
import ClassRingDetailInquiryList from "./ClassRingDetailInquiryList";
import useFetchUserClassLikes from "../../hooks/common/useFetchUserClassLikes";
import Footer from "../../components/Footer";


export default function ClassRingDetail() {
  useFetchUserClassLikes();
  const classLikes = useAtomValue(classLikesAtom);
  const [activeTab, setActiveTab] = useState("details");
  const [isExpanded, setIsExpanded] = useState(false);
  const PREVIEW_LENGTH = 300;
  const navigate = useNavigate();

  const { classId } = useParams();
  const [token,setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);
  const setCalendarList = useSetAtom(calendarListAtom);
  const setClassDetailAtom = useSetAtom(classDetailAtom);
  const setCurrListAtom = useSetAtom(currListAtom);
  const setHostAtom = useSetAtom(hostAtom);
  const setReviewListAtom = useSetAtom(reviewListAtom);

  const calendarList = useAtomValue(calendarListAtom);
  const classDetail = useAtomValue(classDetailAtom);
  const currList = useAtomValue(currListAtom);
  const host = useAtomValue(hostAtom);
  const reviews = useAtomValue(reviewListAtom);

  const description = classDetail ? classDetail.detailDescription : '';
  const previewText = description.length > PREVIEW_LENGTH ? description.slice(0, PREVIEW_LENGTH) + "..." : description;
  const shouldShowMore = description.length > PREVIEW_LENGTH;

  //쿠폰관련
  const [coupons, setCoupons] = useState([]);
  //유저가 소유한 쿠폰
  const [myCoupons, setMyCoupons] = useState([]);
  

  const recommendedClasses = [
    {
      id: 1,
      image: "/img/class1.png",
      category: "핸드메이드",
      location: "서울/성동구",
      title: "세상에서 하나뿐인 머그컵 만들기",
      date: "25.6(월) 오후 2:00",
    },
    {
      id: 2,
      image: "/img/class2.png",
      category: "핸드메이드",
      location: "서울/마포구",
      title: "향수 만들기 원데이 클래스",
      date: "25.6(월) 오후 2:00",
    },
  ];


  const handleExpandClick = () => setIsExpanded(true);
  const handleTabClick = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 140, behavior: "smooth" });
    setActiveTab(id);
  };

  useEffect(() => {
    const sections = ["details", "schedule", "location", "instructor", "reviews", "questions"];
    const onScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY + 200 >= el.offsetTop) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //데이터 fetch용
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res =  await myAxios(token,setToken).get(`/class/classRingDetail/${classId}`);
  //       setCalendarList(res.data.calendarList);
  //       setClassDetailAtom(res.data.hostClass);
  //       setCurrListAtom(res.data.currList);
  //       setHostAtom(res.data.host);
  //       setReviewListAtom(res.data.reviews);
  //       setCoupons(res.data.coupons);
  //       console.log(res);
  //     } catch (err) {
  //       console.error("클래스 상세 데이터 로딩 실패", err);
  //     }
  //   };

  //   if (classId && token) {
  //   }
  //   fetchData();
  // }, [classId, token]);

    useEffect(() => {
        myAxios(token,setToken)
          .get(`/class/classRingDetail/${classId}`)
          .then((res) => {
            setCalendarList(res.data.calendarList);
            setClassDetailAtom(res.data.hostClass);
            setCurrListAtom(res.data.currList);
            setHostAtom(res.data.host);
            setReviewListAtom(res.data.reviews);
            setCoupons(res.data.coupons);
            setMyCoupons(res.data.userCoupons || []);
            console.log(res.data);
          })
          .catch((err) => console.error("클래스 추천 데이터 로딩 실패", err));
  }, [token]);

  //날짜에 따른 값 제어
  const [selectedCalendarId, setSelectedCalendarId] = useState('');
  const selectedCalendar = calendarList.find(c => c.calendarId == selectedCalendarId);
  // useEffect(() => {
  //   if (calendarList.length > 0 && !selectedCalendarId) {
  //     setSelectedCalendarId(calendarList[0].calendarId);
  //   }
  // }, [calendarList, selectedCalendarId]);

  useEffect(() => {
  if (calendarList.length > 0) {
    setSelectedCalendarId(calendarList[0].calendarId);
  }
}, [classId, calendarList]);
  //쿠폰 데이터
  // 쿠폰 상태 바뀔 때마다 실행됨
  useEffect(() => {
  }, [coupons]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [downloadedIds, setDownloadedIds] = useState([]);

    const handleDownload = async (classCouponId) => {
      if (!user || !token) {
        if (confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
          navigate("/userlogin");
        }
        return;
      }
      try {
        token && await myAxios(token,setToken).post("/user/classCoupons/download", {
          classCouponId,
        });

        // 성공 후 쿠폰 리스트 갱신 or UI 업데이트
        setCoupons(prev =>
          prev.map(c =>
            c.classCouponId === classCouponId
              ? { ...c, usedCnt: c.usedCnt + 1 }
              : c
          )
        );

        setMyCoupons(prev => [
          ...prev,
          { classCouponId },
        ]);
        setDownloadedIds(prev => [...prev, classCouponId]);

      } catch (err) {
        console.error("쿠폰 다운로드 실패", err);
        alert(err.response?.data?.message || "쿠폰 다운로드 중 오류 발생");
      }
    };

    //찜하기
    const [isLiked, setIsLiked] = useState(false);
    useEffect(() => {
      
      const liked = classLikes.some((like) => like.classId ===  Number(classId));
      setIsLiked(liked);
    }, [classLikes, classId]);

    const handleHeart = async(classId) => {
      try {
        const res = token && await myAxios(token,setToken).post("/user/toggle-like", {
          classId : classId
        })
        const updated = token && await myAxios(token,setToken).get(`/class/classRingDetail/${classId}`);
        setIsLiked(!isLiked);

      } catch (err) {
        console.error("좋아요 실패", err);
        alert(err.response?.data?.message || "쿠폰 좋아요 중 오류 발생");
      }
    };
  return (
    <>
      <Header />
      <div className={styles.detailWrapper}>
        <main className={styles.mainContent}>
          {classDetail?.imgName1 && (
          <img src={`${url}/image?filename=${classDetail?.imgName1}`} alt="클래스 이미지" className={styles.mainImage} />
          )}
          {/* 메뉴 */}
          <nav className={styles.tabs}>
            {[
              { id: "details", label: "상세 정보" },
              { id: "location", label: "위치" },
              { id: "instructor", label: "강사소개" },
              { id: "reviews", label: "강사 후기" },
              { id: "questions", label: "질문" },
              { id: "recommend", label: "추천" }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className={`${styles.tab} ${activeTab === id ? styles.active : ""}`}
              >
                {label}
              </button>
            ))}
          </nav>
          {/* 상세정보 */}
          <section className={styles.section} id="details">
            <h2>클래스 소개</h2>
            <p>{isExpanded ? description : previewText}</p>
            {shouldShowMore && !isExpanded && (
              <button onClick={handleExpandClick} className={styles.moreBtn}>더보기 <BiChevronDown /></button>
            )}

            {/* 준비물 섹션 */}
            <div className={styles.preparation}>
              <h3>준비물</h3>
              <p>{classDetail?.preparation}</p>
            </div>
            <hr />
            {/* 커리큘럼 섹션 */}
            <div className={styles.curriculum}><h3><CiClock1 className={styles.infoIcon} />커리큘럼</h3>
              <ul className={styles.curriculumList}>{currList.map((currList) => {
                return (
                  <li key={currList.calendarId}>
                    <span className={styles.curriculumTime}>9:00</span>
                    <span className={styles.curriculumContent}>하산 및 뒷풀이 참여 희망자 모임</span>
                  </li>
                );
              })}
              </ul>
            </div>
          </section>
          {/* 위치 */}
          <section className={styles.section} id="location">
            <h2>위치</h2>
            <div className={styles.row}><CiLocationOn className={styles.infoIcon} /> {classDetail?.addr} {classDetail?.detailAddr} {classDetail?.locName}</div>
            <div className={styles.mapPlaceholder}>
              {classDetail?.latitude && classDetail?.longitude ? (
                <KakaoMap
                  latitude={classDetail.latitude}
                  longitude={classDetail.longitude}
                  address={`${classDetail.addr} ${classDetail.detailAddr ?? ""}`}
                />
              ) : (
                <div>지도를 로드할 데이터를 불러오는 중입니다...</div>
              )}
            </div>
          </section>
          {/* 강사소개 */}
          <section className={styles.section} id="instructor">
            <h2>강사소개</h2>
            <div className={styles.instructorCard}>
              {host?.profile && (
              <img className={styles.instructorImage} src={`${url}/image?filename=${host?.profile}`} alt="강사 이미지" />
              )}
              <div className={styles.instructorInfo}>
                <h3>{host?.name} ⭐ 5(138)</h3>
                <p>{host?.intro}</p>
                <div className={styles.instructorTags}>
                  {host?.tag1 && <span>{host.tag1}</span>}
                  {host?.tag2 && <span>{host.tag2}</span>}
                  {host?.tag3 && <span>{host.tag3}</span>}
                  {host?.tag4 && <span>{host.tag4}</span>}
                  {host?.tag5 && <span>{host.tag5}</span>}
                </div>
              </div>
            </div>
          </section>
          {/* 후기 */}
          <section className={styles.section} id="reviews">
            <h2>강사 후기</h2>
            <div className={styles.reviewCard}>
              {reviews.map((r, i) => (
                <div key={r?.reviewId} className={styles.reviewDiv}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewAuthor}>
                      <img src={`${url}/image?filename=${r?.profileName}`} alt="작성자 프로필 사진 " width="30" height="30" style={{ borderRadius: "50%" }} />
                      {r?.studentName}
                      <span className={styles.reviewStars}>
                        {[...Array(r.star)].map((_, i) => (
                          <FaStar key={i} color="#FFD700" />
                        ))}
                      </span>
                    </div>
                    <span>{r?.reviewDate}</span>
                  </div>
                  <div className={styles.reviewContent}>
                    {r?.content}
                  </div>
                  {r?.revRegCotnent &&
                    <div className={styles.reviewReply}>
                      <div className={styles.reviewAuthor}>
                        <div className={styles.reviewReplyHeader}>
                          <img src={`${url}/image?filename=${r?.hostProfileName}`} alt="작성자 프로필 사진 " width="30" height="30" style={{ borderRadius: "50%" }} />
                          {r?.hostName}
                        </div>
                        <span className={styles.responseDate}>{r?.responseDate}</span>
                      </div>
                      <div>
                        {r?.revRegCotnent}
                      </div>
                    </div>
                  }
                </div>
              ))}
            </div>
            {host && (
              <button
                className={styles.reviewMoreBtn}
                onClick={() => navigate(`/classRingReviewList/${host.hostId}`)}
              >
                더보기
              </button>
            )}
          </section>
          {/* 질문 */}
          <section className={styles.section} id="questions">
            <ClassRingDetailInquiryList classId={classId} />
          </section>
          {/* 추천 클래스 섹션 */}
          <section className={styles.section} id="recommend">
            <div className={styles.recommendHeader}>
              <h2>같은 카테고리의 모임은 어때요</h2>
              <button className={styles.recommendMoreBtn}>더보기</button>
            </div>
            <p className={styles.subText}>비슷한 주제 모임</p>
            <div className={styles.recommendGrid}>
              {recommendedClasses.map((cls) => (
                <div key={cls.id} className={styles.recommendCard}>
                  <img src={cls.image} alt={cls.title} className={styles.recommendImage} />
                  <div className={styles.recommendTags}>
                    <span className={styles.categoryTag}>{cls.category}</span>
                    <span className={styles.locationTag}>{cls.location}</span>
                  </div>
                  <div className={styles.recommendTitle}>{cls.title}</div>
                  <div className={styles.recommendTime}>{cls.date}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.cardBox}>
            <div className={styles.badges}>
              <span className={styles.badgeCategory}>{classDetail?.category1}&gt;{classDetail?.category2}</span>
              <span className={styles.badgeLocation}>{classDetail?.addr}</span>
            </div>
            <h1 className={styles.title}>{classDetail?.name}</h1>
            <div className={styles.row}><CiCalendar className={styles.infoIcon} />
              <select className={styles.couponList}
                value={selectedCalendarId}
                onChange={(e) => setSelectedCalendarId(e.target.value)}
              >
                {calendarList.map((calendar) => {
                  const date = new Date(calendar.startDate);
                  const dayName = date.toLocaleDateString('ko-KR', { weekday: 'short' });
                  return (
                    <option value={calendar.calendarId} key={calendar.calendarId}>
                      {calendar.startDate} ({dayName})
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles.row}><CiClock1 className={styles.infoIcon} /><span>오전 10:00 ~ 오후 1:00</span></div>
            <div className={styles.row}>
              <GoPeople className={styles.infoIcon} />
              <span>
                {selectedCalendar?.registeredCount ?? '0'}명 참가 중 (최소 {classDetail?.recruitMin}명, 최대 {classDetail?.recruitMax === 0 ? "제한없음" : classDetail?.recruitMax + "명"})
              </span>
            </div>
            <div className={styles.row}><CiLocationOn className={styles.infoIcon} />
              <span>{classDetail?.addr} {classDetail?.detailAddr} {classDetail?.locName}</span>
            </div>
            <div className={styles.row}>
              {/* 쿠폰 */}
              <div className={styles.customDropdown}>
                <div 
                  className={styles.dropdownHeader} 
                  onClick={() => {
                    if (coupons.length > 0) setIsOpen(!isOpen);
                  }}
                >
                  {coupons.length === 0
                    ? "사용 가능한 쿠폰이 없습니다"
                    : selectedCoupon 
                      ? selectedCoupon.couponName 
                      : "사용 가능한 쿠폰을 선택하세요"}
                </div>

                {/* {isOpen && coupons.length > 0 && (
                  <ul className={styles.dropdownList}>
                    {coupons.map(c => (
                      <li 
                        key={c.classCouponId} 
                        className={styles.dropdownItem}
                      >
                        <span
                          className={
                            c.amount - c.usedCnt === 0
                              ? styles.couponTextDisabled
                              : styles.couponText
                          }
                        >
                          [{c.amount - c.usedCnt > 0 ? `${c.amount - c.usedCnt}매` : '소진'}] 
                          {c.couponName} 
                          {c.discountType === 'RT' 
                            ? ` ${c.discount}%`
                            : ` ${c.discount.toLocaleString()}원`} 
                        </span>
                        { c.amount - c.usedCnt === 0 ? '' :
                          <button 
                          disabled={c.amount - c.usedCnt === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(c.classCouponId);
                          }}
                          className={styles.downloadBtn}
                        >
                          다운
                        </button>
                        }
                        
                      </li>
                    ))}
                  </ul>
                )} */}

                {isOpen && coupons.length > 0 && (
                  <ul className={styles.dropdownList}>
                    {coupons?.map(c => {
                      const remaining = c.amount - c.usedCnt;
                      const isDownloaded = myCoupons.some(
                        mc => mc.classCouponId === c.classCouponId
                      );

                      return (
                        <li key={c.classCouponId} className={styles.dropdownItem}>
                          <span
                            className={
                              remaining === 0
                                ? styles.couponTextDisabled
                                : styles.couponText
                            }
                          >
                            [{remaining > 0 ? `${remaining}매` : '소진'}] {c.couponName}
                            {c.discountType === 'RT'
                              ? ` ${c.discount}%`
                              : ` ${c.discount.toLocaleString()}원`}
                          </span>

                          {/* 남은 쿠폰이 있을 때만 버튼 렌더링 */}
                          {remaining > 0 && (
                            <button
                              disabled={isDownloaded}
                              onClick={e => {
                                e.stopPropagation();
                                handleDownload(c.classCouponId);
                              }}
                              className={
                                isDownloaded
                                  ? styles.downloadBtnDisabled
                                  : styles.downloadBtn
                              }
                            >
                              {isDownloaded ? '완료' : '다운'}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

              </div>
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.outlineBtn} 
              onClick={(e) => {
                            e.stopPropagation();
                            handleHeart(classId);
                          }}
              >
                {isLiked ? (
                <>
                  <CiHeart className="GatheringDetail_top-icon_osk GatheringDetail_liked_osk" />{" "}
                  찜해제
                </>
              ) : (
                <>
                  <CiHeart className="GatheringDetail_top-icon_osk" />{" "}
                  찜하기
                </>
              )}
              </button>
              <button className={styles.applyBtn} onClick={()=> navigate(`/user/ClassPayment/${classId}/${selectedCalendarId}`)}>신청하기</button>
            </div>
            <p className={styles.etc}>결제 취소는 수강 2일 전까지만 가능합니다.</p>
          </div>
        </aside>
      </div>
      <Footer/>
    </>
  );
}
