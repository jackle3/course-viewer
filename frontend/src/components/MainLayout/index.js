import {
  MainContainer,
  ContentContainer,
  GooseContainer,
  EventCard,
} from "./styles";
import { useEffect, useState } from "react";
import apiRequest from "../../helpers/apiRequest";
import CourseSearchForm from "../CourseSearch/courseSearchForm";
import CourseDetails from "../CourseSearch/courseDetails";

import { Scheduler } from "@aldabil/react-scheduler";

const DATES = {
  Monday: "10/02/2023",
  Tuesday: "10/03/2023",
  Wednesday: "10/04/2023",
  Thursday: "10/05/2023",
  Friday: "10/06/2023",
};

const MainLayout = () => {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  const handleSearch = async (classCode) => {
    try {
      const response = await apiRequest("GET", `/courses/${classCode}`);
      setCourses(response); // Assuming your API returns the course details
      setEvents([]); // wipe the events
    } catch (error) {
      console.error("Error:", error);
      setCourses(null);
    }
  };

  const getColor = () => {
    // return `hsla(${~~(360 * Math.random())}, 70%,  30%, 0.8)`;
    const number = Math.floor(Math.random() * 999);
    const hue = number * 137.508;
    return `hsl(${hue},50%,50%)`;
  };

  useEffect(() => {
    if (!courses) return;

    const newEvents = [];

    for (let course of courses) {
      const courseTitle = course.number;

      for (let section of course.sections) {
        // const sectionTitle = `${section.component} ${section.sectionNumber}`;
        const sectionTitle = section.component;
        const borderColor = section.component === "LEC" ? "#24706B" : "#84B166";
        const color = getColor();

        for (let schedule of section.schedules) {
          const startTime = schedule.startTime;
          const endTime = schedule.endTime;

          const days = schedule?.days?.split(" ");
          if (days) {
            for (let day of days) {
              const date = DATES[day];

              const startDate = `${date} ${startTime}`;
              const endDate = `${date} ${endTime}`;
              const event = {
                title: courseTitle,
                sectionTitle: sectionTitle,
                start: new Date(startDate),
                end: new Date(endDate),
                color: color,
                borderColor: borderColor,
              };

              newEvents.push(event);
            }
          }
        }
      }
    }

    setEvents(newEvents);
  }, [courses]);

  useEffect(() => {
    // remove all the buttons on the scheduler
    const component = document.getElementById("scheduler");
    const buttons = component.querySelectorAll("button");
    buttons.forEach((button) => button.remove());
  });

  const renderEvent = ({ event }) => {
    let startTime = event.start.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });
    const startTimeArray = startTime.split(" ");

    let endTime = event.end.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });
    const endTimeArray = endTime.split(" ");

    if (startTimeArray[1] === endTimeArray[1]) {
      startTime = startTimeArray[0];
    }

    return (
      <EventCard color={event.color} borderColor={event.borderColor}>
        <p>{event.title}</p>
        <span>{event.sectionTitle}</span>
        <p>{`${startTime} - ${endTime}`}</p>
      </EventCard>
    );
  };

  return (
    <MainContainer>
      <GooseContainer id="gooseFrame" src="https://stanfordgoose.com" />
      <ContentContainer style={{ flex: "0.8" }}>
        <CourseSearchForm onSearch={handleSearch} />
        {courses &&
          courses.map((course, index) =>
            course.sections.length > 0 ? (
              <CourseDetails key={`course-${index}`} course={course} />
            ) : null
          )}
      </ContentContainer>
      <ContentContainer id="scheduler">
        {events.length > 0 && (
          <Scheduler
            height={600}
            view="week"
            week={{
              weekDays: [0, 1, 2, 3, 4],
              weekStartOn: 1,
              startHour: 8,
              endHour: 21,
            }}
            selectedDate={new Date("10/02/2023")}
            navigation={false}
            events={events}
            draggable={false}
            deletable={false}
            editable={false}
            disableViewNavigator={true}
            eventRenderer={renderEvent}
          />
        )}
      </ContentContainer>
    </MainContainer>
  );
};

export default MainLayout;
