import React, { useState } from "react";

const CourseSearchForm = ({ onSearch }) => {
  const [classCode, setClassCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(classCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter class code"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default CourseSearchForm;
