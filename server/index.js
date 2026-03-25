const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const leaguesRouter = require('./routes/leagues');
const matchesRouter = require('./routes/matches');
const ledgerRouter = require('./routes/ledger');
const usersRouter = require('./routes/users');
const teamsRouter = require('./routes/teams');
const draftRouter = require('./routes/draft');
const ruleTemplatesRouter = require('./routes/ruleTemplates');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/leagues', leaguesRouter);
app.use('/matches', matchesRouter);
app.use('/ledger', ledgerRouter);
app.use('/users', usersRouter);
app.use('/teams', teamsRouter);
app.use('/draft', draftRouter);
app.use('/rule-templates', ruleTemplatesRouter);

app.get('/', (req, res) => res.json({ status: 'League Director API', version: '0.1.0' }));

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('draft:join', ({ leagueId, userId }) => {
    const room = `league-${leagueId}`;
    socket.join(room);
    io.to(room).emit('draft:notification', { message: `User ${userId} joined the draft`, timestamp: new Date() });
  });

  socket.on('draft:pick', (pick) => {
    const room = `league-${pick.leagueId}`;
    io.to(room).emit('draft:pick', pick);
  });

  socket.on('chat:message', (message) => {
    const room = `league-${message.leagueId}`;
    io.to(room).emit('chat:message', message);
  });

  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`League Director API running on http://localhost:${PORT}`));

// Simple ingestion queue worker (in-memory for prototype)
const { processLiveQueue } = require('./worker/liveIngestion');
processLiveQueue();
