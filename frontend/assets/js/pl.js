function simplexTable(entrada){
    const numVariaveis = entrada[0].length-1;
    const numRestricoes = entrada.length-1;
    let identidade = 1;
    
    let tabelaSimplex = [];
    const linhas = entrada.length;
    const colunas = numVariaveis + numRestricoes + 2; // 2 => coluna Z e LD

    for(let i=0; i<linhas; i++){
        // Inicializa linha
        tabelaSimplex.push([]);

        for(let j=0; j<colunas; j++){
            // Se primeira coluna (Z)
             if(j==0){
                tabelaSimplex[i][j] = i==0 ? 1 : 0;
             }
             // Se colunas de variáveis
             else if(j<entrada[0].length){
                tabelaSimplex[i][j] = i==0 ? -entrada[i][j-1] : entrada[i][j-1];
             }
             // Se colunas de variáveis auxiliares
             else if(j<colunas-1){
                if(i==0){
                    tabelaSimplex[i][j] = 0;
                }
                else{
                    if(i==identidade && j==numVariaveis+identidade){
                        tabelaSimplex[i][j] = 1;
                        identidade++;
                    }
                    else
                        tabelaSimplex[i][j] = 0;
                }
             }
             // Se lado direto (LD)
             else{
                tabelaSimplex[i][j] = entrada[i][entrada[0].length-1];
             }
        }
    }

    return tabelaSimplex;
}

function simplexMax(entrada, numVariaveis, numRestricoes){
    // var entrada = [[50, 80, 0], [1, 2, 120], [1, 1, 90]];
    // var entrada2 = [[8, 25, 0],[2,5,120], [0,3,60],[4,5,200]];
    // var entrada3 = [[3,5,0],[1,0,4],[0,2,12],[3,2,18]] ;

    let tabelaSimplex = simplexTable(entrada);
    
    while(1){
        // Descobrir coluna pivotal
        let pesoZ=0, colunaPivotal;
        for(let i=1; i<=numVariaveis; i++){
            if(tabelaSimplex[0][i] < pesoZ){
                pesoZ = tabelaSimplex[0][i];
                colunaPivotal = i;
            }
        }

        if(pesoZ == 0)
            return;

        // Descobrir linha pivotal
        let pesoRestricao, linhaPivotal;
        for(let i=1; i<=numRestricoes; i++){
            // Não se divide entre números negativos
            if(tabelaSimplex[i][tabelaSimplex[0].length-1] > 0 && tabelaSimplex[i][colunaPivotal] > 0){
                if(!pesoRestricao || tabelaSimplex[i][tabelaSimplex[0].length-1]/tabelaSimplex[i][colunaPivotal] < pesoRestricao){
                    pesoRestricao = tabelaSimplex[i][tabelaSimplex[0].length-1]/tabelaSimplex[i][colunaPivotal];
                    linhaPivotal = i;
                }
            }
        }

        let elementoPivotal = tabelaSimplex[linhaPivotal][colunaPivotal];

        // Divide toda linha pivotal pelo elemento pivotal
        if(elementoPivotal != 1){
            for(let i=0; i<tabelaSimplex[0].length; i++)
                tabelaSimplex[linhaPivotal][i] /= elementoPivotal;
        }

        // Escalonamento
        let coeficiente;
        for(let i=0; i<tabelaSimplex.length; i++){
            if(i != linhaPivotal){
                coeficiente = tabelaSimplex[i][colunaPivotal];
                for(let j=0; j<tabelaSimplex[0].length; j++){
                    tabelaSimplex[i][j] += -coeficiente*tabelaSimplex[linhaPivotal][j];
                }
            }
        }

        console.log(tabelaSimplex);
    }
}