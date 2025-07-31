import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

const ActionButton = ({ data, onRequestDeposit }) => {
  const navigate = useNavigate();
  const now = new Date();
  const regStart = new Date(data.registration_start_time);
  const regEnd = new Date(data.registration_end_time);
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);

  const participantStatus = data.participant_status;   // Lấy trực tiếp từ API
  const depositStatus = data.deposit_status;           // PAID / PENDING / REFUNDED
  const depositAmount = data.deposit_amount;

  const buttonStyle = (bg, disabled = false) => ({
    width: "100%",
    padding: "12px 24px",
    fontSize: 16,
    backgroundColor: bg,
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1
  });

  // Kiểm tra tiền đặt cọc và gọi API tham gia
  const handleRequestDeposit = async () => {
    try {
      const res = await apiClient.get("/auth/profile");
      const latestBalance = Number(res.data?.balance ?? 0);
      const requiredDeposit = Number(depositAmount ?? 0);

      if (latestBalance < requiredDeposit) {
        navigate("/wallet/deposit");
      } else {
        await onRequestDeposit();
      }
    } catch (err) {
      console.error("⚠️ Lỗi lấy profile:", err);
      alert("Không thể kiểm tra số dư. Vui lòng thử lại!");
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* 1. Chưa tham gia và còn trong thời gian đăng ký */}
      {!participantStatus && now >= regStart && now <= regEnd && (
        <button onClick={handleRequestDeposit} style={buttonStyle("#d32f2f")}>
          Yêu cầu đặt cọc tham gia đấu giá
        </button>
      )}

      {/* 2. Đã đặt cọc nhưng đang chờ phiên bắt đầu */}
      {participantStatus === "WAITING_START" && now < startTime && (
        <button disabled style={buttonStyle("#9e9e9e", true)}>
          Bạn đã đặt cọc - Vui lòng đợi phiên bắt đầu
        </button>
      )}

      {/* 3. Phiên đang ACTIVE và user đã đủ điều kiện tham gia */}
      {participantStatus === "ONGOING" && depositStatus === "PAID" &&
        now >= startTime && now <= endTime && (
        <button
          onClick={() => navigate(`/sessions/${data.id}/bid`)}
          style={buttonStyle("#2e7d32")}
        >
          Tham gia phiên đấu giá
        </button>
      )}

      {/* 4. Phiên đã kết thúc */}
      {now > endTime && (
        <button disabled style={buttonStyle("#9e9e9e", true)}>
          Phiên đấu giá đã kết thúc
        </button>
      )}
    </div>
  );
};

export default ActionButton;
