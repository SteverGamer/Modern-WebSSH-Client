# WebSSH Client

A full-stack web-based SSH client that runs entirely on a Node.js server.  
This project serves both the frontend (HTML/CSS/JS) and the backend WebSocket bridge, allowing users to connect to SSH servers securely from any modern web browser.

---

## Features
- Browser-Based SSH – Connect to any SSH server through a web interface.
- Dark/Light Themes – Switchable UI and terminal themes (saved in `localStorage`).
- Persistent Connections – Save multiple SSH connections for easy reuse.
- Modern UI – A clean, visually appealing interface that feels more polished and user-friendly compared to tools like **ssheasy**.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- SSH access to at least one remote server.

### Clone Repository
```bash
git clone https://github.com/SteverGamer/modern-webssh-client.git
cd modern-webssh-client
```

### Install Dependencies
```bash
npm install
```

### Start the Server
This will:
1. Serve the frontend (HTML/CSS/JS) over HTTP.
2. Start a WebSocket backend for SSH connections.

```bash
node server.js
```

### Open in Browser
After the server starts, visit:
```
http://localhost:8000
```
Use this URL only (do not open `index.html` directly, as it requires the Node.js backend to function).

---

## Usage
1. Add a Connection  
   Click **Add Connection** on the homepage and fill in:
   - Connection Name
   - Host (IP or domain)
   - Port (default: 22)
   - Username
   - Password
2. Connect  
   Your saved connections appear as cards. Click **Connect** to open a terminal.
3. Interact  
   Use the terminal like any SSH session.
4. Exit  
   Click the **Exit** button (top-right corner) to close the session.

---

## Backend API

The backend exposes a WebSocket endpoint:

```
ws://localhost:8001
```

The frontend sends connection parameters as query strings:
```
ws://localhost:8001?host=<HOST>&port=<PORT>&user=<USERNAME>&password=<PASSWORD>
```

### Client → Server
| Type   | Example                                      | Description               |
|--------|----------------------------------------------|---------------------------|
| input  | `{"type":"input","data":"ls -la\n"}`         | Send terminal keystrokes. |

### Server → Client
| Type    | Example                                              | Description              |
|---------|------------------------------------------------------|--------------------------|
| status  | `{"type":"status","status":"reachable"}`             | Connection status update.|
| data    | `{"type":"data","data":"Welcome to Ubuntu..."} `     | SSH output stream.       |

---

## Security Notes
- Passwords are sent via query parameters for demo purposes.  
  For production use:
  - Prefer SSH key authentication.
  - Implement a secure token exchange or encrypted POST request.
- Always run behind HTTPS/WSS for encrypted transport.
- Consider adding authentication to restrict access to the WebSSH portal.

---

## Technologies
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) – Serves static frontend files.
- [Xterm.js](https://xtermjs.org/) – Terminal emulation in the browser.
- [ssh2](https://www.npmjs.com/package/ssh2) – Node.js SSH client.
- [Bootstrap 5](https://getbootstrap.com/) – Responsive UI.
- [xterm-addon-fit](https://github.com/xtermjs/xterm.js/tree/master/addons/fit) – Auto-fit terminal.

---

## Summary
The WebSSH Client provides fast, themeable SSH access directly in your web browser.  
With its **modern and visually refined UI**, it offers a much better user experience compared to basic implementations like **ssheasy**.  
By serving both the frontend and backend in a single Node.js application, deployment is simple and secure—ideal for personal servers, homelabs, or lightweight administrative tasks.
