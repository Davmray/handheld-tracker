require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

const Device = mongoose.model("Device", {
    deviceId: String,
    store: String,
    assignedTo: String,
    status: { type: String, default: "Avaliable" }
});


// GET all devices
app.get("/devices", async (req, res) => {
    const devices = await Device.find();
    res.json(devices);
});

// POST new device
app.post("/devices", async (req, res) => {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.json(newDevice);
});

// health check
app.get("/", (req, res) => {
    res.send("Handheld Tracker API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});