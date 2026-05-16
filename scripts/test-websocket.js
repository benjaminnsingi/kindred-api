/**
 * WebSocket test client for Kindred meetings.
 *
 * Connects to the /meetings namespace with a JWT, subscribes to a meeting room,
 * and logs all 'participant:joined' and 'participant:left' events.
 *
 * Usage:
 *   1. Login via REST to get a JWT token
 *   2. Create or find a scheduled meeting, copy its ID
 *   3. Set TOKEN and MEETING_ID below
 *   4. Run: node scripts/test-websocket.js
 *   5. From Postman (with another user), join/leave the meeting
 *   6. Watch events appear in this terminal
 */

const { io } = require('socket.io-client');

// =====================================================
// CONFIG - Modify these values before running
// =====================================================
const TOKEN = 'PASTE_YOUR_JWT_TOKEN_HERE';
const MEETING_ID = 'PASTE_YOUR_MEETING_ID_HERE';
// =====================================================

if (TOKEN.includes('PASTE_YOUR') || MEETING_ID.includes('PASTE_YOUR')) {
  console.error('❌ Please set TOKEN and MEETING_ID before running this script.');
  process.exit(1);
}

console.log('🔌 Connecting to WebSocket at ws://localhost:3000/meetings...');

const socket = io('http://localhost:3000/meetings', {
  auth: {
    token: TOKEN,
  },
  transports: ['websocket'],
});

// === Connection lifecycle ===

socket.on('connect', () => {
  console.log(`✅ Connected. Socket id: ${socket.id}`);
  console.log(`📡 Subscribing to meeting ${MEETING_ID}...`);

  socket.emit('meeting:subscribe', { meetingId: MEETING_ID }, (response) => {
    if (response?.success) {
      console.log(`✅ Subscribed successfully. Listening for events...\n`);
    } else {
      console.error('❌ Subscribe failed:', response);
    }
  });
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection error:', err.message);
});

socket.on('disconnect', (reason) => {
  console.log(`🔌 Disconnected: ${reason}`);
});

// === Meeting events ===

socket.on('participant:joined', (data) => {
  console.log('🟢 PARTICIPANT JOINED:', JSON.stringify(data, null, 2));
});

socket.on('participant:left', (data) => {
  console.log('🔴 PARTICIPANT LEFT:', JSON.stringify(data, null, 2));
});

// === Graceful shutdown ===

process.on('SIGINT', () => {
  console.log('\n👋 Disconnecting...');
  socket.disconnect();
  process.exit(0);
});

console.log('Script running. Press Ctrl+C to quit.\n');
