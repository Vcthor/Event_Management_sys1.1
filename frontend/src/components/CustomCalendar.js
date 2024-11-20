import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./CustomCalendar.module.css";

const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date
  const [allEvents, setAllEvents] = useState([]); // Store all events from backend
  const [filteredEvents, setFilteredEvents] = useState([]); // Store events for the selected date
  const [calendarDate, setCalendarDate] = useState(new Date()); // Current calendar date

  // Fetch all events from the "approved" table on component load
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/approved");
        console.log("All approved events fetched from backend:", response.data);
        setAllEvents(response.data); // Store all events
      } catch (error) {
        console.error("Error fetching approved events:", error);
        setAllEvents([]); // Clear data on error
      }
    };

    fetchAllEvents();
  }, []);

  // Filter events when a date is selected
  const filterEventsByDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const matchedEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.date).toISOString().split("T")[0];
      return eventDate === formattedDate;
    });

    setFilteredEvents(matchedEvents); // Update filtered events
  };

  // Handle date click
  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterEventsByDate(date); // Filter events for the selected date
  };

  // Generate days for the current month
  const generateCalendarDays = () => {
    const month = calendarDate.getMonth();
    const year = calendarDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Navigate to previous/next month
  const changeMonth = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(calendarDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  // Check if any events exist for the given date
  const hasEvents = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return allEvents.some((event) => {
      const eventDate = new Date(event.date).toISOString().split("T")[0];
      return eventDate === formattedDate;
    });
  };

  return (
    <div>
      <div>
        <button onClick={() => changeMonth(-1)}>
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>
        <h3>
          {calendarDate.toLocaleString("default", { month: "long" })}{" "}
          {calendarDate.getFullYear()}
        </h3>
        <button onClick={() => changeMonth(1)}>
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ textAlign: "center" }}>
            {day}
          </div>
        ))}
        {generateCalendarDays().map((date) => (
          <div
            key={date}
            style={{
              textAlign: "center",
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                selectedDate?.toISOString().split("T")[0] ===
                date.toISOString().split("T")[0]
                  ? "#0e4296"
                  : "transparent",
              color:
                selectedDate?.toISOString().split("T")[0] ===
                date.toISOString().split("T")[0]
                  ? "#fff"
                  : "#000",
              position: "relative",
            }}
            onClick={() => handleDateChange(date)}
          >
            {date.getDate()}
            {hasEvents(date) && (
              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  width: "6px",
                  height: "6px",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <h4>Events on {selectedDate ? selectedDate.toLocaleDateString() : ""}</h4>
        <ul>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <li key={`${event.name}-${event.date}`}>
                <strong>{event.name}</strong> - {event.organization} -{" "}
                {event.duration} hours - {event.venue}
              </li>
            ))
          ) : (
            <li>No events for this date</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomCalendar;
