const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// DB
mongoose.connect("mongodb://127.0.0.1:27017/cdrn");

// ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/incidents", require("./routes/incident"));
app.use("/sos", require("./routes/sos"));
app.use("/tasks", require("./routes/task"));
app.use("/damage", require("./routes/damage"));

app.get("/", (req, res) => res.send("CDRN Backend Running"));

app.listen(5000, () => console.log("Server running at 5000"));
