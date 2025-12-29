// import mongoose from "mongoose";
const mongoose = require("mongoose");

// export default () => {
//   mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("MongoDB connected"))
//     .catch(err => console.error(err));
// };

module.exports = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));
};
