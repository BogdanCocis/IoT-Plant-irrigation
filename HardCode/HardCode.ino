#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <WebServer.h>

const char* ssid = "***NETWORW_NAME***";
const char* password = "***PASSWORD***"; 

const char* serverUrl = "***SERVER_SPRING_URL***";

#define DHT_PIN 26             
#define DHT_TYPE DHT11         
#define SOIL_MOISTURE_PIN 34   
#define RELAY_PIN 13          

#define MOISTURE_THRESHOLD 30.0

DHT dht(DHT_PIN, DHT_TYPE);

WebServer server(80);

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); 

  dht.begin(); 

  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");

  server.on("/updatePumpStatus", []() {
    Serial.println("Request received on /updatePumpStatus");
    if (server.hasArg("status")) {
        String status = server.arg("status");
        Serial.println("Status parameter: " + status);
        if (status == "true") {
            digitalWrite(RELAY_PIN, HIGH); 
            server.send(200, "text/plain", "Pump turned ON");
            Serial.println("Pump turned ON manually.");
        } else if (status == "false") {
            digitalWrite(RELAY_PIN, LOW); 
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

  server.begin();
}

void loop() {
  server.handleClient();

  if (WiFi.status() == WL_CONNECTED) {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
    float soilMoisture = map(soilMoistureRaw, 0, 4095, 0, 100);

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Error reading DHT11 sensor data.");
      return;
    }

    if (soilMoisture < MOISTURE_THRESHOLD) {
      digitalWrite(RELAY_PIN, HIGH); 
      Serial.println("Pump turned ON automatically (low soil moisture).");
    } else {
      digitalWrite(RELAY_PIN, LOW); 
      Serial.println("Pump turned OFF automatically (adequate soil moisture).");
    }

    String jsonPayload = "{";
    jsonPayload += "\"temperature\":" + String(temperature) + ",";
    jsonPayload += "\"humidity\":" + String(humidity) + ",";
    jsonPayload += "\"soilMoisture\":" + String(soilMoisture) + ",";
    jsonPayload += "\"timestamp\":\"" + getFormattedTime() + "\"";
    jsonPayload += "}";

    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);

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

String getFormattedTime() {
  time_t now;
  struct tm timeinfo;
  char buffer[80];
  time(&now);
  localtime_r(&now, &timeinfo);
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}