// src/utils/formatters.js
export const formatDisplayValue = (field, value) => {
    switch (field) {
        case 'gender':
            return value === 'male' ? 'Nam' : value === 'female' ? 'Nữ' : value === 'other' ? 'Khác' : value;
        case 'verified':
            return value ? 'Đã xác thực' : 'Chưa xác thực';
        case 'account_type':
            return value === 'individual' ? 'Cá nhân' : value === 'organization' ? 'Tổ chức' : value;
        case 'status':
            return value === 'active' ? 'Hoạt động' : value === 'inactive' ? 'Không hoạt động' : value === 'suspended' ? 'Tạm khóa' : value;
        case 'dob':
        case 'identity_issue_date':
            return value ? new Date(value).toLocaleDateString('vi-VN') : '';
        default:
            return value || 'Chưa cập nhật';
    }
};
