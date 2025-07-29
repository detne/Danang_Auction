import React, { useEffect, useState } from 'react';
import apiClient from '../../services/api';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';

const TransactionHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const result = await apiClient.get('/user/wallet/my-history');
                console.log("✅ Kết quả từ API:", result);

                if (Array.isArray(result)) {
                    setHistory(result);
                } else if (Array.isArray(result.data)) {
                    setHistory(result.data);
                } else {
                    throw new Error("Phản hồi API không hợp lệ");
                }
            } catch (err) {
                console.error("❌ Error khi gọi API:", err);
                setError('Không thể tải dữ liệu giao dịch.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="container py-5">
            <h3 className="mb-4">📄 Hồ sơ giao dịch</h3>

            {loading && <Spinner animation="border" />}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && history.length === 0 && !error && (
                <p>Không có giao dịch nào.</p>
            )}

            {!loading && history.length > 0 && (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Số tiền</th>
                                <th>Loại</th>
                                <th>Trạng thái</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{Number(item.amount).toLocaleString('vi-VN')} VND</td>
                                    <td>
                                        {item.type === 'DEPOSIT'
                                            ? 'Nạp tiền'
                                            : item.type === 'WITHDRAW'
                                                ? 'Rút tiền'
                                                : item.type}
                                    </td>
                                    <td>
                                        {item.status === 'PENDING'
                                            ? 'Đang xử lý'
                                            : item.status === 'COMPLETED'
                                                ? 'Thành công'
                                                : item.status === 'FAILED'
                                                    ? 'Thất bại'
                                                    : item.status}
                                    </td>
                                    <td>{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="mt-3">
                        <Button variant="secondary" onClick={() => window.history.back()}>
                            ⬅️ Quay lại
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TransactionHistoryPage;