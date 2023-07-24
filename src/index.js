import express, { response } from "express";
import { openDatabase } from "./database.js";
import {
  listVehicles,
  insertVehicles,
  updateVehicles,
  deleteVehicles,
} from "./constrollers/vehiclesController.js";
//import {
//activityCheckin,
//activityCheckout,
//removeActivity,
//} from "./constrollers/activitiesController.js";

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
app.post("/api/activities/checkin", async (request, response) => {
  const { label } = request.body;
  const db = await openDatabase();

  const vehicle = await db.get(
    `
            SELECT * FROM vehicles WHERE label = ? 
            `,
    [label]
  );

  if (vehicle) {
    const checkinAt =(new Date()).getTime();
    const data = await db.run(
      ` INSERT INTO activities (vehicle_id, checkin_at)
                VALUES(?, ?)
              `,[vehicle.id, checkinAt]);
    db.close();
    response.send({
      vehicle_id: vehicle.id,
      checkin_at: checkinAt,
      message: `Veiculo [${vehicle.label}] entrou no estacionamento`,
    });
    return;
  }
  db.close();
  response.send({
    message: `Veículo [${label}] não cadastrado`
  });
});

app.put("/api/activities/checkout", async (request, response) => {
  const { label, price } = request.body;
  const db = await openDatabase();

  const vehicle = await db.get(
    `
            SELECT * FROM vehicles WHERE label = ? 
            `,
    [label]
  );

  if (vehicle) {
    const activityOpen = await db.get(
      `
              SELECT * 
              FROM activities 
              WHERE vehicle_id = ? 
              AND checkout_at IS NULL 
              `,
      [vehicle.id]
    );

    if (activityOpen) {
      const checkoutAt = (new Date()).getTime();
      const data = await db.run(
        ` UPDATE activities 
             SET checkout_at = ?, 
               price = ?
            WHERE id = ? 
          `,
        [checkoutAt, price, activityOpen.id]
      );
      db.close();
      response.send({
        vehicle_id: vehicle.id,
        checkout_at: checkoutAt,
        price: price,
        message: `Veiculo [${vehicle.label}] saiu do estacionamento`,
      });
      return;
    }

    db.close();
    response.send({
      message: `Veículo [${label}] não realizou nenhum check-in`,
    });
    return;
  }

  db.close();
  response.send({
    message: `Veículo [${label}] não cadastrado`,
  });
});

app.delete("/api/activities/:id", async (request, response) => {
  async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const data = await db.run(
      `
      DELETE FROM activities
      WHERE id = ?
      `,
      [id]
    );
    db.close();
    response.send({
      id,
      message: ` Atividades [${id}] removida com sucesso,`,
    });
  };
});

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
