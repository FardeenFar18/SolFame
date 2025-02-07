import React from 'react';

const FinancialOverview = ({ revenue }) => {
  return (
    <div className="module">
      <h2>Financial Overview</h2>
      <p>Total Revenue: ${revenue}</p>
    </div>
  );
};

export default FinancialOverview;
