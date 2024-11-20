// src/components/PublicPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PHImage from "../assets/PH.JPG";
import SteestImage from "../assets/steest.PNG";
import SttImage from "../assets/stt.jpg";
import { Building2 } from "lucide-react";
import styles from "./PublicPage.module.css";
import logo from "../assets/urslogo.png";
import login from "../assets/log-in.svg";
import coeng from "../assets/coeng.jpg";
import axios from "axios";
import CustomCalendar from "./CustomCalendar";

const PublicPage = () => {
  const [selectedSidebar, setSelectedSidebar] = useState("New Booking");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]); // State for storing events
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [newSidebarSelection, setNewSidebarSelection] = useState(
    "Select an organization to view details."
  ); // New sidebar state
  const navigate = useNavigate();

  //slideshoww
  const images = [SteestImage, SttImage];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timeout = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timeout);
  }, [nextSlide]);

  //login button

  const handleLoginClick = () => {
    navigate("/login");
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
        <button onClick={handleLoginClick} className={styles.loginButton}>
          <img src={login} className={styles.loginIcon} />
          Login
        </button>
      </nav>

      <div className={styles.container}>
        {/* Main Content */}

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

          <div>
            <h1 className={styles.calendarTitle}>Campus Calendar</h1>
            <div className={styles.calendarDate}>
              <CustomCalendar />
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

          {/* News and Information Section */}
          <div className={styles.rightSection}>
            <h3 className={styles.header}>News and Information</h3>
            {/* Add news and info content here */}
            <div className={styles.newsItem}>
              <h4>Upcoming Event: CoEng Week</h4>
              <p>Join us for CoEng Week from November 11-15, 2024!</p>
            </div>
            {/* Add more news items as necessary */}
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

      {/* Third Divider - Optional */}
    </div>
  );
};

export default PublicPage;
