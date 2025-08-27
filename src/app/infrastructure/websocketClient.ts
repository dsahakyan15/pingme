type Listener<T> = (payload: T) => void;

// A simple EventEmitter to avoid adding a new dependency.
class SimpleEventEmitter {
    private listeners: { [key: string]: Function[] } = {};

    public on<T>(event: string, listener: Listener<T>): this {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
        return this;
    }

    public off<T>(event: string, listener: Listener<T>): this {
        if (!this.listeners[event]) return this;
        this.listeners[event] = this.listeners[event].filter(l => l !== listener);
        return this;
    }

    protected emit<T>(event: string, payload: T): void {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(l => l(payload));
    }
}

export interface IWebSocketClient {
  connect(url: string, protocols?: string | string[]): void;
  disconnect(code?: number, reason?: string): void;
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  on(event: 'open', listener: (event: Event) => void): this;
  on(event: 'close', listener: (event: CloseEvent) => void): this;
  on(event: 'message', listener: (event: MessageEvent) => void): this;
  on(event: 'error', listener: (event: Event) => void): this;
  off(event: 'open', listener: (event: Event) => void): this;
  off(event: 'close', listener: (event: CloseEvent) => void): this;
  off(event: 'message', listener: (event: MessageEvent) => void): this;
  off(event: 'error', listener: (event: Event) => void): this;
  get readyState(): number;
}

export class WebSocketClient extends SimpleEventEmitter implements IWebSocketClient {
  private ws: WebSocket | null = null;

  public connect(url: string, protocols?: string | string[]): void {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED && this.ws.readyState !== WebSocket.CLOSING) {
        this.ws.close();
    }

    this.ws = new WebSocket(url, protocols);

    this.ws.onopen = (event) => this.emit('open', event);
    this.ws.onclose = (event) => this.emit('close', event);
    this.ws.onmessage = (event) => this.emit('message', event);
    this.ws.onerror = (event) => this.emit('error', event);
  }

  public disconnect(code: number = 1000, reason: string = 'Client disconnected'): void {
    this.ws?.close(code, reason);
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(data);
    } else {
        console.error('WebSocket is not open. Ready state is: ' + this.ws?.readyState);
    }
  }

  public get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}
