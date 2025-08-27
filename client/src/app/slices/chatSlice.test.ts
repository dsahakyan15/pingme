import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import chatReducer, {
  incomingMessageReceived,
  sendMessage,
  setCurrentUser,
  clearMessages,
} from './chatSlice';
import type { ChatState } from './chatSlice';
import type { IncomingEnvelope } from '../../types/WebSocketTypes';
import type { User } from '../../types/types';

const MOCK_UUID = 'mock-uuid-1234';

describe('chatSlice reducers', () => {
  let initialState: ChatState;

  beforeEach(() => {
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => MOCK_UUID),
    });
    vi.spyOn(global.Date, 'now').mockReturnValue(1724772800000);

    initialState = {
      messages: {
        byId: {},
        allIds: [],
      },
      currentUser: null,
      pendingUsername: undefined,
      userMap: {},
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should return the initial state', () => {
    expect(chatReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('incomingMessageReceived', () => {
    it('should add a generic message to the normalized state', () => {
      const message: IncomingEnvelope = { type: 'greeting', data: { text: 'hello' } };
      const action = incomingMessageReceived(message);

      const state = chatReducer(initialState, action);
      expect(state.messages.allIds).toHaveLength(1);
      expect(state.messages.allIds[0]).toBe(MOCK_UUID);
      expect(state.messages.byId[MOCK_UUID]).toMatchObject({
        kind: 'incoming',
        type: 'greeting',
        id: MOCK_UUID,
      });
      expect(state).toMatchSnapshot();
    });

    it('should handle incoming user data and update userMap', () => {
      const user: User = { type: 'user', id: 1, username: 'testuser' };
      const message: IncomingEnvelope<User> = { type: 'user', data: user, id: 'server-id-1' };
      const action = incomingMessageReceived(message);

      const state = chatReducer(initialState, action);
      expect(state.userMap[1]).toEqual(user);
      expect(state.messages.byId['server-id-1']).toBeDefined();
      expect(state).toMatchSnapshot();
    });

    it('should set currentUser if pendingUsername matches', () => {
        const user: User = { type: 'user', id: 1, username: 'testuser' };
        const message: IncomingEnvelope<User> = { type: 'user', data: user };
        const action = incomingMessageReceived(message);
        const stateWithPending = { ...initialState, pendingUsername: 'testuser' };

        const finalState = chatReducer(stateWithPending, action);
        expect(finalState.currentUser).toEqual(user);
        expect(finalState.pendingUsername).toBeUndefined();
        expect(finalState).toMatchSnapshot();
    });
  });

  describe('sendMessage', () => {
    it('should add an optimistic outgoing message to the normalized state', () => {
      const message = { type: 'message', data: { text: 'hello' } };
      const action = sendMessage(message);

      const state = chatReducer(initialState, action);
      expect(state.messages.allIds).toHaveLength(1);
      expect(state.messages.byId[MOCK_UUID]).toMatchObject({
        kind: 'outgoing',
        optimistic: true,
      });
      expect(state).toMatchSnapshot();
    });

    it('should set pendingUsername on user.register', () => {
      const message = { type: 'user.register', data: { username: 'newuser' } };
      const action = sendMessage(message);

      const state = chatReducer(initialState, action);
      expect(state.pendingUsername).toBe('newuser');
      expect(state.messages.allIds).toHaveLength(1);
      expect(state).toMatchSnapshot();
    });
  });

  it('should handle setCurrentUser', () => {
    const user = { id: 123, username: 'jules' };
    const action = setCurrentUser({ user });
    const state = chatReducer(initialState, action);
    expect(state.currentUser).toEqual({ type: 'user', ...user });
    expect(state.userMap[123]).toEqual({ type: 'user', ...user });
    expect(state).toMatchSnapshot();
  });

  it('should handle clearMessages', () => {
    const stateWithMessages: ChatState = {
        ...initialState,
        messages: {
            byId: { 'msg1': {} as any, 'msg2': {} as any },
            allIds: ['msg1', 'msg2']
        }
    };
    const state = chatReducer(stateWithMessages, clearMessages());
    expect(state.messages.allIds).toHaveLength(0);
    expect(state.messages.byId).toEqual({});
    expect(state).toMatchSnapshot();
  });
});
