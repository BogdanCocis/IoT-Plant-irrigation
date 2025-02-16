## Overview

The Plant Irrigation System is an automated solution to monitor and control the irrigation of plants. It uses a combination of sensors, a microcontroller, and a backend server to manage the irrigation process based on soil moisture levels. The system can be controlled manually or automatically based on predefined thresholds.

## Features

- **Real-time Monitoring**: Continuously monitors soil moisture, temperature, and humidity.
- **Automatic Irrigation**: Activates the pump automatically when soil moisture falls below a certain threshold.
- **Manual Control**: Allows manual activation and deactivation of the pump via a web interface.
- **Data Logging**: Logs sensor data to a backend server.
- **User Management**: Supports user registration and login with role-based access control.
- **WebSocket Integration**: Real-time updates of sensor data on the frontend.
- **Secure Communication**: Implements security measures for API endpoints.

## Architecture

The system consists of three main components:

1. **Arduino (ESP32)**: Reads sensor data and controls the pump.
2. **Backend Server (Spring Boot)**: Manages data storage, user authentication, and provides APIs for frontend interaction.
3. **Frontend (React)**: Provides a user interface for monitoring and controlling the system.

## Installation

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/BogdanCocis/IoT-Plant-irrigation.git
   cd plant-irrigation-system/backend
   ```

2. Update the `application.properties` file with your database credentials:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/plantirrigation?createDatabaseIfNotExist=true
   spring.datasource.username=YOUR_DB_USERNAME
   spring.datasource.password=YOUR_DB_PASSWORD
   ```

3. Build and run the backend server:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies and start the frontend server:
   ```bash
   npm install
   npm start
   ```

### Arduino Setup

1. Install the required libraries (WiFi, DHT, HTTPClient, WebServer) in your Arduino IDE.
2. Update the WiFi credentials and server URL in the Arduino code:
   ```cpp
   const char* ssid = "YOUR_SSID";
   const char* password = "YOUR_PASSWORD";
   const char* serverUrl = "YOUR_SERVER_URL";
   ```
3. Upload the code to your Arduino board.

## Usage

1. Access the frontend at `http://localhost:3000`.
2. Register a new user and log in.

<div align="center">
  <img width="750" src="https://github.com/user-attachments/assets/75ec74be-5eea-456a-a449-d1266f7fbadf" alt="Register" />
</div>
<br><br>

<div align="center">
  <img width="750" src="https://github.com/user-attachments/assets/6d79a0b6-4d83-4518-8c17-03d7c92dcfcf" alt="Login" />
</div>
<br> <br>

3. Navigate to the dashboard to monitor sensor data and control the pump.

<div align="center">
  <img width="750" src="https://github.com/user-attachments/assets/7f27d669-f90a-4c42-ae19-adb71d2ecae4" alt="user-dashboard"/>
</div>
<br><br>
If the user is a child, they will have a page dedicated to them so they can only view information about the plant they want to monitor.
<br><br>
<div align="center">
  <img width="750" src="https://github.com/user-attachments/assets/f755597e-7f79-4b53-bd14-b6eec0b5e312" alt="child-dashboard" />
</div>
<br> <br>


## Database Schema

The database schema for the Plant Irrigation System is visually represented below:
<div align="center">
  <img width="750" alt="db_plant" src="https://github.com/user-attachments/assets/7c950088-239c-45f7-b4a9-573f95e2db6d" />
</div>
