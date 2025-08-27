import { describe, it, expect } from 'vitest';
import connectionReducer, {
  connect,
  connected,
  disconnected,
  connectionError,
  disconnect,
  startReconnecting,
  stopReconnecting,
} from './connectionSlice';
import type { ConnectionState } from './connectionSlice';

describe('connectionSlice reducers', () => {
  let initialState: ConnectionState;

  beforeEach(() => {
    initialState = {
      connectionStatus: 'disconnected',
      url: null,
      error: null,
      isReconnecting: false,
      reconnectAttempts: 0,
    };
  });

  it('should return the initial state', () => {
    expect(connectionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle connect', () => {
    const action = connect({ url: 'ws://test.com' });
    const state = connectionReducer(initialState, action);
    expect(state.connectionStatus).toBe('connecting');
    expect(state.url).toBe('ws://test.com');
    expect(state).toMatchSnapshot();
  });

  it('should handle connected', () => {
    const connectingState: ConnectionState = { ...initialState, connectionStatus: 'connecting' };
    const state = connectionReducer(connectingState, connected());
    expect(state.connectionStatus).toBe('connected');
    expect(state.reconnectAttempts).toBe(0);
    expect(state).toMatchSnapshot();
  });

  it('should handle disconnected', () => {
    const connectedState: ConnectionState = { ...initialState, connectionStatus: 'connected' };
    const state = connectionReducer(connectedState, disconnected());
    expect(state.connectionStatus).toBe('disconnected');
    expect(state).toMatchSnapshot();
  });

  it('should handle disconnect (user initiated)', () => {
    const connectedState: ConnectionState = { ...initialState, connectionStatus: 'connected', url: 'ws://test.com' };
    const state = connectionReducer(connectedState, disconnect());
    expect(state.connectionStatus).toBe('disconnected');
    expect(state.url).toBeNull();
    expect(state).toMatchSnapshot();
  });

  it('should handle connectionError', () => {
    const action = connectionError('Test Error');
    const state = connectionReducer(initialState, action);
    expect(state.connectionStatus).toBe('error');
    expect(state.error).toBe('Test Error');
    expect(state).toMatchSnapshot();
  });

  it('should handle startReconnecting', () => {
    const state = connectionReducer(initialState, startReconnecting());
    expect(state.isReconnecting).toBe(true);
    expect(state.reconnectAttempts).toBe(1);
    const nextState = connectionReducer(state, startReconnecting());
    expect(nextState.reconnectAttempts).toBe(2);
    expect(nextState).toMatchSnapshot();
  });

  it('should handle stopReconnecting', () => {
    const reconnectingState: ConnectionState = { ...initialState, isReconnecting: true };
    const state = connectionReducer(reconnectingState, stopReconnecting());
    expect(state.isReconnecting).toBe(false);
    expect(state).toMatchSnapshot();
  });
});
