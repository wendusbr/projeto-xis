function gerarTabelaHTML(arrayDados) {
    // Número de variáveis X
    var numVariaveis = arrayDados.numVariaveis;

    // Construir a expressão de maximização ou minimização Z
    var tipo = arrayDados.tipo.toUpperCase();
    var Z = tipo === "MAX" ? "MAXIMIZAR: Z = " : "MINIMIZAR: Z = ";
    for (var i = 0; i < numVariaveis; i++) {
        Z += arrayDados.z[i] + " X<span class='subindice'>" + (i + 1) + "</span>";
        if (i < numVariaveis - 1) {
            Z += " + ";
        }
    }

    // Construir as restrições
    var restricoes = "<p>sujeito a</p>";
    for (var i = 0; i < arrayDados.numRestricoes; i++) {
        var restricao = "";
        for (var j = 0; j < numVariaveis; j++) {
            restricao += arrayDados.restricoes[i][j + 1] + " X<span class='subindice'>" + (j + 1) + "</span> ";
            if (j < numVariaveis - 1) {
                restricao += "+ ";
            }
        }
        var rhs = arrayDados.restricoes[i][numVariaveis + 1];
        var sinal; //= arrayDados.restricoes[i][0] === "<=" ? "≤" : "≥";
        if(arrayDados.restricoes[i][0] === "<="){
            sinal = "≤";
        } else if(arrayDados.restricoes[i][0] === ">="){
            sinal = "≥";
        } else{
            sinal = "=";
        }
        restricoes += "<p>" + restricao + sinal + " " + rhs + "</p>";
    }

    // Montar o HTML da tabela
    var variaveisX = "";
    for (var i = 1; i <= numVariaveis; i++) {
        variaveisX += "X<span class='subindice'>" + i + "</span>";
        if (i < numVariaveis) {
            variaveisX += ", ";
        }
    }

    var tabelaHTML = `<table class="no-borde centro">
                        <tbody>
                            <tr>
                                <td>
                                    <span class="title" id="title">${Z}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>${restricoes}</td>
                            </tr>
                            <tr>
                                <td>${variaveisX} ≥ 0</td>
                            </tr>
                        </tbody>
                    </table>`;

    // Retornar o HTML da tabela
    document.getElementById('modelagem-feita').innerHTML = tabelaHTML + "<hr>";

}
