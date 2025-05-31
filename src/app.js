console.log("Start of app");
const express = require("express");

const app = express();
app.use("/", (req, res) => {
  res.send("Response from App");
});

app.listen(3000, () => {
  console.log("Server is running");
});
