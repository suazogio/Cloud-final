const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get("/", (req, res) => {
  res.send("API Arquitectura Cloud funcionando correctamente");
});

app.post("/registros", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const result = await pool.query(
      "INSERT INTO registros (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );

    res.json({
      mensaje: "Registro guardado correctamente",
      registro: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/registros", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM registros ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});



