import React, {useEffect, useState, useRef} from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import "./ChildDashboard.css";
import {FaUserCircle} from "react-icons/fa";
import {useNavigate, useLocation} from "react-router-dom";

const ChildDashboard = () => {
    const [soilMoisture, setSoilMoisture] = useState(0);
    const [airTemperature, setAirTemperature] = useState(0);
    const [airHumidity, setAirHumidity] = useState(0);
    const [showProfile, setShowProfile] = useState(false);
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

    return (
        <div className="child-dashboard-body">
            <div className="child-navbar-dashboard">
                <h1>Child Dashboard</h1>
                <FaUserCircle className="child-user-icon" onClick={() => setShowProfile(!showProfile)}/>
            </div>
            {showProfile && (
                <div className="child-profile-popup" ref={profileRef}>
                    <p><strong>Role:</strong> {role}</p>
                    <button onClick={handleLogoff} className="child-logoff-button">Logoff</button>
                </div>
            )}
            <div className="child-dashboard-container">
                <div className="child-sensor-section">
                    <h2 className="child-dashboard-h2">Sensor Data</h2>
                    <div className="child-sensor-details">
                        <p><strong>Soil Moisture:</strong></p>
                        <ProgressBar
                            completed={soilMoisture}
                            bgColor={getProgressColor(soilMoisture)}
                            height="20px"
                            width="100%"
                            labelColor="#000"
                            labelSize="16px"
                            baseBgColor="#ddd"
                            className="child-progress-bar"
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
                            className="child-progress-bar"
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
                            className="child-progress-bar-no-label"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildDashboard;