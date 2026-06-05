const Appointment = require("../models/Appointment");

async function addAppointment(fullName, phone, problem) {
  return Appointment.create({
    fullName,
    phone,
    problem,
  });
}

async function getAppointments({
  page = 1,
  limit = 10,
  search = "",
  sort = "desc",
}) {
  const filter = {
    fullName: {
      $regex: search,
      $options: "i",
    },
  };

  const total = await Appointment.countDocuments(filter);

  const appointments = await Appointment.find(filter)
    .sort({
      createdAt: sort === "asc" ? 1 : -1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    appointments,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = {
  addAppointment,
  getAppointments,
};
