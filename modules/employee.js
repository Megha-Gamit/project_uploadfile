const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  etype: String,
  hourlyrate: Number,
  totalHour: Number,
  total:Number,
});

const employeemodel = mongoose.model("employee",employeeSchema);

module.exports = employeemodel;