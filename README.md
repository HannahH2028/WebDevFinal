# WebDevFinal

## How to Run

First, make sure to install mongodb, npm, node, and other necessities. I included mac instructions since I am on macos.

```bash
# Terminal 1: Start MongoDB (if not already running)
brew services start mongodb/brew/mongodb-community

# Terminal 2: Start Express server
cd server && npm install && npm run dev

# Terminal 3: Start React client
cd client && npm install && npm run dev

# Open http://localhost:5173 in your browser
```
