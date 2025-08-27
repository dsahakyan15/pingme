import type { Middleware } from '@reduxjs/toolkit';
import { sendMessage, incomingMessageReceived } from '../slices/chatSlice';
import { connectionError } from '../slices/connectionSlice';
import type { RootState } from '../store';
import type { SendMessagePayload, IncomingEnvelope } from '../../types/WebSocketTypes';
import type { IWebSocketClient } from '../infrastructure/websocketClient';
import { ServerEnvelopeSchema, IncomingPayloadSchema } from '../../types/schemas';

export const createMessagingMiddleware = (client: IWebSocketClient): Middleware<object, RootState> => {
  return (store) => {
    client.on('message', (event) => {
      let raw;
      try {
        raw = JSON.parse(event.data);
      } catch (error) {
        console.error('Failed to parse WebSocket message JSON:', error);
        store.dispatch(connectionError('Failed to parse incoming JSON'));
        return;
      }

      const envelopeValidation = ServerEnvelopeSchema.safeParse(raw);
      if (!envelopeValidation.success) {
        console.error('Invalid server envelope:', envelopeValidation.error.flatten());
        store.dispatch(connectionError('Invalid server envelope received'));
        return;
      }

      const payloadValidation = IncomingPayloadSchema.safeParse(envelopeValidation.data.data);
      if (!payloadValidation.success) {
        console.error('Invalid incoming payload:', payloadValidation.error.flatten());
        store.dispatch(connectionError(`Invalid payload for type ${envelopeValidation.data.type}`));
        return;
      }

      // The types from `types.ts` are a bit messy. The `IncomingEnvelope` in the app
      // seems to be a mix of the server envelope and the payload. I will construct it
      // in a way that the rest of the app expects.
      const finalEnvelope: IncomingEnvelope = {
        type: payloadValidation.data.type,
        data: payloadValidation.data,
      };

      store.dispatch(incomingMessageReceived(finalEnvelope));
    });

    return (next) => (action) => {
      const result = next(action);

      if (sendMessage.match(action)) {
          if (client.readyState === WebSocket.OPEN) {
              try {
                  // The `sendMessage` action payload is already a fully formed message
                  // due to the `prepare` callback in the slice. We can just send it.
                  // However, the original code constructed it here. Let's look at the type.
                  // The `sendMessage` action payload is `WebSocketStoredMessage`.
                  // The original code took a `SendMessagePayload` and constructed an envelope.
                  // My `chatSlice` `sendMessage` prepare callback now creates the full `WebSocketStoredMessage`.
                  // The `sendMessage` action now carries a `WebSocketStoredMessage` as payload.
                  // I should probably just stringify the `action.payload`.
                  // But the original `types.ts` has a specific `OutgoingEnvelope`.
                  // I will stick to what seems to be the intent.
                  const payload = action.payload; // This is WebSocketStoredMessage
                  const outgoing = {
                      type: payload.type,
                      data: payload.data,
                      timestamp: payload.timestamp,
                  };
                  client.send(JSON.stringify(outgoing));
              } catch (error) {
                  console.error('Failed to send WebSocket message:', error);
                  store.dispatch(connectionError('Failed to send message'));
              }
          } else {
              console.warn('WebSocket not open. Message not sent.', action.payload);
          }
      }

      return result;
    };
  };
};
