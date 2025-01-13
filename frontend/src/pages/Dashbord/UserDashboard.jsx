import React, {useEffect, useState, useRef} from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "./UserDashboard.css";
import {FaUserCircle} from "react-icons/fa";
import {useNavigate, useLocation} from "react-router-dom";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";

const UserDashboard = () => {
    const [pumps, setPumps] = useState([]);
    const [soilMoisture, setSoilMoisture] = useState(0);
    const [airTemperature, setAirTemperature] = useState(0);
    const [airHumidity, setAirHumidity] = useState(0);
    const [showProfile, setShowProfile] = useState(false);
    const [showThresholdPopup, setShowThresholdPopup] = useState(false);
    const [selectedPump, setSelectedPump] = useState(null);
    const [newThreshold, setNewThreshold] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {role} = location.state || {};
    const profileRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/pumps")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Pump Data:", data);
                setPumps(data);
            })
            .catch((error) => console.error("Error fetching pump data:", error));
    }, []);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("WebSocket connected");
                client.subscribe("/topic/sensorData", (message) => {
                    if (message.body) {
                        const data = JSON.parse(message.body);
                        console.log("Received WebSocket Data:", data);
                        setSoilMoisture(data.soilMoisture);
                        setAirTemperature(data.temperature);
                        setAirHumidity(data.humidity);
                    }
                });
            },
            onWebSocketError: (error) => {
                console.error("WebSocket error:", error);
            },
            onDisconnect: () => console.log("WebSocket disconnected"),
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileRef]);

    const handlePumpControl = (pumpId, action) => {
        const status = action === "on";
        fetch(`http://localhost:8080/api/pumps/${pumpId}/status?status=${status}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setPumps((prevPumps) =>
                    prevPumps.map((pump) =>
                        pump.id === pumpId
                            ? {...pump, status}
                            : pump
                    )
                );
            })
            .catch((error) => console.error("Error controlling pump:", error));
    };

    const handleToggleMode = (pumpId, manualMode) => {
        fetch(`http://localhost:8080/api/pumps/${pumpId}/manualMode?manualMode=${manualMode}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                setPumps((prevPumps) =>
                    prevPumps.map((pump) =>
                        pump.id === pumpId
                            ? {...pump, manualMode}
                            : pump
                    )
                );
            })
            .catch((error) => console.error("Error toggling mode:", error));
    };

    const getProgressColor = (percentage, type) => {
        if (type === "temperature") {
            if (percentage < 15) return "blue";
            if (percentage > 30) return "red";
            return "green";
        } else {
            if (percentage < 30) return "red";
            if (percentage < 60) return "yellow";
            return "green";
        }
    };

    const handleLogoff = () => {
        console.log("User logged off");
        navigate("/");
    };

    const handleOpenThresholdPopup = (pump) => {
        setSelectedPump(pump);
        setNewThreshold(pump.moistureThreshold);
        setShowThresholdPopup(true);
    };

    const handleCloseThresholdPopup = () => {
        setShowThresholdPopup(false);
        setSelectedPump(null);
        setNewThreshold("");
    };

    const handleThresholdChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= 100) {
            setNewThreshold(value);
        }
    };

    const handleUpdateThreshold = () => {
        if (selectedPump) {
            fetch(
                `http://localhost:8080/api/pumps/${selectedPump.id}/threshold?threshold=${newThreshold}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(() => {
                    setPumps((prevPumps) =>
                        prevPumps.map((pump) =>
                            pump.id === selectedPump.id
                                ? {...pump, moistureThreshold: newThreshold}
                                : pump
                        )
                    );
                    handleCloseThresholdPopup();
                })
                .catch((error) =>
                    console.error("Error updating threshold:", error)
                );
        }
    };

    return (
        <div className="dashboard-body">
            <div className="navbar-dashboard">
                <h1>User Dashboard</h1>
                <FaUserCircle
                    className="user-icon"
                    onClick={() => setShowProfile(!showProfile)}
                />
            </div>
            {showProfile && (
                <div className="profile-popup" ref={profileRef}>
                    <p>
                        <strong>Role:</strong> {role}
                    </p>
                    <button onClick={handleLogoff} className="logoff-button">
                        Logoff
                    </button>
                </div>
            )}
            <div className="dashboard-container">
                <div className="sensor-section">
                    <h2 className="dashboard-h2">Sensor Data</h2>
                    <div className="sensor-details">
                        <p><strong>Soil Moisture:</strong></p>
                        <ProgressBar
                            completed={soilMoisture}
                            bgColor={getProgressColor(soilMoisture)}
                            height="20px"
                            width="100%"
                        />
                        <p><strong>Air Humidity:</strong></p>
                        <ProgressBar
                            completed={airHumidity}
                            bgColor={getProgressColor(airHumidity)}
                            height="20px"
                            width="100%"
                        />
                        <p><strong>Air Temperature:</strong> {airTemperature}°C</p>
                        <ProgressBar
                            completed={airTemperature}
                            bgColor={getProgressColor(airTemperature, "temperature")}
                            height="20px"
                            width="100%"
                        />
                    </div>
                </div>
                <div className="pump-section">
                    <h2 className="dashboard-h2">Pumps</h2>
                    <ul>
                        {pumps.map((pump) => (
                            <li key={pump.id} className="dashboard-item">
                                <div>
                                    <strong>ID:</strong> {pump.id} <br/>
                                    <strong>Status:</strong> {pump.status ? "On" : "Off"} <br/>
                                    <strong>Mode:</strong> {pump.manualMode ? "Manual" : "Automatic"} <br/>
                                    <strong>Moisture Threshold:</strong> {pump.moistureThreshold}
                                </div>
                                <div className="pump-buttons">
                                    <button onClick={() => handlePumpControl(pump.id, "on")}>
                                        Turn On
                                    </button>
                                    <button onClick={() => handlePumpControl(pump.id, "off")}>
                                        Turn Off
                                    </button>
                                    <button onClick={() => handleToggleMode(pump.id, !pump.manualMode)}>
                                        Switch to {pump.manualMode ? "Automatic" : "Manual"}
                                    </button>
                                    <button onClick={() => handleOpenThresholdPopup(pump)}>
                                        Update Threshold
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showThresholdPopup && (
                <div className="threshold-popup">
                    <div className="threshold-popup-content">
                        <h3>Update Moisture Threshold</h3>
                        <p>Current Threshold: {selectedPump.moistureThreshold}</p>
                        <input
                            type="number"
                            value={newThreshold}
                            onChange={handleThresholdChange}
                            min="0"
                            max="100"
                            step="0.1"
                        />
                        <button onClick={handleUpdateThreshold}>Update</button>
                        <button onClick={handleCloseThresholdPopup}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;