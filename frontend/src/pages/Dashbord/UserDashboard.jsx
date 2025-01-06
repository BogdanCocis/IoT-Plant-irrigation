import React, {useEffect, useState, useRef} from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "./UserDashboard.css";
import {FaUserCircle} from "react-icons/fa";
import {useNavigate, useLocation} from "react-router-dom";

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
        fetch("http://localhost:8080/api/sensorData")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Sensor Data:", data);
                const latestData = data.reduce((acc, current) => {
                    if (!acc.soilMoisture || new Date(current.timestamp) > new Date(acc.soilMoisture.timestamp)) {
                        acc.soilMoisture = current;
                    }
                    if (!acc.airTemperature || new Date(current.timestamp) > new Date(acc.airTemperature.timestamp)) {
                        acc.airTemperature = current;
                    }
                    if (!acc.airHumidity || new Date(current.timestamp) > new Date(acc.airHumidity.timestamp)) {
                        acc.airHumidity = current;
                    }
                    return acc;
                }, {});
                if (latestData.soilMoisture) setSoilMoisture(latestData.soilMoisture.soilMoisture);
                if (latestData.airTemperature) setAirTemperature(latestData.airTemperature.temperature);
                if (latestData.airHumidity) setAirHumidity(latestData.airHumidity.humidity);
            })
            .catch(error => console.error("Error fetching sensor data:", error));

        fetch("http://localhost:8080/api/pumps")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Pump Data:", data);
                setPumps(data);
            })
            .catch(error => console.error("Error fetching pump data:", error));
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
        fetch(`http://localhost:8080/api/pumps/${pumpId}/${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Pump Control Response:", data);
                setPumps(prevPumps => prevPumps.map(pump => (pump.id === pumpId ? {
                    ...pump,
                    status: action === "on"
                } : pump)));
            })
            .catch(error => console.error("Error controlling pump:", error));
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
            fetch(`http://localhost:8080/api/pumps/${selectedPump.id}/threshold?threshold=${newThreshold}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setPumps(prevPumps => prevPumps.map(pump => (pump.id === selectedPump.id ? {
                        ...pump,
                        moistureThreshold: newThreshold
                    } : pump)));
                    handleCloseThresholdPopup();
                })
                .catch(error => console.error("Error updating threshold:", error));
        }
    };

    return (
        <div className="dashboard-body">
            <div className="navbar-dashboard">
                <h1>User Dashboard</h1>
                <FaUserCircle className="user-icon" onClick={() => setShowProfile(!showProfile)}/>
            </div>
            {showProfile && (
                <div className="profile-popup" ref={profileRef}>
                    <p><strong>Role:</strong> {role}</p>
                    <button onClick={handleLogoff} className="logoff-button">Logoff</button>
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
                            labelColor="#000"
                            labelSize="16px"
                            baseBgColor="#ddd"
                            className="progress-bar"
                        />
                        <p><strong>Air Humidity:</strong></p>
                        <ProgressBar
                            completed={airHumidity}
                            bgColor={getProgressColor(airHumidity)}
                            height="20px"
                            width="100%"
                            labelColor="#000"
                            labelSize="16px"
                            baseBgColor="#ddd"
                            className="progress-bar"
                        />
                        <p><strong>Air Temperature:</strong> {airTemperature}°C</p>
                        <ProgressBar
                            completed={airTemperature}
                            bgColor={getProgressColor(airTemperature, "temperature")}
                            height="20px"
                            width="100%"
                            labelColor="#000"
                            labelSize="16px"
                            baseBgColor="#ddd"
                            className="progress-bar-no-label"
                        />
                    </div>
                </div>
                <div className="pump-section">
                    <h2 className="dashboard-h2">Pumps</h2>
                    <ul>
                        {pumps.map(pump => (
                            <li key={pump.id} className="dashboard-item">
                                <div>
                                    <strong>ID:</strong> {pump.id} <br/>
                                    <strong>Status:</strong> {pump.status ? "On" : "Off"} <br/>
                                    <strong>Moisture Threshold:</strong> {pump.moistureThreshold}
                                </div>
                                <div className="pump-buttons">
                                    <button onClick={() => handlePumpControl(pump.id, "on")}>Turn On</button>
                                    <button onClick={() => handlePumpControl(pump.id, "off")}>Turn Off</button>
                                    <button onClick={() => handleOpenThresholdPopup(pump)}>Update Threshold</button>
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