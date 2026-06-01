const XLSX = require('xlsx')
const path = require('path')

function gerarExcel(escala) {

    const workbook = XLSX.utils.book_new()

    const worksheet = XLSX.utils.json_to_sheet(
        escala.map(item => ({
            Data: item.data,
            Funcionario: item.nome,
            Matricula: item.matricula
        }))
    )

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Escala')

    const caminho = path.join(__dirname, '../../exports/escala.xlsx')

    XLSX.writeFile(workbook, caminho)

    return caminho
}

module.exports = {
    gerarExcel
}