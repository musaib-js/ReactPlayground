import React from 'react';

const Dropdown = ({ options, onChange }) => {
  return (
    <select className="form-select" onChange={onChange}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;

