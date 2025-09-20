// app.js
const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');
const { Client } = require('ssh2');
const url = require('url');

const app = express();

// Serve frontend on port 8000
app.use(express.static(path.join(__dirname, 'public')));
app.listen(8000, () => console.log('Frontend running at http://localhost:8000'));

// Start WebSocket SSH backend on 8001
const wss = new WebSocketServer({ port: 8001 });
wss.on('connection', (ws, req) => {
  const query = url.parse(req.url, true).query;
  const host = query.host;
  const port = parseInt(query.port || 22);
  const username = query.user;
  const password = query.password;

  const conn = new Client();
  let statusSent = false;

  conn.on('ready', () => {
    if (!statusSent) {
      ws.send(JSON.stringify({ type: 'status', status: 'reachable' }));
      statusSent = true;
    }

    conn.shell((err, stream) => {
      if (err) {
        if (!statusSent) {
          ws.send(JSON.stringify({ type: 'status', status: 'unreachable' }));
          statusSent = true;
        }
        ws.close();
        conn.end();
        return;
      }

      stream.on('data', (data) => ws.send(JSON.stringify({ type: 'data', data: data.toString() })));
      stream.on('close', () => { ws.close(); conn.end(); });

      ws.on('message', (msg) => {
        try {
          const parsed = JSON.parse(msg);
          if (parsed.type === 'input') stream.write(parsed.data);
        } catch {}
      });

      ws.on('close', () => conn.end());
    });
  });

  conn.on('error', () => {
    if (!statusSent) {
      ws.send(JSON.stringify({ type: 'status', status: 'unreachable' }));
      statusSent = true;
    }
    ws.close();
  });

  conn.connect({ host, port, username, password });
});

console.log('WebSSH backend running on ws://localhost:8001');
