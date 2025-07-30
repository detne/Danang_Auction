import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

const ActionButton = ({
  data,
  alreadyJoined,
  hasDeposited,
  depositAmount,
  onRequestDeposit
}) => {
  const navigate = useNavigate();
  const now = new Date();
  const regStart = new Date(data.registration_start_time);
  const regEnd = new Date(data.registration_end_time);
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);

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

  const handleRequestDeposit = async () => {
    try {
      // ✅ Gọi API lấy profile mới nhất
      const res = await apiClient.get("/auth/profile"); // sửa endpoint
      console.log("DEBUG profile raw:", res.data);
      console.log("balance trong data:", res.data?.data?.balance);

      const latestBalance = Number(res.data?.balance ?? 0);
      const requiredDeposit = Number(depositAmount ?? 0);

      console.log("latestBalance", latestBalance, "depositAmount", depositAmount);

      if (latestBalance < requiredDeposit) {
        // ❌ Số dư không đủ -> Điều hướng trang nạp tiền
        navigate("/wallet/deposit");
      } else {
        // ✅ Đủ số dư -> gọi callback join
        await onRequestDeposit();
      }
    } catch (err) {
      console.error("⚠️ Lỗi lấy profile:", err);
      alert("Không thể kiểm tra số dư. Vui lòng thử lại!");
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {/* Giai đoạn 1: Chưa tham gia và trong thời gian đăng ký */}
      {!alreadyJoined && now >= regStart && now <= regEnd && (
        <button
          onClick={handleRequestDeposit}
          style={buttonStyle("#d32f2f")}
        >
          Yêu cầu đặt cọc tham gia đấu giá
        </button>
      )}

      {/* Giai đoạn 2: Đã đặt cọc nhưng chưa tới giờ bắt đầu */}
      {alreadyJoined && hasDeposited && now < startTime && (
        <button disabled style={buttonStyle("#9e9e9e", true)}>
          Vui lòng đợi đến thời gian phiên đấu giá
        </button>
      )}

      {/* Giai đoạn 3: Đã đặt cọc và trong thời gian phiên */}
      {alreadyJoined && hasDeposited && now >= startTime && now <= endTime && (
        <button
          onClick={() => navigate(`/sessions/${data.id}/bid`)}
          style={buttonStyle("#2e7d32")}
        >
          Tham gia phiên đấu giá
        </button>
      )}
    </div>
  );
};

export default ActionButton;
