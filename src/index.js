import express, { response } from "express";
import { openDatabase } from "./database.js";
import {
  listVehicles,
  insertVehicles,
  updateVehicles,
  deleteVehicles,
} from "./constrollers/vehiclesController.js";
import {
  activityCheckin,
  activityCheckout,
  removeActivity,
} from "./constrollers/activitiesController.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // dentro do '*' poderia ser qual site poderia fazer a requisiçao.

  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

  res.header(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type, Authorization"
  );

  next();
});

app.get("/api/ping", (request, response) => {
  response.send({
    message: "pong",
  });
});

/* Endpointes Vehicles*/

app.get("/api/vehicles", listVehicles);
app.post("/api/vehicles", insertVehicles);
app.put("/api/vehicles/:id", updateVehicles);
app.delete("/api/vehicles/:id", deleteVehicles);

/*Endpoints Activities*/
app.post("/api/activities/checkin", activityCheckin);
app.put("/api/activities/checkout", activityCheckout);
app.delete("/api/activities/:id", removeActivity);
app.get("/api/activities", async (request, response) => {
  const db = await openDatabase();
  const activities = await db.all(`
    SELECT * FROM activities
    `);
  db.close();
  response.send(activities);
});

app.listen(8000, () => {
  console.log("Servidor rodando na porta 8000...");
});
