// /payment/success.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { myAxios } from "../../../config"; 
import { tokenAtom, userAtom,tokenAtom2  } from "../../../atoms";
import { useSetAtom, useAtomValue, useAtom } from "jotai";

export default function PaymentSuccess() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useAtom(tokenAtom);
    const user = useAtomValue(userAtom);
    const tokenFromLocal = useAtomValue(tokenAtom2); // ✅ localStorage 기반
    const calendarId = params.get('calendarId');
    const userCouponId = params.get('userCouponId');


    useEffect(() => {
        if (!token) {
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken); // ✅ 직접 넣어줌
            }
        }
    }, []);

    useEffect(() => {
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');

    if (paymentKey && orderId && amount) {
        const approve = async () => {
        try {
            token && await myAxios(token, setToken).post('/user/payment/approve', {
            paymentKey,
            orderNo: orderId,
            amount,
            paymentType: '카드',
            calendarId: parseInt(calendarId),
            userCouponId: userCouponId ? parseInt(userCouponId) : null
            });
            navigate('/user/payment/payment-result');
        } catch (err) {
            console.error('❌ 결제 승인 실패', err);
            alert('결제 승인 중 문제가 발생했습니다.');
        }
        };
        approve();
    }
    }, [params,token]);


    return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🎉 결제가 완료되었습니다!</h2>
        <p>클래스 신청이 성공적으로 처리되었습니다.</p>
    </div>
    );
}
