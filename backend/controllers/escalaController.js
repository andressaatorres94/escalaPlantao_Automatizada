const {
    gerarEscalaAutomatica
} = require(
    "../services/escalaService"
);

async function gerarEscala(
    req,
    res
) {

    try {

        let {
            mes,
            ano
        } = req.body;

        const resultado =
            await gerarEscalaAutomatica(
                Number(mes),
                Number(ano)
            );

        res.json(
            resultado
        );

    } catch (erro) {

        console.error(
            erro
        );

        res.status(500).json({
            erro:
                erro.message
        });
    }
}

module.exports = {
    gerarEscala
};