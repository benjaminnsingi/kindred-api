/**
 * Port for emitting real-time events to clients.
 *
 * Implemented by the WebSocket gateway in the presentation layer.
 * Use cases depend on this interface instead of the gateway directly,
 * keeping the application layer free of WebSocket framework dependencies.
 */
export interface IEventEmitter {
  /**
   * Broadcast an event to all clients subscribed to a meeting.
   *
   * @param meetingId - The UUID of the meeting (used as room key)
   * @param event - The event name (e.g. 'participant:joined')
   * @param payload - Arbitrary JSON-serializable data
   */
  emitToMeeting(meetingId: string, event: string, payload: unknown): void;
}

/**
 * Injection token for the IEventEmitter.
 */
export const EVENT_EMITTER = Symbol('IEventEmitter');
