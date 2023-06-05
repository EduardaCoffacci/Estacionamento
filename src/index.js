import express, { response } from "express";
const app = express();

app.use(express.json());

app.get("/api/ping", (request, response) => {
  response.send({
    message: "pong",
  });
});

/* Endpointes Vehicles*/

app.get("/api/vehicles", (request, response) => {
  const { id} = request.query;
  const vehicles = [
    {
      id: 1,
      name: "Onix 1.4",
      owner: "Marcus Vinicius",
      type: "car",
    },
    {
      id: 2,
      name: "Cobalt Cinza",
      owner: "Maria Eduarda",
      type: "car",
    },
  ];
  if (id) {
    response.send(vehicles.filter((vehicles) => vehicles.id == id));
    return;
  }
  response.send(vehicles);
});

app.post('/api/vehicles', (request, response)=>{
    
});

app.put('/api/vehicles', (request, response)=>{

});

app.delete('/api/vehicles/:id', (request, response)=>{
    
});


app.listen(8000, () => {
  console.log("Servidor rodando na porta 8000...");
});
