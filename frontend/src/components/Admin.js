import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import SteestImage from "../assets/steest.PNG";
import SttImage from "../assets/stt.jpg";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import styles from "./Admin.module.css";
import logo from "../assets/urslogo.png";
import logout from "../assets/logout.svg";
import CustomCalendar from "./CustomCalendar";
import { Building2, CalendarPlus } from "lucide-react";
import home from "../assets/home.svg"
import pending from "../assets/clock.svg"
import userss from "../assets/user.svg"
import org from "../assets/users-2.svg"
import report from "../assets/report.svg"

const Admin = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const images = [SteestImage, SttImage];

    const [selectedSidebar, setSelectedSidebar] = useState("New Booking");
    const [isModalOpen, setModalOpen] = useState(false);
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

  const [showAddCouncilForm, setShowAddCouncilForm] = useState(false); // State to toggle Add Council form visibility
  const [councilFormData, setCouncilFormData] = useState({
    organization: "",
    adviser: "",
    president: "",
    vicePresident: "",
    secretary: "",
    treasurer: "",
    auditor: "",
    pro: "",
    rep: "",
    representative: "",
  });

  const handleAddCouncil = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/councils", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(councilFormData), // Sending form data as JSON
      });

      const data = await response.json();
      if (response.ok) {
        alert("Council data saved successfully!");
      } else {
        alert("Error saving council data: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [events, setEvents] = useState([]);
  const [councils, setCouncils] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState(null); // Store the document name
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const navigate = useNavigate();

  // Fetch events from the backend API when 'Events' is selected
  useEffect(() => {
    if (activeComponent === "Events") {
      const fetchEvents = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/events"); // Adjust the URL based on your backend
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
    }
  }, [activeComponent]);

  // Fetch councils from the backend API when 'councils' is selected
  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/councils");
        const data = await response.json();

        if (response.ok) {
          setCouncils(data); // Set councils state with fetched data
        } else {
          console.error("Failed to fetch councils:", data.message);
        }
      } catch (error) {
        console.error("Error fetching councils:", error);
      }
    };

    if (activeComponent === "Councils") {
      fetchCouncils();
    }
  }, [activeComponent]);

  // Fetch users from the backend API when 'users' is selected
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();

        if (response.ok) {
          setUsers(data); // Set Users state with fetched data
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (activeComponent === "Users") {
      fetchUsers();
    }
  }, [activeComponent]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events") // Update URL to point to the correct port
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // para sa delete button
  const handleDelete = async (eventId) => {
    console.log("Attempting to delete event with ID:", eventId);

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.json(); // Get the response body
      console.log("Response body:", responseBody); // Log the response body

      if (response.ok) {
        console.log("Delete response:", responseBody);
        alert("Event deleted successfully");
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
      } else {
        console.error("Delete failed:", responseBody);
        alert(
          `Failed to delete event: ${responseBody.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  // para sa approve button
  const handleConfirm = async (eventId) => {
    console.log("Attempting to approve event with ID:", eventId);

    const confirmed = window.confirm(
      "Are you sure you want to approve this event?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/approve/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.json(); // Get the response body
      console.log("Response body:", responseBody); // Log the response body

      if (response.ok) {
        console.log("Approve response:", responseBody);
        alert("Event approved successfully!");
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
      } else {
        console.error("Approval failed:", responseBody);
        alert(
          `Failed to approve event: ${responseBody.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error approving event:", error);
      alert("Error approving event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear session
    navigate("/login");
  };

  const handleViewDocument = (documentName) => {
    // Construct the URL for the document in the 'uploads' folder
    const fullDocumentUrl = `http://localhost:5000/uploads/${documentName}`;

    // Log the URL for debugging
    console.log("Document URL:", fullDocumentUrl);

    // Set the document and show modal
    setSelectedDocument(fullDocumentUrl);
    setSelectedDocumentName(documentName);
    setShowDocumentModal(true);
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
    setSelectedDocumentName(null); // Reset the document name when closing
  };

  const handleViewImage = (imageName) => {
    // Construct the URL for the image in the 'uploads' folder
    const fullImageUrl = `http://localhost:5000/uploads/${imageName}`;

    // Log the URL for debugging
    console.log("Image URL:", fullImageUrl);

    // Set the image and show modal
    setSelectedDocument(fullImageUrl); // Reusing the same state for simplicity
    setSelectedDocumentName(imageName); // Reusing the same state for image name
    setShowDocumentModal(true);
  };

  const handleButtonHover = (event, isHovering) => {
    if (isHovering) {
      event.target.style.backgroundColor = "#034d8c"; // Darker shade on hover
    } else {
      event.target.style.backgroundColor = "#0e4296"; // Original color
    }
  };

  // Function to render the selected content in the main content area
  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
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
                    <h2 className={styles.upcomingEventsText}>
                      Upcoming Events
                    </h2>
                    <p className={styles.eventDetails}>
                      <span className={styles.eventName}>CoEng Week 2024</span>{" "}
                      ||{" "}
                      <span className={styles.eventDate}>
                        November 11-15, 2024
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.calendar}>
                <h1>Campus Calendar</h1>
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
                  <Building2 size={20} color="#063970" /> Councils and
                  Organization List
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
                          color:
                            newSidebarSelection === item ? "#fff" : "#0e4296",
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
                The leading University in human resource development, knowledge
                and technology generation, and environmental stewardship.
              </p>
              <h3 className={styles.vgmoHeader}>MISSION</h3>
              <p className={styles.vgmo}>
                The University of Rizal System is committed to nurture and
                produce upright and competent graduates and empowered community
                through relevant and sustainable higher professional and
                technical instruction, research, extension, and production
                services.
              </p>
              <h3 className={styles.vgmoHeader}>CORE VALUES</h3>
              <p>R – Responsiveness</p>
              <p>I – Integrity</p>
              <p>S – Service</p>
              <p>E – Excellence</p>
              <p className={styles.vgmo}>S – Social Responsibility</p>
              <h3 className={styles.vgmoHeader}>QUALITY POLICY</h3>
              <p className={styles.vgmo}>
                The University of Rizal System commits to deliver excellent
                products and services to ensure total stakeholders’ satisfaction
                in instruction, research, extension, production and dynamic
                administrative support and to continuously improve its Quality
                Management System processes to satisfy all applicable
                requirements.
              </p>
            </div>

            {isModalOpen && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h3>Add Event</h3>
                  <form
                    onSubmit={handleModalSubmit}
                    encType="multipart/form-data"
                  >
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
        );
      case "Events":
        return (
          <div>
            <h2 className={styles.eventTitle}>Pending Events</h2>
            <div className={styles.addEventButtonContainer}></div>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableCell}>Name</th>
                  <th className={styles.tableCell}>Organization</th>
                  <th className={styles.tableCell}>Date</th>
                  <th className={styles.tableCell}>Duration</th>
                  <th className={styles.tableCell}>Documents</th>
                  <th className={styles.tableCell}>Photo</th>
                  <th className={styles.tableCell}>Venue</th>
                  <th className={styles.tableCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{event.name}</td>
                      <td className={styles.tableCell}>{event.organization}</td>
                      <td className={styles.tableCell}>{event.date}</td>
                      <td className={styles.tableCell}>{event.duration}</td>

                      <td className={styles.tableCell}>
                        {event.documents && (
                          <button
                            className={styles.button}
                            onClick={() =>
                              handleViewDocument(event.documents, event.name)
                            }
                            onMouseEnter={(e) => handleButtonHover(e, true)}
                            onMouseLeave={(e) => handleButtonHover(e, false)}
                          >
                            View Document
                          </button>
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        {event.photo && (
                          <button
                            className={styles.button}
                            onClick={() => handleViewImage(event.photo)}
                            onMouseEnter={(e) => handleButtonHover(e, true)}
                            onMouseLeave={(e) => handleButtonHover(e, false)}
                          >
                            View Image
                          </button>
                        )}
                      </td>
                      <td className={styles.tableCell}>{event.venue}</td>
                      <td className={styles.tableCell}>
                        <button
                          className={styles.button}
                          onClick={() => {
                            console.log(
                              "Approve button clicked for event ID:",
                              event.id
                            ); // Log the event ID
                            handleConfirm(event.id); // Pass event.id to the approve function
                          }}
                        >
                          ✔
                        </button>

                        <button
                          className={styles.button}
                          onClick={() => {
                            console.log(
                              "Delete button clicked for event ID:",
                              event.id
                            ); // Log the event ID
                            handleDelete(event.id); // Pass event.id to the delete function
                          }}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className={styles.noEvents}>
                      No events available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case "Councils":
        return (
          <div>
            <h2 className={styles.councilTitle}>Councils and Organizations</h2>
            <div className={styles.addCouncilButtonContainer}>
              <button
                className={styles.addCouncilButton}
                onClick={() => setShowAddCouncilForm(true)}
              >
                Add New Council
              </button>
            </div>
            <div className={styles.sectionBox}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHeader}>
                    <th className={styles.tableCell}>Organization</th>
                    <th className={styles.tableCell}>Adviser</th>
                    <th className={styles.tableCell}>President</th>
                    <th className={styles.tableCell}>Vise-President</th>
                    <th className={styles.tableCell}>Secretary</th>
                    <th className={styles.tableCell}>Treasurer</th>
                    <th className={styles.tableCell}>Auditor</th>
                    <th className={styles.tableCell}>P.R.O</th>
                    <th className={styles.tableCell}>Representative</th>
                  </tr>
                </thead>
                <tbody>
                  {councils.length > 0 ? (
                    councils.map((councils) => (
                      <tr key={councils.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          {councils.organization}
                        </td>
                        <td className={styles.tableCell}>{councils.adviser}</td>
                        <td className={styles.tableCell}>
                          {councils.president}
                        </td>
                        <td className={styles.tableCell}>
                          {councils.vicePresident}
                        </td>
                        <td className={styles.tableCell}>
                          {" "}
                          {councils.secretary}
                        </td>
                        <td className={styles.tableCell}>
                          {councils.treasurer}
                        </td>
                        <td className={styles.tableCell}>{councils.auditor}</td>
                        <td className={styles.tableCell}>{councils.pro}</td>
                        <td className={styles.tableCell}>
                          {councils.rep} {councils.representative}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className={styles.noEvents}>
                        No council available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {showAddCouncilForm && (
              <form onSubmit={handleAddCouncil} className={styles.sectionBox}>
                <div className={styles.formGroup}>
                  <label>Organization/Council:</label>
                  <input
                    type="text"
                    value={councilFormData.organization}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        organization: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Adviser:</label>
                  <input
                    type="text"
                    value={councilFormData.adviser}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        adviser: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>President:</label>
                  <input
                    type="text"
                    value={councilFormData.president}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        president: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Vice-President:</label>
                  <input
                    type="text"
                    value={councilFormData.vicePresident}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        vicePresident: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Secretary:</label>
                  <input
                    type="text"
                    value={councilFormData.secretary}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        secretary: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Treasurer:</label>
                  <input
                    type="text"
                    value={councilFormData.treasurer}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        treasurer: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Auditor:</label>
                  <input
                    type="text"
                    value={councilFormData.auditor}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        auditor: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>P.R.O:</label>
                  <input
                    type="text"
                    value={councilFormData.pro}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        pro: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Rep:</label>
                  <select
                    value={councilFormData.rep}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        rep: e.target.value,
                      })
                    }
                    className={styles.input}
                  >
                    <option value="">Select Representative</option>
                    <option value="Rep1">Rep 1</option>
                    <option value="Rep2">Rep 2</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Representative:</label>
                  <input
                    type="text"
                    value={councilFormData.representative}
                    onChange={(e) =>
                      setCouncilFormData({
                        ...councilFormData,
                        representative: e.target.value,
                      })
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formButtons}>
                  <button type="submit" className={styles.submitButton}>
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCouncilForm(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      case "Users":
        return (
          <div>
            <h2 className={styles.usersTitle}>Users</h2>

            <div className={styles.sectionBox}>
              <table className={styles.table}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeader}>
                      <th className={styles.tableCell}>Name</th>
                      <th className={styles.tableCell}>Organization</th>
                      <th className={styles.tableCell}>Username</th>
                      <th className={styles.tableCell}>Password</th>
                      <th className={styles.tableCell}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((users) => (
                        <tr key={users.id} className={styles.tableRow}>
                          <td className={styles.tableCell}>
                            {users.organization}a
                          </td>
                          <td className={styles.tableCell}>{users.adviser}a</td>
                          <td className={styles.tableCell}>
                            {users.president}a
                          </td>
                          <td className={styles.tableCell}>
                            {users.vicePresident}a
                          </td>
                          <td className={styles.tableCell}>
                            {" "}
                            {users.secretary}a
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className={styles.noEvents}>
                          No council available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </table>
            </div>
          </div>
        );
      case "Reports":
        return (
          <div className={styles.sectionBox}>This is the Reports section</div>
        );
      default:
        return (
          <div className={styles.sectionBox}>This is the Dashboard section</div>
        );
    }
  };

  return (
    <div className={styles.containerr}>
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
        <button className={styles.logoutButton} onClick={handleLogout}>
          <img src={logout} className={styles.loginIcon} />
          Log Out
        </button>
      </nav>

      {/* Sidebar and main content */}
      <div className={styles.main}>
        {/* Sidebar */}
        <aside className={styles.sidebarrr}>
          <ul className={styles.sidebarList}>
            <li
              className={{
                ...styles.sidebarItem,
                ...(activeComponent === "Dashboard" &&
                  styles.activeSidebarItem),
              }}
              onClick={() => setActiveComponent("Dashboard")}
            >
              <img src={home} className={styles.Icon}/>
              Dashboard
            </li>
            <li
              className={{
                ...styles.sidebarItem,
                ...(activeComponent === "Events" && styles.activeSidebarItem),
              }}
              onClick={() => setActiveComponent("Events")}
            >
             <img src={pending} className={styles.Icon}/>
              Pending Events
            </li>
            <li
              className={{
                ...styles.sidebarItem,
                ...(activeComponent === "Councils" && styles.activeSidebarItem),
              }}
              onClick={() => setActiveComponent("Councils")}
            >
              <img src={org} className={styles.Icon}/>
              Councils and Organizations
            </li>
            <li
              className={{
                ...styles.sidebarItem,
                ...(activeComponent === "Users" && styles.activeSidebarItem),
              }}
              onClick={() => setActiveComponent("Users")}
            >
              <img src={userss} className={styles.Icon}/>
              Users
            </li>
            <li
              className={{
                ...styles.sidebarItem,
                ...(activeComponent === "Reports" && styles.activeSidebarItem),
              }}
              onClick={() => setActiveComponent("Reports")}
            >
             <img src={report} className={styles.Icon}/>
              Reports
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className={styles.content}>{renderContent()}</main>
      </div>

      {/* Document Modal */}
      {showDocumentModal && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseDocumentModal}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedDocumentName}</h3> {/* Display the document name */}
            {selectedDocumentName?.endsWith(".pdf") ? (
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
              >
                <Viewer fileUrl={selectedDocument} />
              </Worker>
            ) : (
              <img
                src={selectedDocument}
                alt={selectedDocumentName}
                className={{ width: "100%", height: "auto" }}
              />
            )}
            <button
              className={styles.closeButton}
              onClick={handleCloseDocumentModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
