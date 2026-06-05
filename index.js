const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  addAppointment,
  getAppointments,
} = require("./controllers/appointments.controller");
const { loginUser } = require("./controllers/users.controller");
const auth = require("./middleware/auth");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express App",
    created: false,
    error: false,
  });
});

app.post("/appointments", async (req, res) => {
  try {
    await addAppointment(req.body.fullName, req.body.phone, req.body.problem);
    res.render("index", {
      title: "Express App",
      created: true,
      error: false,
    });
  } catch (e) {
    console.log("Creation error", e);
    res.render("index", {
      title: "Express App",
      created: false,
      error: true,
    });
  }
});

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express App",
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/appointments");
  } catch (e) {
    res.render("login", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.redirect("/login");
});

app.get("/appointments", auth, async (req, res) => {
  const page = Number(req.query.page) || 1;

  const search = req.query.search || "";

  const sort = req.query.sort || "desc";

  const result = await getAppointments({
    page,
    search,
    sort,
  });

  res.render("appointments", {
    ...result,
    page,
    search,
    sort,
    userEmail: req.user?.email,
  });
});

mongoose
  .connect(
    "mongodb+srv://tasich_db_user:TA123SICO@cluster0.qkjuzom.mongodb.net/appointments?appName=Cluster0",
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  });
