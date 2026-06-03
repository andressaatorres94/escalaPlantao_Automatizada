const axios = require("axios");

async function buscarFeriados(ano) {

    try {

        const response = await axios.get(
            `https://brasilapi.com.br/api/feriados/v1/${ano}`
        );

        return response.data.map(
            item => item.date
        );

    } catch (erro) {

        console.error(
            "Erro ao buscar feriados:",
            erro.message
        );

        return [];
    }
}

module.exports = {
    buscarFeriados
};