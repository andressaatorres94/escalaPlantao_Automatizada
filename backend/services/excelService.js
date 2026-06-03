const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

function exportarEscalaExcel() {

    const historico = JSON.parse(fs.readFileSync(path.join(
                __dirname,"../../data/escala.json"
            ),"utf8"
        )
    );

    const workbook =XLSX.utils.book_new();

    Object.keys(historico).forEach(
        mesAno => {

            const escalaMes =historico[mesAno];

            const worksheet =XLSX.utils.json_to_sheet(
                    escalaMes
                );

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                mesAno
            );
        }
    );

    const pastaExportacao =path.join(__dirname,"../../exports");

    if (
        !fs.existsSync(
            pastaExportacao
        )
    ) {

        fs.mkdirSync(
            pastaExportacao,
            {
                recursive: true
            }
        );
    }

    const arquivo =path.join(pastaExportacao,"escalaPlantao.xlsx");

    XLSX.writeFile(
        workbook,
        arquivo
    );

    return arquivo;
}

module.exports = {
    exportarEscalaExcel
};