export type WebSocketConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketMessage {
  id?: string;
  type: string;
  data: any;
  timestamp?: number;
}

export interface WebSocketState {
  connectionStatus: WebSocketConnectionStatus;
  messages: WebSocketMessage[];
  url: string | null;
  error: string | null;
  isReconnecting: boolean;
  reconnectAttempts: number;
}

export interface ConnectPayload {
  url: string;
  protocols?: string | string[];
}

export interface SendMessagePayload {
  type: string;
  data: any;
}
