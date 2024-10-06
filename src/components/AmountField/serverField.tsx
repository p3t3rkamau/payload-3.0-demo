import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically load the client-side version only when it's needed
const AmountFieldClient = dynamic(() => import('./index'), { ssr: false });

const AmountFieldServer: React.FC<any> = (props) => {
  const { value, path, onChange } = props;

  return (
    <div>
      <label htmlFor={path}>Enter Amount:</label>
      {/* Render the client-side component only on the client */}
      <AmountFieldClient value={value} onChange={onChange} />
    </div>
  );
};

export default AmountFieldServer;
