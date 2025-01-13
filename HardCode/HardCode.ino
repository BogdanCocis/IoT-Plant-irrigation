#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <WebServer.h>

// WiFi configuration
const char* ssid = "***NETWORW_NAME***";
const char* password = "***PASSWORD***"; 

// Spring server URL for sending sensor data
const char* serverUrl = "http://192.168.0.106:8080/api/sensorData";

// Pin configuration
#define DHT_PIN 26             // Pin for DHT11 sensor
#define DHT_TYPE DHT11         // Type of the DHT sensor
#define SOIL_MOISTURE_PIN 34   // Pin for soil moisture sensor (analog)
#define RELAY_PIN 13           // Pin for relay control

// Soil moisture threshold for automatic control
#define MOISTURE_THRESHOLD 30.0

// Initialize the DHT sensor
DHT dht(DHT_PIN, DHT_TYPE);

// Initialize the HTTP server
WebServer server(80);

void setup() {
  Serial.begin(115200);

  // Pin setup
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Relay starts off

  dht.begin(); // Start DHT11

  // Connect to WiFi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");

  // Endpoint for manual pump control
  server.on("/updatePumpStatus", []() {
    Serial.println("Request received on /updatePumpStatus");
    if (server.hasArg("status")) {
        String status = server.arg("status");
        Serial.println("Status parameter: " + status);
        if (status == "true") {
            digitalWrite(RELAY_PIN, HIGH); // Turn on pump
            server.send(200, "text/plain", "Pump turned ON");
            Serial.println("Pump turned ON manually.");
        } else if (status == "false") {
            digitalWrite(RELAY_PIN, LOW); // Turn off pump
            server.send(200, "text/plain", "Pump turned OFF");
            Serial.println("Pump turned OFF manually.");
        } else {
            server.send(400, "text/plain", "Invalid status");
        }
    } else {
        server.send(400, "text/plain", "Missing status parameter");
        Serial.println("Missing status parameter");
    }
  });

  // Start HTTP server
  server.begin();
}

void loop() {
  // Handle HTTP requests for manual pump control
  server.handleClient();

  // Send sensor data to Spring server every 30 seconds
  if (WiFi.status() == WL_CONNECTED) {
    // Read sensor data
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
    float soilMoisture = map(soilMoistureRaw, 0, 4095, 0, 100);

    // Check if DHT11 sensor data is valid
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Error reading DHT11 sensor data.");
      return;
    }

    // Automatically control the pump based on soil moisture
    if (soilMoisture < MOISTURE_THRESHOLD) {
      digitalWrite(RELAY_PIN, HIGH); // Turn on pump
      Serial.println("Pump turned ON automatically (low soil moisture).");
    } else {
      digitalWrite(RELAY_PIN, LOW); // Turn off pump
      Serial.println("Pump turned OFF automatically (adequate soil moisture).");
    }

    // Create JSON payload
    String jsonPayload = "{";
    jsonPayload += "\"temperature\":" + String(temperature) + ",";
    jsonPayload += "\"humidity\":" + String(humidity) + ",";
    jsonPayload += "\"soilMoisture\":" + String(soilMoisture) + ",";
    jsonPayload += "\"timestamp\":\"" + getFormattedTime() + "\"";
    jsonPayload += "}";

    // Send POST request to Spring server
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);

    // Check server response
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Server response: " + response);
    } else {
      Serial.println("Error sending data: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi disconnected. Retrying...");
    WiFi.begin(ssid, password);
  }

  delay(30000); 

// Function to get the current time in ISO8601 format
String getFormattedTime() {
  time_t now;
  struct tm timeinfo;
  char buffer[80];
  time(&now);
  localtime_r(&now, &timeinfo);
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}