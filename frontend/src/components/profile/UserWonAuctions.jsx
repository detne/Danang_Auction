import React from 'react';

export default function UserWonAuctions({ auctions }) {
    if (!auctions || auctions.length === 0)
        return <p className="text-gray-500">Bạn chưa thắng phiên đấu giá nào.</p>;

    return (
        <div className="mt-4">
            <ul className="space-y-3">
                {auctions.map((auc) => (
                    <li
                        key={auc.id}
                        className="border rounded p-3 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <div>
                                <span className="font-semibold text-blue-700">{auc.assetName || auc.name}</span>
                                <span className="ml-3 text-sm text-gray-500">({auc.sessionCode || auc.code})</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Giá thắng:</span>{" "}
                                <span className="font-bold text-green-600">
                  {auc.finalPrice?.toLocaleString('vi-VN') || auc.winPrice?.toLocaleString('vi-VN') || 'N/A'} VNĐ
                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Kết thúc:</span>{" "}
                                {auc.endTime ? new Date(auc.endTime).toLocaleString('vi-VN') : (auc.endedAt ? new Date(auc.endedAt).toLocaleString('vi-VN') : "N/A")}
                            </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                            {/* Có thể thêm nút xem chi tiết phiên nếu có */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
