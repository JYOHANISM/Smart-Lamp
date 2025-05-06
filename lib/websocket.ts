let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export function connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void) {
  if (socket) {
    socket.close();
  }

  // Ganti dengan URL WebSocket perangkat IoT Anda
  socket = new WebSocket('ws://alamat-ip-perangkat-iot-anda/ws');

  socket.onopen = () => {
    console.log('WebSocket connected');
    reconnectAttempts = 0;
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
    
    // Attempt to reconnect
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      setTimeout(() => {
        connectWebSocket(onMessage, onError);
      }, 3000 * reconnectAttempts); // Exponential backoff
    }
  };

  return {
    send: (data: any) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        console.error('WebSocket not connected');
      }
    },
    close: () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    }
  };
}