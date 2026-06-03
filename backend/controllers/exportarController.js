const {
    exportarEscalaExcel
} = require(
    "../services/excelService"
);

function exportarExcel(
    req,
    res
) {

    const arquivo =
        exportarEscalaExcel();

    res.download(arquivo);
}

module.exports = {
    exportarExcel
};