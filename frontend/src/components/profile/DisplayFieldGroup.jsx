import React from 'react';
import { formatDisplayValue } from '../../utils/formatters';

const DisplayFieldGroup = ({ label, field, value }) => {
    const formatted = formatDisplayValue(field, value);
    const className = ['display-field', 'mt-1 block w-full bg-gray-100 rounded-md p-2'];
    if (field === 'verified') className.push('status-badge', value ? 'verified' : 'unverified');
    if (field === 'status') className.push('status-badge', value);

    return (
        <div className="form-group">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className={className.join(' ')}>{formatted}</div>
        </div>
    );
};

export default DisplayFieldGroup;