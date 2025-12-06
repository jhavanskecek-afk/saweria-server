import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let lastDonation = null;

// Webhook endpoint (Saweria kirim ke sini)
app.post("/webhook", (req, res) => {
  const body = req.body;
  console.log("Donasi diterima:", body);

  lastDonation = {
    name: body.donator_name || body.name || "Anon",
    amount: body.amount_raw || body.amount || 0,
    message: body.message || "",
    timestamp: new Date().toISOString(),
  };

  res.status(200).send({ ok: true });
});

// Endpoint polling untuk Roblox
app.get("/donations/latest", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (lastDonation) {
    res.json({
      status: "success",
      latestDonation: lastDonation,
    });
    lastDonation = null;
  } else {
    res.json({
      status: "success",
      latestDonation: null,
    });
  }
});

// Basic health check (opsional)
app.get("/", (req, res) => {
  res.send("Server Saweria is up");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));