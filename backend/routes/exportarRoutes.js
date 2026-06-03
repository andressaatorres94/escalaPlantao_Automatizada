const express = require("express");
const router = express.Router();

/*const {
    exportarEscalaExcel
} = require("../services/excelService");
*/

const {
    exportarExcel
} = require("../controllers/exportarController");

router.get(
    "/excel",
    exportarExcel
);

module.exports = router;

/*function exportarExcel(req,res) {

    const arquivo = exportarEscalaExcel();

    res.download(arquivo);
}

module.exports = {
    exportarExcel
};*/