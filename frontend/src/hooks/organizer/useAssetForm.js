// src/hooks/organizer/useAssetForm.js
import { useState } from 'react';
import { assetAPI } from '../../services/asset';

const useAssetForm = (onSuccess) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const submitAsset = async (formData, editingId = null) => {
        setIsLoading(true);
        setMessage('');
        try {
            let response;
            if (editingId) {
                response = await assetAPI.updateAsset(editingId, formData);
            } else {
                response = await assetAPI.createAsset(formData);
            }

            if (response.success) {
                setMessage(editingId ? 'Cập nhật thành công!' : 'Tạo tài sản thành công!');
                onSuccess?.();
            } else {
                setMessage(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Asset submission error:', error);
            setMessage(error.message || 'Không thể gửi dữ liệu');
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, message, setMessage, submitAsset };
};

export default useAssetForm;