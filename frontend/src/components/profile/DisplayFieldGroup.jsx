import React from 'react';
import { formatDisplayValue } from '../../utils/formatters';

const DisplayFieldGroup = ({ label, field, value }) => {
    const formatted = formatDisplayValue(field, value);
    const className = ['display-field'];
    if (field === 'verified') className.push('status-badge', value ? 'verified' : 'unverified');
    if (field === 'status') className.push('status-badge', value);

    return (
        <div className="form-group">
            <label>{label}</label>
            <div className={className.join(' ')}>{formatted}</div>
        </div>
    );
};

export default DisplayFieldGroup;