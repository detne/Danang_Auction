import React from 'react';
import { useLocation } from 'react-router-dom';

function formatMoney(number) {
    if (number == null) return '';
    return Number(number).toLocaleString('vi-VN');
}

const statusColors = {
    APPROVED: "#27ae60",
    PENDING: "#f1c40f",
    REJECTED: "#e74c3c",
    FINISHED: "#2980b9"
};

const MyAuctionsPage = () => {
    const location = useLocation();
    const myAuctions = location.state?.myAuctions || [];

    return (
        <div style={{ maxWidth: 1100, padding: 24, background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h2 style={{ textAlign: "center", marginBottom: 32, color: "#ba1e1e", fontSize: 36, fontWeight: 700, letterSpacing: 1 }}>Phiên đấu giá của tôi</h2>
            {myAuctions.length === 0 ? (
                <div style={{ textAlign: "center", color: "#666", fontSize: 18 }}>Bạn chưa có phiên đấu giá nào.</div>
            ) : (
                <table
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        fontSize: 16,
                        background: "#fff"
                    }}
                >
                    <thead>
                    <tr style={{ background: "#f7f7fa", color: "#444", borderBottom: "2px solid #ba1e1e" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Mã tài sản</th>
                        <th style={{ ...thStyle, width: 160 }}>Mô tả</th>
                        <th style={thStyle}>Giá khởi điểm</th>
                        <th style={thStyle}>Tiền đặt cọc</th>
                        <th style={thStyle}>Trạng thái</th>
                        <th style={{ ...thStyle, width: 80 }}>Loại đấu giá</th>
                        <th style={{ ...thStyle, width: 110 }}>Danh mục</th>
                        <th style={{ ...thStyle, width: 110 }}>Người sở hữu</th>
                        <th style={{ ...thStyle, width: 100 }}>Đăng ký</th>
                        <th style={{ ...thStyle, width: 105 }}>Bắt đầu</th>
                        <th style={{ ...thStyle, width: 105 }}>Kết thúc</th>
                    </tr>
                    </thead>
                    <tbody>
                    {myAuctions.map((item, idx) => (
                        <tr key={item.id} style={{ background: idx % 2 === 0 ? "#fafbfc" : "#fff" }}>
                            <td style={tdStyle}>{item.id}</td>
                            <td style={tdStyleBold}>{item.document_code}</td>
                            <td style={{ ...tdStyle, maxWidth: 170, whiteSpace: 'pre-line', wordBreak: "break-word" }}>
                                {item.description}
                            </td>
                            <td style={tdStyle}>{formatMoney(item.starting_price)}</td>
                            <td style={tdStyle}>{formatMoney(item.deposit_amount)}</td>
                            <td style={{
                                ...tdStyle,
                                fontWeight: 600,
                                color: statusColors[item.status] || "#222"
                            }}>
                                {item.status}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "center" }}>{item.auction_type}</td>
                            <td style={tdStyle}>{item.category_name || item.category?.name}</td>
                            <td style={{ ...tdStyle, maxWidth: 120, whiteSpace: 'pre-line', wordBreak: "break-word" }}>
                                {item.user?.username}
                                <div style={{ color: "#888", fontSize: 13 }}>{item.user?.email}</div>
                            </td>
                            <td style={tdStyle}>{item.registered_at?.slice(0, 10)}</td>
                            <td style={tdStyle}>{item.start_time?.replace("T", " ")}</td>
                            <td style={tdStyle}>{item.end_time?.replace("T", " ")}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const thStyle = {
    padding: "10px 8px",
    textAlign: "left",
    background: "#f2e7e7",
    fontWeight: 700,
    fontSize: 15,
    borderBottom: "2px solid #ba1e1e",
    whiteSpace: "nowrap"
};
const tdStyle = {
    padding: "9px 7px",
    borderBottom: "1px solid #eaeaea",
    verticalAlign: "top",
    whiteSpace: "normal",
    wordBreak: "break-word"
};
const tdStyleBold = {
    ...tdStyle,
    fontWeight: 600,
    color: "#ba1e1e"
};

export default MyAuctionsPage;
