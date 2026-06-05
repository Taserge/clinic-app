const mongoose = require("mongoose");
const validator = require("validator");

const AppointmentSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^\+?[0-9]{10,15}$/.test(value),
      message: "Некорректный телефон",
    },
  },
  problem: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
