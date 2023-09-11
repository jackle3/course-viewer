import React from "react";

const CourseDetails = ({ course }) => {
  if (!course) return null;

  const {
    evaluation,
    description,
    gers,
    hours,
    number,
    percent,
    sections,
    title,
    unitsMax,
  } = course;

  const getQuarters = () => {
    let quartersSet = new Set();
    for (let section of sections) {
      let term = section.term;
      if (term.includes("Autumn")) {
        quartersSet.add("AUT");
      }
      if (term.includes("Winter")) {
        quartersSet.add("WIN");
      }
      if (term.includes("Spring")) {
        quartersSet.add("SPR");
      }
    }
    let quarters = [...quartersSet];
    const order = { AUT: 1, WIN: 2, SPR: 3 };
    quarters.sort((a, b) => (order[a] || 4) - (order[b] || 4));
    let quarterStr = quarters.join(", ");
    return quarterStr;
  };

  return (
    <div>
      <h1>{number}</h1>
      <h3>{unitsMax} units</h3>
      <div>
        <h3>Quarters</h3>
        {getQuarters()}
      </div>
      <div>
        <h3>Average Evaluation</h3>
        {evaluation}
      </div>
      <div>
        <h3>Percent Completed</h3>
        {percent}
      </div>
      <div>
        <h3>Hours</h3>
        {hours}
      </div>
      <div>
        <h3>Description</h3>
        {description}
      </div>
    </div>
  );
};

export default CourseDetails;
