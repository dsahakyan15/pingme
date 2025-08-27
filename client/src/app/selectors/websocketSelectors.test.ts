import { describe, it, expect } from 'vitest';
import type { RootState } from '../store';
import {
  selectConnectionStatus,
  selectChatMessages,
  selectIsConnected,
} from './websocketSelectors';
import type { WebSocketStoredMessage, IncomingEnvelope } from '../../types/WebSocketTypes';
import type { Message } from '../../types/types';

describe('websocketSelectors', () => {
  const message1: WebSocketStoredMessage = {
    kind: 'incoming',
    type: 'message',
    id: 'msg1',
    timestamp: 1,
    data: { id: 'msg1', text: 'Hello', userId: 1, conversationId: 1 },
  } as IncomingEnvelope<Message>;

  const message2: WebSocketStoredMessage = {
    kind: 'outgoing',
    type: 'message',
    id: 'msg2',
    timestamp: 2,
    data: { text: 'Hi back' },
  };

  const message3: WebSocketStoredMessage = {
    kind: 'incoming',
    type: 'message',
    id: 'msg3',
    timestamp: 3,
    data: { id: 'msg3', text: 'How are you?', userId: 2, conversationId: 1 },
  } as IncomingEnvelope<Message>;

  const nonChatMessage: WebSocketStoredMessage = {
    kind: 'incoming',
    type: 'user',
    id: 'user1',
    timestamp: 4,
    data: { id: 1, username: 'test' },
  };

  const allMessages = [message1, message2, message3, nonChatMessage];
  const mockState: RootState = {
    connection: {
      connectionStatus: 'connected',
      url: 'ws://test.com',
      error: null,
      isReconnecting: false,
      reconnectAttempts: 0,
    },
    chat: {
      messages: {
        byId: Object.fromEntries(allMessages.map(m => [m.id, m])),
        allIds: allMessages.map(m => m.id),
      },
      currentUser: { type: 'user', id: 1, username: 'test' },
      userMap: {
        1: { type: 'user', id: 1, username: 'test' },
        2: { type: 'user', id: 2, username: 'friend' },
      },
    }
  };

  it('selectConnectionStatus should return the connection status', () => {
    const status = selectConnectionStatus(mockState);
    expect(status).toBe('connected');
  });

  it('selectIsConnected should return true when connected', () => {
    const isConnected = selectIsConnected(mockState);
    expect(isConnected).toBe(true);
  });

  it('selectIsConnected should return false when disconnected', () => {
    const disconnectedState: RootState = {
      ...mockState,
      connection: {
        ...mockState.connection,
        connectionStatus: 'disconnected',
      },
    };
    const isConnected = selectIsConnected(disconnectedState);
    expect(isConnected).toBe(false);
  });

  it('selectChatMessages should return only incoming messages of type "message" and extract their data', () => {
    const chatMessages = selectChatMessages(mockState);
    expect(chatMessages).toHaveLength(2);
    expect(chatMessages[0]).toEqual({ id: 'msg1', text: 'Hello', userId: 1, conversationId: 1 });
    expect(chatMessages[1]).toEqual({ id: 'msg3', text: 'How are you?', userId: 2, conversationId: 1 });
    // It should not include outgoing messages or non-message types
    expect(chatMessages).not.toContain(message2.data);
    expect(chatMessages).not.toContain(nonChatMessage.data);
  });
});
