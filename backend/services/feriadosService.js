const axios = require("axios");

async function buscarFeriadosNacionais(ano) {

    try {

        const response = await axios.get(
            `https://date.nager.at/api/v3/PublicHolidays/${ano}/BR`
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
    buscarFeriadosNacionais
};