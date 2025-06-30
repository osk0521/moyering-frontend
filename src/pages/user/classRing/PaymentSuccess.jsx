// /payment/success.jsx
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { myAxios } from "../../../config"; // 경로는 알아서 맞추기
import { tokenAtom } from "../../../atoms";
import { useAtom } from "jotai";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const [token, setToken] = useAtom(tokenAtom);
    console.log("✅ PaymentSuccess mounted")
    useEffect(() => {
        const orderNo = params.get("orderNo");
        const calendarId = params.get("calendarId");
        const userCouponId = params.get("userCouponId");
        const amount = params.get("amount");

        const approvePayment = async () => {
            try {
            await myAxios(token, setToken).post('/user/payment/approve', {
                orderNo,
                calendarId,
                userCouponId: userCouponId || null,
                amount: amount, 
                paymentType: '카드',
            });
            alert('결제가 완료되었습니다.');
            } catch (err) {
            console.error("결제 승인 실패", err);
            alert('결제 승인 중 문제가 발생했습니다.');
            }
        };

        if (orderNo && calendarId && amount) {
            approvePayment();
        }    
    }, []);

    return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🎉 결제가 완료되었습니다!</h2>
        <p>클래스 신청이 성공적으로 처리되었습니다.</p>
    </div>
    );
}
