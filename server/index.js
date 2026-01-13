// server/index.js (CommonJS)

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { users } = require("./mockUsers");

const app = express();
const PORT = process.env.PORT || 4000;

const FRONTEND_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",");

app.use(
  cors({
    origin: FRONTEND_ORIGINS,
    credentials: true,
  })
);

app.use(bodyParser.json());

// simple in-memory token store
const tokens = new Map();

app.post("/api/login", (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ ok: false, error: "Missing email" });
  }

  const user = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ ok: false, error: "Invalid email or password" });
  }

  const uid = user.user_id;
  const token = `mock-token-${uid}-${Date.now()}`;
  tokens.set(token, uid);

  return res.json({
    ok: true,
    user: {
      id: user.user_id,
      name: user.full_name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

app.get("/api/me", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace(/^Bearer\s+/i, "");

  if (!token || !tokens.has(token)) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  const userId = tokens.get(token);
  const user = users.find((u) => u.user_id === userId);

  if (!user) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }

  res.json({
    ok: true,
    user: {
      id: user.user_id,
      name: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
});

app.listen(PORT, () => {
  console.log(`✅ Mock auth server running on http://localhost:${PORT}`);
});
