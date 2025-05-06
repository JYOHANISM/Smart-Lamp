// lib/api.ts
const API_BASE_URL = 'http://alamat-ip-perangkat-iot-anda/api'; // Ganti dengan URL API IoT Anda

export async function fetchLampStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) throw new Error('Failed to fetch lamp status');
    return await response.json();
  } catch (error) {
    console.error('Error fetching lamp status:', error);
    throw error;
  }
}

export async function toggleLamp(isOn: boolean) {
  try {
    const response = await fetch(`${API_BASE_URL}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOn }),
    });
    if (!response.ok) throw new Error('Failed to toggle lamp');
    return await response.json();
  } catch (error) {
    console.error('Error toggling lamp:', error);
    throw error;
  }
}

export async function setBrightness(brightness: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/brightness`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brightness }),
    });
    if (!response.ok) throw new Error('Failed to set brightness');
    return await response.json();
  } catch (error) {
    console.error('Error setting brightness:', error);
    throw error;
  }
}

export async function setColor(color: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/color`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ color }),
    });
    if (!response.ok) throw new Error('Failed to set color');
    return await response.json();
  } catch (error) {
    console.error('Error setting color:', error);
    throw error;
  }
}

export async function fetchSensorData() {
  try {
    const response = await fetch(`${API_BASE_URL}/sensor`);
    if (!response.ok) throw new Error('Failed to fetch sensor data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    throw error;
  }
}

export async function createSchedule(schedule: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) throw new Error('Failed to create schedule');
    return await response.json();
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
}

export async function updateSchedule(id: string, schedule: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) throw new Error('Failed to update schedule');
    return await response.json();
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
}

export async function deleteSchedule(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete schedule');
    return await response.json();
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
}

export async function fetchSchedules() {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules`);
    if (!response.ok) throw new Error('Failed to fetch schedules');
    return await response.json();
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}

export async function toggleSchedule(id: string, enabled: boolean) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule/${id}/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    });
    if (!response.ok) throw new Error('Failed to toggle schedule');
    return await response.json();
  } catch (error) {
    console.error('Error toggling schedule:', error);
    throw error;
  }
}