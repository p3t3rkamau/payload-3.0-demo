'use client'; // This ensures it's only run on the client

import React, { useEffect, useState } from 'react';

const AmountField: React.FC<{ value?: number; onChange?: (value: number) => void }> = ({ value = 0, onChange }) => {
  const [formattedAmount, setFormattedAmount] = useState('');

  // Format the number with commas, keep the decimals
  const formatAmount = (amount: string) => {
    if (!amount) return '';

    const parts = amount.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Format integer part
    return parts.join('.');
  };

  useEffect(() => {
    if (value !== undefined) {
      setFormattedAmount(formatAmount(value.toString()));
    }
  }, [value]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, ''); // Remove commas
    const regex = /^\d*\.?\d*$/; // Allow only numbers with decimals

    if (regex.test(inputValue)) {
      setFormattedAmount(formatAmount(inputValue)); // Update formatted value

      if (onChange) {
        onChange(parseFloat(inputValue)); // Pass number back as raw value
      }
    }
  };

  return (
    <input
      type="text"
      value={formattedAmount}
      onChange={handleAmountChange}
      placeholder="Enter amount"
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        fontSize: '16px',
        width: '100%',
      }}
    />
  );
};

export default AmountField;
