import { Draggable } from "react-beautiful-dnd";
import {
  CourseContainer,
  CourseTitle,
  StatsContainer,
  Stat,
  QuarterIndicator,
  QuarterLetter,
  PopoverContentContainer,
  PopoverTitle,
  PopoverDescription,
  PopoverGERS,
  LinkContainer,
} from "./styles";
import { Popover } from "antd";

const BAD_COLOR = [244, 67, 54]; // RGB for 'worst' - red
const MID_COLOR = [255, 235, 59]; // RGB for 'middle' - yellow
const GOOD_COLOR = [76, 175, 80]; // RGB for 'good' - green

// This will interpolate between two RGB colors based on the score's position
const interpolateColor = (color1, color2, factor) => {
  const r = color1[0] + factor * (color2[0] - color1[0]);
  const g = color1[1] + factor * (color2[1] - color1[1]);
  const b = color1[2] + factor * (color2[2] - color1[2]);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

const getEvaluationColor = (evaluation) => {
  if (evaluation === -1) {
    return "grey";
  }

  // clamp score between 0 and 5
  const clampedScore = Math.min(5, Math.max(0, evaluation));

  if (clampedScore < 3) {
    return `rgb(${BAD_COLOR[0]}, ${BAD_COLOR[1]}, ${BAD_COLOR[2]})`;
  } else if (clampedScore <= 4) {
    return interpolateColor(BAD_COLOR, MID_COLOR, clampedScore - 3);
  } else {
    return interpolateColor(MID_COLOR, GOOD_COLOR, clampedScore - 4);
  }
};

const getPercentColor = (percent) => {
  if (percent === -1) {
    return "grey";
  }

  const clampedScore = Math.min(100, Math.max(0, percent));

  if (clampedScore < 50) {
    return `rgb(${BAD_COLOR[0]}, ${BAD_COLOR[1]}, ${BAD_COLOR[2]})`;
  } else if (clampedScore <= 75) {
    return interpolateColor(BAD_COLOR, MID_COLOR, (clampedScore - 50) / 25);
  } else {
    return interpolateColor(MID_COLOR, GOOD_COLOR, (clampedScore - 75) / 25);
  }
};

const getHoursColor = (hours) => {
  if (hours === -1) {
    return "grey";
  }

  if (hours > 20) {
    return `rgb(${BAD_COLOR[0]}, ${BAD_COLOR[1]}, ${BAD_COLOR[2]})`;
  } else if (hours > 12) {
    return `rgb(${MID_COLOR[0]}, ${MID_COLOR[1]}, ${MID_COLOR[2]})`;
  } else {
    return `rgb(${GOOD_COLOR[0]}, ${GOOD_COLOR[1]}, ${GOOD_COLOR[2]})`;
  }
};

const getUnitsColor = (units) => {
  switch (units) {
    case 1:
      return "#FFD1DF"; // Light Pink
    case 2:
      return "#FFEACB"; // Light Orange
    case 3:
      return "#D7FFB2"; // Light Green
    case 4:
      return "#B2E0FF"; // Light Blue
    case 5:
      return "#D1B2FF"; // Light Purple
    default:
      return "#E0E0E0"; // Default light gray color for unknown values
  }
};

const formatEvaluation = (evaluation) => {
  return { value: evaluation, color: getEvaluationColor(evaluation) };
};

const formatPercent = (percent) => {
  let value = percent;
  if (percent !== -1) value += "p";
  return { value, color: getPercentColor(percent) };
};

const formatHours = (hours) => {
  let value = hours;
  if (hours !== -1) value += "h";
  return { value, color: getHoursColor(hours) };
};

const formatUnitsMax = (unitsMax) => {
  let value = unitsMax;
  if (unitsMax !== -1) {
    value += "u";
  }
  return { value, color: getUnitsColor(unitsMax) };
};

const CourseItem = ({ item, index, search, onDelete }) => {
  const { id, course } = item;
  console.log(course);
  const {
    subject,
    code,
    evaluation,
    description,
    gers,
    hours,
    number,
    percent,
    sections,
    title,
    unitsMax,
    objectID,
  } = course;

  const getCartaLink = () => {
    const baseUrl = "https://carta-beta.stanford.edu/course/";
    return baseUrl + subject + code;
  };

  const getECLink = () => {
    const baseUrl =
      "https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&catalog=&academicYear=&q=";
    return baseUrl + objectID;
  };

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

    return quarters;
  };

  const quarters = getQuarters();
  const cartaLink = getCartaLink();
  const ecLink = getECLink();

  const { value: evalValue, color: evalColor } = formatEvaluation(evaluation);
  const { value: percentValue, color: percentColor } = formatPercent(percent);

  // estimate the hours if it does not exist
  const actualHours = hours <= 0 ? (unitsMax <= 0 ? -1 : unitsMax * 3) : hours;
  const { value: hoursValue, color: hoursColor } = formatHours(actualHours);
  const { value: unitsMaxValue, color: unitsMaxColor } =
    formatUnitsMax(unitsMax);

  const handleDelete = (e) => {
    // Check if Shift or Cmd key is pressed
    if (e.metaKey) {
      // Call the onDelete function with the course id
      onDelete(id);
    }
  };

  const renderWays = () => {
    const wayItems = gers
      .filter((item) => item.startsWith("WAY"))
      .map((item) => item.replace("WAY-", ""));

    const WAY_COLORS = {
      "A-II": "#B57555",
      SMA: "#B5A755",
      SI: "#A2B575",
      AQR: "#B555A1",
      CE: "#557B9D",
      EDP: "#7555B5",
      ER: "#B5759D",
      FR: "#55B575",
    };

    return (
      <div>
        {wayItems.map((way) => {
          const badgeStyle = {
            backgroundColor: WAY_COLORS[way],
            padding: "5px 10px",
            borderRadius: "5px",
            marginRight: "5px",
            display: "inline-block",
            color: "#EAEAEA",
          };

          return <span style={badgeStyle}>{way}</span>;
        })}
      </div>
    );
  };

  const renderGers = () => {
    const gerItems = gers
      .filter((item) => !item.startsWith("WAY"))
      .map((item) => item.replace("GER:", ""));

    if (gerItems.length === 0) return null;

    const gerStr = gerItems.join(", ");

    return <PopoverGERS>GERS: {gerStr}</PopoverGERS>;
  };

  const renderPopoverContent = () => {
    return (
      <PopoverContentContainer>
        <PopoverTitle>
          <h1>{number}</h1>
          <div>{renderWays()}</div>
        </PopoverTitle>
        {renderGers()}
        <PopoverDescription>{description}</PopoverDescription>
        <LinkContainer>
          <a href={cartaLink} target="_blank" rel="noopener noreferrer">
            Carta
          </a>
          <a href={ecLink} target="_blank" rel="noopener noreferrer">
            ExploreCourses
          </a>
        </LinkContainer>
      </PopoverContentContainer>
    );
  };

  if (search) {
    return (
      <Draggable key={id} draggableId={id} index={index}>
        {(provided, snapshot) => (
          <CourseContainer
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
          >
            <CourseTitle>
              <span>{number}</span>: {title}
            </CourseTitle>
            <QuarterIndicator>
              {quarters.map((quarter) => (
                <QuarterLetter key={quarter} className={quarter}>
                  {quarter.charAt(0)}
                </QuarterLetter>
              ))}
            </QuarterIndicator>
            <StatsContainer>
              <Stat color={evalColor}>{evalValue}</Stat>
              <Stat color={percentColor}>{percentValue}</Stat>
              <Stat color={hoursColor}>{hoursValue}</Stat>
              <Stat color={unitsMaxColor}>{unitsMaxValue}</Stat>
            </StatsContainer>
          </CourseContainer>
        )}
      </Draggable>
    );
  }

  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Popover
          content={renderPopoverContent()}
          mouseEnterDelay={0.4}
          trigger={["hover", "click"]}
          color="#3a3a3a"
        >
          <CourseContainer
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
            onClick={handleDelete}
          >
            <CourseTitle>
              <span>{number}</span>: {title}
            </CourseTitle>
            <QuarterIndicator>
              {quarters.map((quarter) => (
                <QuarterLetter key={quarter} className={quarter}>
                  {quarter.charAt(0)}
                </QuarterLetter>
              ))}
            </QuarterIndicator>
            <StatsContainer>
              <Stat color={evalColor}>{evalValue}</Stat>
              <Stat color={percentColor}>{percentValue}</Stat>
              <Stat color={hoursColor}>{hoursValue}</Stat>
              <Stat color={unitsMaxColor}>{unitsMaxValue}</Stat>
            </StatsContainer>
          </CourseContainer>
        </Popover>
      )}
    </Draggable>
  );
};

export default CourseItem;
