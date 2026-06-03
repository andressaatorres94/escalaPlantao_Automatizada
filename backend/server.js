const express = require("express");

const router = express.Router();

const cors = require("cors");
const path = require("path");


const funcionariosRoutes = require("./routes/funcionariosRoutes");
const escalaRoutes = require("./routes/escalaRoutes");
const exportarRoutes =  require("./routes/exportarRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/funcionarios", funcionariosRoutes);
app.use("/api/escala", escalaRoutes);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/api/exportar",exportarRoutes);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado: http://localhost:${PORT}`);
});