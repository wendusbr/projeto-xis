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

function simplexMax(){
    var entrada = [[50, 80, 0], [1, 2, 120], [1, 1, 90]];
    var entrada2 = [[8, 25, 0],[2,5,120], [0,3,60],[4,5,200]];
    var entrada3 = [[3,5,0],[1,0,4],[0,2,12],[3,2,18]] ;

    const numVariaveis = 2;
    let tabelaSimplex = simplexTable(entrada);
    let valoresVariaveis = [];

    for(let i=0; i<numVariaveis; i++)
        valoresVariaveis.push(tabelaSimplex[0][i+1]);

    console.log(valoresVariaveis);
    
}