import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../services/api";
import { formatCurrency } from "../../utils/formatCurrency";
import { useUser } from "../../contexts/UserContext";

export default function WinnerPaymentPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        const token = user?.token || localStorage.getItem("token");
        const userId = user?.id || localStorage.getItem("userId"); // fallback nếu cần

        if (!token) {
            setLoading(false);
            setMessage("Bạn cần đăng nhập để xem thanh toán.");
            return;
        }

        const fetchInfo = async () => {
            try {
                const res = await apiClient.get(`/user/wallet/auction/${sessionId}/info`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInfo(res.data);

                // 🔹 Sinh QR Code từ amountToPay
                if (res.data.success) {
                    const qrUrl = `https://qr.sepay.vn/img?acc=${
                        process.env.REACT_APP_SEPAY_ACCOUNT
                    }&bank=${process.env.REACT_APP_SEPAY_BANK}&amount=${Math.round(
                        res.data.amountToPay
                    )}&des=AUCTION-${sessionId}-USER-${userId}`;
                    setQrCode(qrUrl);
                }
            } catch (err) {
                setMessage(err.response?.data?.message || "Lỗi tải thông tin thanh toán");
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [sessionId, user]);

    const handleAutoDeduct = async () => {
        const token = user?.token || localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Vui lòng đăng nhập lại trước khi thanh toán.");
            return;
        }

        try {
            const res = await apiClient.post(
                `/user/wallet/auction/${sessionId}/auto-deduct`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message || "Đã trừ tiền thành công ✅");
            setTimeout(() => navigate("/profile"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Lỗi khi trừ tiền tự động ❌");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>⏳ Đang tải thông tin...</div>;

    if (!info?.success)
        return (
            <div style={{ color: "red", padding: 32, textAlign: "center" }}>
                {message || "Không thể lấy thông tin thanh toán."}
            </div>
        );

    return (
        <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", padding: 32, borderRadius: 12 }}>
            <h2>💰 Thanh toán phiên đấu giá #{sessionId}</h2>

            <p>Giá trúng: <strong>{formatCurrency(info.finalPrice)}</strong></p>
            <p>Tiền đặt cọc: <strong>{formatCurrency(info.deposit)}</strong></p>
            <h3>Số tiền cần thanh toán: <strong>{formatCurrency(info.amountToPay)}</strong></h3>
            <p>Trạng thái: <strong>{info.paymentStatus}</strong></p>

            {qrCode && (
                <div style={{ margin: "20px 0", textAlign: "center" }}>
                    <p>Quét mã QR để thanh toán số tiền còn lại:</p>
                    <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200 }} />
                </div>
            )}

            {message && (
                <div style={{ marginTop: 12, color: message.includes("thành công") ? "green" : "red" }}>
                    {message}
                </div>
            )}

            <button
                style={{
                    marginTop: 20,
                    padding: "12px 24px",
                    background: "#d32f2f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    width: "100%",
                    cursor: "pointer",
                }}
                onClick={handleAutoDeduct}
            >
                💳 Tự động trừ tiền từ ví
            </button>
        </div>
    );
}
