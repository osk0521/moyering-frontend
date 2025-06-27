import React, { useState, useEffect  } from 'react';
import styles from './ClassPayment.module.css';
import { useNavigate, useParams } from "react-router";
import Header from "../../../pages/common/Header";
import Footer from "../../../pages/common/Footer";
import { myAxios } from "../../../config";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../../atoms";

export default function ClassPayment() {
  const navigate = useNavigate();
  const { classId,selectedCalendarId } = useParams();
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const [token,setToken] = useAtom(tokenAtom);
  const user = useAtomValue(userAtom);



  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const res = await myAxios(token,setToken).get(`/user/payment/${classId}/${selectedCalendarId}`);
        setPaymentInfo(res.data);
        console.log("결제 정보:", res.data);
      } catch (err) {
        console.error("결제 정보 조회 실패", err);
      }
    };

    if (classId && selectedCalendarId) {
      fetchPaymentInfo();
    }
  }, [classId, selectedCalendarId,token]);

  const selectedCouponObj = paymentInfo?.userCoupons.find(
    (c) => c.ucId == selectedCoupon
  );

  const basePrice = paymentInfo?.hostClass?.price || 0;

  const discount =
    couponApplied && selectedCouponObj
      ? selectedCouponObj.discountType === "AMT"
        ? selectedCouponObj.discount
        : Math.round((selectedCouponObj.discount / 100) * basePrice)
      : 0;

  const finalPrice = basePrice - discount;

  const handleApplyCoupon = () => {
    if (selectedCoupon) setCouponApplied(true);
  };
  //이용약관 동의
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openCaution, setOpenCaution] = useState(false);

  const [agreements, setAgreements] = useState({
    all: true,
    terms: true,
    privacy: true,
    caution: true,
  });

  const toggleAgreement = (key) => {
    if (key === 'all') {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        terms: newValue,
        privacy: newValue,
        caution: newValue,
      });
    } else {
      const newAgreements = {
        ...agreements,
        [key]: !agreements[key],
      };
      newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.caution;
      setAgreements(newAgreements);
    }
  };

  return (
    <>
    <Header/>
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>클래스링 결제</h2>

      <div className={styles.mainGrid}>
        <section className={styles.leftColumn}>
          <div className={styles.box}>
            <h3 className={styles.boxTitle}>클래스링 결제</h3>
            <div className={styles.classInfoBox}>
              <img src="/public/myclassList.png" alt="class" className={styles.classImage} />
              <div>
                <h4 className={styles.classTitle}>{paymentInfo?.hostClass.name}</h4>
                <p>강사 : {paymentInfo?.hostName}</p>
                <p>수업 일자 : {paymentInfo?.startDate}</p>
                <p className={styles.classPrice}>₩{paymentInfo?.hostClass.price.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          <div className={styles.box}>
            <h3 className={styles.boxTitle}>이용약관 동의</h3>
            <div className={styles.agreeGroup}>
              {/* 전체 동의 */}
              <div>
                <label style={{ fontWeight: '600', fontSize:'1.2rem' }}>
                  <input
                    type="checkbox"
                    checked={agreements.all}
                    onChange={() => toggleAgreement('all')}
                  /> 전체 동의
                </label>
              </div>

              {/* 서비스 이용약관 */}
              <div className={styles.accordionSection}>
                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader}>
                    <label>
                      <input
                        type="checkbox"
                        checked={agreements.terms}
                        onChange={() => toggleAgreement('terms')}
                      /> [필수] 서비스 이용약관 동의
                    </label>
                    <button type="button" onClick={() => setOpenTerms(!openTerms)} className={styles.accordionBtn}>
                      {openTerms ? '▲' : '▼'}
                    </button>
                  </div>
                  {openTerms && (
                    <div className={styles.accordionContent}>
                      여기에 서비스 이용약관 본문이 들어갑니다. (예: 서비스 제공 조건, 회원의 의무 등...)
                    </div>
                  )}
                </div>

              </div>
              {/* 개인정보 수집 */}
              <div className={styles.accordionSection}>
                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader}>
                  <label>
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() => toggleAgreement('privacy')}
                  /> [필수] 개인정보 수집 및 이용 동의
                        </label>
                  <button type="button" onClick={() => setOpenPrivacy(!openPrivacy)} className={styles.accordionBtn}>
                    {openPrivacy ? '▲' : '▼'}
                  </button>
                  </div>
                {openPrivacy && (
                  <div className={styles.accordionContent}>
                    수집 항목: 이름, 연락처, 이메일 등<br />
                    목적: 서비스 제공, 예약 확인, 고객 대응 등
                  </div>
                )}
              </div>
              </div>

              {/* 유의사항 */}
              <div className={styles.accordionSection}>
                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader}>
                      <label>
                  <input
                    type="checkbox"
                    checked={agreements.caution}
                    onChange={() => toggleAgreement('caution')}
                  /> [필수] 유의사항 확인
                  </label>
                  <button type="button" onClick={() => setOpenCaution(!openCaution)} className={styles.accordionBtn}>
                    {openCaution ? '▲' : '▼'}
                  </button>
                                </div>

                {openCaution && (
                  <div className={styles.agreeContent}>
                    {paymentInfo?.hostClass?.caution || '※ 별도 유의사항이 없습니다'}
                  </div>
                )}
            </div>
            </div>
                    </div>
          <div className={styles.box}>
            <h3 className={styles.boxTitle}>쿠폰 적용</h3>
            <div className={styles.couponRow}>
              <select
                value={selectedCoupon}
                onChange={(e) => {
                  setSelectedCoupon(e.target.value);
                  setCouponApplied(false);
                }}
              >
                <option value="">보유 쿠폰 내역</option>
                {paymentInfo?.userCoupons.map((coupon) => (
                  <option key={coupon.ucId} value={coupon.ucId}>
                    {coupon.couponName} [{coupon.discount}{coupon.discountType ==='RT' ? "%":"원"}]
                  </option>
                ))}
              </select>
              <button onClick={handleApplyCoupon}>적용</button>
            </div>
            {/* {selectedCoupon && selectedCouponObj && !couponApplied && (
              <p className={styles.couponItem}>
                {selectedCouponObj.couponName} 쿠폰 선택
              </p>
            )} */}

            {couponApplied && selectedCouponObj && (
              <p className={styles.couponAppliedMsg}>
                ✅ {selectedCouponObj.couponName} 쿠폰이 적용되었습니다.
                ({selectedCouponObj.discountType === "AMT"
                  ? `₩${discount.toLocaleString()} 할인`
                  : `${selectedCouponObj.discount}% 할인 → ₩${discount.toLocaleString()} 할인`
                })
              </p>
            )}
          </div>
          </div>
        </section>

        <aside className={styles.rightColumn}>
          <div className={styles.paymentSummary}>
            <h3>결제 정보</h3>
            <div className={styles.summaryRow}>
              <span>상품 금액</span>
              <span>₩{paymentInfo?.hostClass.price.toLocaleString()}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span>쿠폰 할인</span>
              <span>-₩{discount.toLocaleString()}</span>
            </div>
            <div className={styles.summaryTotal}>
              <strong>최종 결제 금액</strong>
              <strong>₩{finalPrice.toLocaleString()}</strong>
            </div>
            <button className={styles.payButton}
              disabled={!(agreements.terms && agreements.privacy && agreements.caution)}
            >₩{finalPrice.toLocaleString()} 결제하기</button>
            {!(agreements.terms && agreements.privacy && agreements.caution) && (
              <p className={styles.notice} style={{ color: 'red' }}>
                ※ 모든 필수 약관에 동의해야 결제할 수 있습니다.
              </p>
            )}

          </div>
        </aside>
      </div>
    </div>
    <Footer/>
    </>
  );
}
