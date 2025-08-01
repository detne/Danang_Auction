import React, { useState, useEffect } from 'react';

const EditableFieldGroup = ({ label, field, value, disabled = false, onChange, error }) => {
    const [inputValue, setInputValue] = useState(value || '');

    // Update input value when prop value changes
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(field, newValue);
        }
    };

    const renderInput = () => {
        // Gender select field
        if (field === 'gender') {
            return (
                <select
                    id={field}
                    value={inputValue}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        error
                            ? 'border-red-500 bg-red-50'
                            : disabled
                                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'border-gray-300 bg-white'
                    }`}
                >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                </select>
            );
        }

        // Date input fields
        if (field === 'dob' || field === 'identityIssueDate') {
            return (
                <input
                    type="date"
                    id={field}
                    value={inputValue}
                    onChange={handleChange}
                    disabled={disabled}
                    max={field === 'dob' ? new Date().toISOString().split('T')[0] : undefined}
                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        error
                            ? 'border-red-500 bg-red-50'
                            : disabled
                                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'border-gray-300 bg-white'
                    }`}
                />
            );
        }

        // Phone number input with formatting
        if (field === 'phoneNumber') {
            return (
                <input
                    type="tel"
                    id={field}
                    value={inputValue}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="Nhập số điện thoại (10-11 chữ số)"
                    pattern="[0-9]{10,11}"
                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        error
                            ? 'border-red-500 bg-red-50'
                            : disabled
                                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'border-gray-300 bg-white'
                    }`}
                />
            );
        }

        // Email input
        if (field === 'email') {
            return (
                <input
                    type="email"
                    id={field}
                    value={inputValue}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="Nhập địa chỉ email"
                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                        error
                            ? 'border-red-500 bg-red-50'
                            : disabled
                                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'border-gray-300 bg-white'
                    }`}
                />
            );
        }

        // Textarea for detailed address
        if (field === 'detailedAddress') {
            return (
                <textarea
                    id={field}
                    value={inputValue}
                    onChange={handleChange}
                    disabled={disabled}
                    rows="3"
                    placeholder="Nhập địa chỉ chi tiết"
                    className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 resize-none ${
                        error
                            ? 'border-red-500 bg-red-50'
                            : disabled
                                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'border-gray-300 bg-white'
                    }`}
                />
            );
        }

        // Default text input
        return (
            <input
                type="text"
                id={field}
                value={inputValue}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Chưa cập nhật"
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    error
                        ? 'border-red-500 bg-red-50'
                        : disabled
                            ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'border-gray-300 bg-white'
                }`}
            />
        );
    };

    // Check if field is required
    const isRequired = ['username', 'email', 'phoneNumber', 'firstName', 'gender', 'dob', 'detailedAddress'].includes(field);

    return (
        <div className="form-group">
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
                {disabled && <span className="text-xs text-gray-500 ml-2">(Không thể chỉnh sửa)</span>}
            </label>
            {renderInput()}
            {error && (
                <div className="mt-1 flex items-center">
                    <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-500 text-sm">{error}</span>
                </div>
            )}
            {field === 'phoneNumber' && !error && (
                <p className="mt-1 text-xs text-gray-500">
                    Số điện thoại phải có 10-11 chữ số
                </p>
            )}
            {field === 'dob' && !error && (
                <p className="mt-1 text-xs text-gray-500">
                    Bạn phải đủ 18 tuổi để đăng ký
                </p>
            )}
        </div>
    );
};

export default EditableFieldGroup;