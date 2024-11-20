// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SteestImage from "../assets/steest.PNG";
import SttImage from "../assets/stt.jpg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Building2, CalendarPlus } from "lucide-react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import CustomCalendar from "./CustomCalendar";
import logo from "../assets/urslogo.png";
import logout from "../assets/logout.svg";

const Dashboard = () => {
  const navigate = useNavigate();
  const userDetails = {
    username: "exampleUser",
    loggedInTime: new Date().toLocaleString(),
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSidebar, setSelectedSidebar] = useState("New Booking");
  const [newSidebarSelection, setNewSidebarSelection] =
    useState("Dashboard Overview");
  const [eventData, setEventData] = useState({
    venue: "",
    name: "",
    organization: "",
    date: "",
    duration: "",
    document: null,
    poster: null,
  });

  const images = [SteestImage, SttImage];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timeout = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timeout);
  }, [nextSlide]);

  const renderSidebarContent = () => {
    switch (selectedSidebar) {
      case "New Booking":
        return <p>Form to create a new booking.</p>;
      case "Scheduled Bookings":
        return <p>List of scheduled bookings.</p>;
      case "Available Dates":
        return <p>Calendar with available dates for booking.</p>;
      case "Events":
        return (
          <div>
            <p>Upcoming events information.</p>
            <button
              className={styles.addEventButton}
              onClick={() => setModalOpen(true)}
            >
              Add Event
            </button>
          </div>
        );
      case "Report":
        return <p>Report generation and analysis.</p>;
      default:
        return null;
    }
  };

  const renderNewSidebarContent = () => {
    switch (newSidebarSelection) {
      case "University Supreme Student Government":
        return <p>Dashboard overview and user summary.</p>;
      case "COE Council":
        return <p>User settings and preferences.</p>;
      case "Notifications":
        return <p>List of notifications for the user.</p>;
      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("venue", eventData.venue);
    formData.append("name", eventData.name);
    formData.append("organization", eventData.organization);
    formData.append("date", eventData.date);
    formData.append("duration", eventData.duration);
    formData.append("document", eventData.document);
    formData.append("poster", eventData.poster);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("Event added successfully!");
        setModalOpen(false); // Close the modal after successful submission
      }
    } catch (error) {
      console.error("Error uploading the event:", error);
      alert("Failed to add event!");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <div className={styles.titleflex}>
            <h1 className={styles.title}>
              University of Rizal System - Antipolo Campus
            </h1>
            <h1 className={styles.subtitle}>Event Booking System</h1>
          </div>
        </div>
        <button className={styles.logoutButton} onClick={() => navigate("/")}>
            <img src={logout} className={styles.loginIcon} />
            Log Out
        </button>
      </nav>
      <div className={styles.container}>
        <div className={styles.firstContainer}>
          {/* Upcoming Events Section */}

          <div className={styles.upcomingEventsCard}>
            <div className={styles.upcomingEventsImageContainer}>
              <img
                src={images[currentSlide]} // Replace this with your event image array or dynamic image
                alt="Upcoming Event"
                className={styles.upcomingEventImage}
              />
              <div className={styles.gradientOverlay}>
                <h2 className={styles.upcomingEventsText}>Upcoming Events</h2>
                <p className={styles.eventDetails}>
                  <span className={styles.eventName}>CoEng Week 2024</span> ||{" "}
                  <span className={styles.eventDate}>November 11-15, 2024</span>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.calendarDate}>
            <h1 className={styles.calendarTitle}>Campus Calendar</h1>
            <CustomCalendar />
          </div>
        </div>

        <div className={styles.venueBooklistContainer}>
          <h2 className={styles.header}>
            <CalendarPlus size={20} color="#063970" /> Venue Booklist
          </h2>
          <div className={styles.sidebarrContainer}>
            <div className={styles.sidebarr}>
              {[
                "Events",
                "Scheduled Bookings",
                "Available Dates",
                "Report",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedSidebar(item)}
                  className={{
                    ...styles.sidebarButton,
                    backgroundColor:
                      selectedSidebar === item ? "#0e4296" : "transparent",
                    color: selectedSidebar === item ? "#fff" : "#0e4296",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className={styles.sidebarContent}>
              <h3>{selectedSidebar}</h3>
              {renderSidebarContent()}
            </div>
          </div>
        </div>

        {/* News and Information Section (on the right) */}
        <div className={styles.layoutContainer}>
          <div className={styles.leftSection}>
            <h2 className={styles.header}>
              <Building2 size={20} color="#063970" /> Councils and Organization
              List
            </h2>

            {/* Councils and Organization List */}
            <div className={styles.sidebarContainer}>
              <div className={styles.sidebar}>
                {/* Add your buttons here */}
                {[
                  "University Supreme Student Government",
                  "COE Council",
                  "COBA Council",
                  "CHI Council",
                  "COENG Council",
                  "BEED Society",
                  "Litera Organization",
                  "Radicals Organization",
                  "Kapulungan Filipino",
                  "Social Studies Organization (UNESCO)",
                  "Association of Stenographer Aiming for Progress (ASAP)",
                  "Association of Junior Administrator (AJA)",
                  "Tourism Society (TM Soc)",
                  "Hospitality Society (HM Soc)",
                  "Bartender’s Society (BAR Soc)",
                  "Association of Civil Engineering Students (ACES)",
                  "Association of Concerned Computer Engineering Students (ACCESS) ",
                  "URSAC Extension Organization",
                  "URSAC Fierce Group Facilitator ",
                  "Environment Army Society",
                  "Hiyas ng Rizal Dance Troupe",
                  "Red Cross Youth Council",
                  "Tanghal Tipolo",
                  "CORO URSAC",
                  "Christian Brotherhood International",
                  "Elevate URSAC Chapter",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setNewSidebarSelection(item)}
                    className={{
                      ...styles.sidebarButton,
                      backgroundColor:
                        newSidebarSelection === item
                          ? "#0e4296"
                          : "transparent",
                      color: newSidebarSelection === item ? "#fff" : "#0e4296",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className={styles.sidebarContent}>
                <h3>{newSidebarSelection}</h3>
                {/* Dynamic content goes here */}
              </div>
            </div>
          </div>
        </div>

        {/* Merged Vision and Mission Section */}
        <div className={styles.mergedSection}>
          <h3 className={styles.vgmoHeader}>VISION</h3>
          <p className={styles.vgmo}>
            The leading University in human resource development, knowledge and
            technology generation, and environmental stewardship.
          </p>
          <h3 className={styles.vgmoHeader}>MISSION</h3>
          <p className={styles.vgmo}>
            The University of Rizal System is committed to nurture and produce
            upright and competent graduates and empowered community through
            relevant and sustainable higher professional and technical
            instruction, research, extension, and production services.
          </p>
          <h3 className={styles.vgmoHeader}>CORE VALUES</h3>
          <p>R – Responsiveness</p>
          <p>I – Integrity</p>
          <p>S – Service</p>
          <p>E – Excellence</p>
          <p className={styles.vgmo}>S – Social Responsibility</p>
          <h3 className={styles.vgmoHeader}>QUALITY POLICY</h3>
          <p className={styles.vgmo}>
            The University of Rizal System commits to deliver excellent products
            and services to ensure total stakeholders’ satisfaction in
            instruction, research, extension, production and dynamic
            administrative support and to continuously improve its Quality
            Management System processes to satisfy all applicable requirements.
          </p>
        </div>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Add Event</h3>
              <form onSubmit={handleModalSubmit} encType="multipart/form-data">
                <div className={styles.formGroup}>
                  <label>Venue:</label>
                  <select
                    name="venue"
                    value={eventData.venue}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  >
                    <option value="">Select Venue</option>
                    <option value="Venue 1">Court</option>
                    <option value="Venue 2">Room 101</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Event Name"
                    value={eventData.name}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Organization:</label>
                  <select
                    name="organization"
                    value={eventData.organization}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  >
                    <option value="">Select Organization</option>
                    <option value="COE">COE</option>
                    <option value="CBA">CBA</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Duration:</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration"
                    value={eventData.duration}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Document:</label>
                  <input
                    type="file"
                    name="document"
                    onChange={handleFileChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Poster:</label>
                  <input
                    type="file"
                    name="poster"
                    onChange={handleFileChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.modalFooter}>
                  <button type="submit" className={styles.submitButton}>
                    Submit
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className={styles.subFooter}>
        <div className={styles.about}>
          <h4 className={styles.aboutTitle}>About Us</h4>
          <p className={styles.aboutSubtitle}>
            This Event Booking System was created by the undergraduate students
            of BS-CpE 4 as their thesis project.
          </p>
        </div>
        <h5 className={styles.connectTitle}>Connect</h5>
          
      </div>
      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} University of Rizal Sytem Antipolo
          Campus<br></br> All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
