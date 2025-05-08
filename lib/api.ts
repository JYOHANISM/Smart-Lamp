// lib/api.ts
/**
 * API Service untuk Smart Lamp Dashboard
 * Ganti BASE_URL dengan URL API IoT Anda
 */

const BASE_URL = "http://your-iot-api-url.com/api"; // Ganti dengan URL API IoT Anda

// Tipe data untuk respons API
export type LampStatus = {
  isOn: boolean;
  brightness: number;
  batteryLevel: number;
  wifiStrength: number;
  lastUpdated: string;
};

export type LightDataPoint = {
  hour: number;
  value: number;
};

export type EnergyDataPoint = {
  day: string;
  usage: number;
};

export type SensorData = {
  lightReadings: LightDataPoint[];
  energyUsage: EnergyDataPoint[];
};

/**
 * Mengambil status lampu dari API
 */
export async function fetchLampStatus(): Promise<LampStatus> {
  try {
    const response = await fetch(`${BASE_URL}/lamp/status`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching lamp status:", error);
    // Fallback data jika API gagal
    return {
      isOn: false,
      brightness: 0,
      batteryLevel: 87,
      wifiStrength: 92,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Mengambil data sensor dari API
 */
export async function fetchSensorData(): Promise<SensorData> {
  try {
    const response = await fetch(`${BASE_URL}/lamp/sensor-data`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    // Fallback data jika API gagal
    return {
      lightReadings: generateDummyLightData(),
      energyUsage: generateDummyEnergyData()
    };
  }
}

/**
 * Mengirim perintah untuk menghidupkan/mematikan lampu
 */
export async function toggleLamp(turnOn: boolean): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/lamp/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOn: turnOn }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error toggling lamp:", error);
    throw error;
  }
}

/**
 * Mengatur tingkat kecerahan lampu
 */
export async function setBrightness(value: number): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/lamp/brightness`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brightness: value }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error setting brightness:", error);
    throw error;
  }
}

/**
 * Fungsi untuk menghasilkan data dummy jika API gagal
 */
function generateDummyLightData(): LightDataPoint[] {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: Math.floor(Math.random() * 100) + 20,
  }));
}

function generateDummyEnergyData(): EnergyDataPoint[] {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    usage: Math.floor(Math.random() * 50) + 10,
  }));
}