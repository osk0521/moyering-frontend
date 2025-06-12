import React from 'react';
import styles from './MyCouponList.module.css';

export default function MyCouponList() {
  const coupons = [
    { id: 1, title: '3000원 쿠폰', type: '전체 쿠폰', used: false, date: '2025.05.26~2025.06.26' },
    { id: 2, title: '10% 할인 쿠폰', type: '클래스 전용', used: true, date: '2025.05.26~2025.06.26' },
    { id: 3, title: '3000원 쿠폰', type: '전체 쿠폰', used: false, date: '2025.05.26~2025.06.26' },
  ];

  return (
    <div className={styles.myCouponPage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBox}>회원정보</div>
      </aside>

      <main className={styles.couponContent}>
        <h2 className={styles.title}>마이 쿠폰</h2>
        <div className={styles.couponList}>
          {coupons.map((coupon) => (
            <div key={coupon.id} className={styles.couponBox}>
              <div className={styles.couponHeader}>
                <strong>{coupon.title}</strong>
                <span className={coupon.used ? styles.usedBadge : styles.notUsedBadge}>
                  {coupon.used ? '사용' : '미사용'}
                </span>
              </div>
              <div className={styles.couponType}>{coupon.type}</div>
              <div className={styles.couponDate}>유효기간: {coupon.date}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
