const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes'); // Adjust the path based on your file structure


require("dotenv").config();

const app = express();

// parse application/json
app.use(express.json());
// cors
app.use(cors());



app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/",
    data: "Not found",
  });
});
app.use('/users', userRoutes);
app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3002;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb, {
  
  dbName: "db-contacts",
});
console.log(uriDb);
connection
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
  app.use("/api", require("./api/index")); // Adjust the path based on your file structure
app.use("/users", require("./routes/userRoutes")); // Adjust the path based on your file structure
