'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange: (value: number | undefined) => void;
  value: number | undefined;
}

const formatToBRL = (value: number | undefined) => {
    if (value === undefined) return '';
    const floatValue = value / 100;
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
    }).format(floatValue);
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onValueChange, ...props }, ref) => {
    
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        setDisplayValue(formatToBRL(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/\D/g, '');
        
        if (numericValue === '') {
            onValueChange(undefined);
            setDisplayValue('');
        } else {
            const intValue = parseInt(numericValue, 10);
            onValueChange(intValue);
            setDisplayValue(formatToBRL(intValue));
        }
    };
    
    return (
        <Input
            {...props}
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
        />
    );
});
CurrencyInput.displayName = 'CurrencyInput';
