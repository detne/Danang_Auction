// utils/formatters.js

export const formatDisplayValue = (field, value) => {
    if (!value && value !== 0) return 'Chưa cập nhật';

    switch (field) {
        case 'gender':
            const genderMap = {
                'MALE': 'Nam',
                'FEMALE': 'Nữ',
                'OTHER': 'Khác',
                'male': 'Nam',
                'female': 'Nữ',
                'other': 'Khác'
            };
            return genderMap[value] || value;

        case 'dob':
            if (value) {
                try {
                    const date = new Date(value);
                    return date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                } catch (error) {
                    return value;
                }
            }
            return 'Chưa cập nhật';

        case 'identityIssueDate':
            if (value) {
                try {
                    const date = new Date(value);
                    return date.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                } catch (error) {
                    return value;
                }
            }
            return 'Chưa cập nhật';

        case 'phoneNumber':
            if (value && typeof value === 'string') {
                // Format phone number: 0123456789 -> 0123 456 789
                const cleaned = value.replace(/\D/g, '');
                if (cleaned.length === 10) {
                    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
                } else if (cleaned.length === 11) {
                    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
                }
                return value;
            }
            return value || 'Chưa cập nhật';

        case 'accountType':
            const accountTypeMap = {
                'INDIVIDUAL': 'Cá nhân',
                'BUSINESS': 'Doanh nghiệp',
                'individual': 'Cá nhân',
                'business': 'Doanh nghiệp'
            };
            return accountTypeMap[value] || value;

        case 'role':
            const roleMap = {
                'USER': 'Người dùng',
                'ADMIN': 'Quản trị viên',
                'MODERATOR': 'Điều hành viên',
                'user': 'Người dùng',
                'admin': 'Quản trị viên',
                'moderator': 'Điều hành viên'
            };
            return roleMap[value] || value;

        case 'status':
            const statusMap = {
                'ACTIVE': 'Hoạt động',
                'INACTIVE': 'Không hoạt động',
                'SUSPENDED': 'Tạm khóa',
                'BANNED': 'Bị cấm',
                'active': 'Hoạt động',
                'inactive': 'Không hoạt động',
                'suspended': 'Tạm khóa',
                'banned': 'Bị cấm'
            };
            return statusMap[value] || value;

        case 'verified':
            return value ? 'Đã xác thực' : 'Chưa xác thực';

        case 'email':
        case 'username':
        case 'firstName':
        case 'middleName':
        case 'lastName':
        case 'province':
        case 'district':
        case 'ward':
        case 'detailedAddress':
        case 'identityIssuePlace':
        default:
            return value || 'Chưa cập nhật';
    }
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        return '';
    }
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};