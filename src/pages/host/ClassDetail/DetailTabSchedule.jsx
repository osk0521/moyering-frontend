import { useAtomValue } from "jotai";
import { userAtom } from "../../../atoms";
import './DetailTabSchedule.css';
const DetailTabSchedule = ({couponList}) => {


  return (
    <div className="KHJ-schedule-tab-container">
       <div className="KHJ-coupon-table-container">
          <h4>📋 적용된 쿠폰 목록</h4>
          <table className="KHJ-coupon-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>쿠폰 이름</th>
                <th>할인</th>
                <th>매수</th>
              </tr>
            </thead>
            <tbody>
              {couponList.map((c, i) => (
                <tr key={i}>
                  <td>{c.classCouponId}</td>
                  <td>{c.couponName || '(미지정)'}</td>
                  <td>{c.discount}{c.discountType === 'RT' ? '%' : '원'}</td>
                  <td>{c.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default DetailTabSchedule;
