import React, { useState, useEffect  } from 'react';
import styles from './ClassPayment.module.css';
import { useNavigate, useParams } from "react-router";
import Header from "../../../pages/common/Header";
import Footer from "../../../pages/common/Footer";
import { myAxios } from "../../../config";
import { useSetAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../../atoms";

export default function ClassPayment() {
  const navigate = useNavigate();
  const { classId,selectedCalendarId } = useParams();
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const selectedCouponObj = paymentInfo?.userCoupons.find(
    (c) => c.ucId == selectedCoupon
  );


  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const res = await myAxios(token).get(`/user/payment/${classId}/${selectedCalendarId}`);
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

  const basePrice = paymentInfo?.hostClass?.price || 0;
  const discount = selectedCouponObj?.discountAmount ??
                  Math.round((selectedCouponObj?.discountRate || 0) * paymentInfo?.hostClass.price) ??
                  0;
  const finalPrice = basePrice - discount;

  const handleApplyCoupon = () => {
    if (selectedCoupon) setCouponApplied(true);
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
              <label><input type="checkbox" defaultChecked /> 전체 동의</label>
              <label><input type="checkbox" defaultChecked /> [필수] 서비스 이용약관 동의</label>
              <label><input type="checkbox" defaultChecked /> [필수] 개인정보 수집 및 이용 동의</label>
              <label><input type="checkbox" defaultChecked /> [선택] 마케팅 정보 수신 동의</label>
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
                <option value="">마이 쿠폰</option>
                {paymentInfo?.userCoupons.map((coupon) => (
                  <option key={coupon.ucId} value={coupon.ucId}>
                    {coupon.couponName}
                  </option>
                ))}
              </select>
              <button onClick={handleApplyCoupon}>적용</button>
            </div>
            {selectedCoupon && (
              <p className={styles.couponItem}>{selectedCoupon}</p>
            )}
            {couponApplied && (
              <p className={styles.couponAppliedMsg}>
                ✅ {selectedCoupon} 쿠폰이 적용되었습니다. (₩{discount.toLocaleString()} 할인)
              </p>
            )}
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
            <button className={styles.payButton}>₩{finalPrice.toLocaleString()} 결제하기</button>
            <p className={styles.notice}>결제 시 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.</p>
          </div>
        </aside>
      </div>
    </div>
    <Footer/>
    </>
  );
}
