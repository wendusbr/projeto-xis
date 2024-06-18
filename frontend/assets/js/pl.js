function simplexMaxTable(entrada){
    const numVariaveis = entrada[0].length-1;
    const numRestricoes = entrada.length-1;
    let identidade = 1;
    
    let tabelaSimplex = [];
    const linhas = entrada.length;
    const colunas = numVariaveis + numRestricoes + 2; // 2 => coluna Z e LD

    for(let i=0; i<linhas; i++){
        tabelaSimplex.push([]); // Inicializa linha

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

function simplexMax(entrada){
    // var entrada = [[50, 80, 0], [1, 2, 120], [1, 1, 90]];
    // var entrada2 = [[8, 25, 0],[2,5,120], [0,3,60],[4,5,200]];
    // var entrada3 = [[3,5,0],[1,0,4],[0,2,12],[3,2,18]];
    const numVariaveis = entrada[0].length-1;
    const numRestricoes = entrada.length-1;

    let tabelaSimplex = simplexMaxTable(entrada);
    
    while(1){
        // Descobrir coluna pivotal
        let pesoZ=0, colunaPivotal;
        for(let i=1; i<=numVariaveis; i++){
            if(tabelaSimplex[0][i] < pesoZ){
                pesoZ = tabelaSimplex[0][i];
                colunaPivotal = i;
            }
        }

        if(pesoZ === 0)
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

        if(!pesoRestricao)
            return;

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

// var entrada = [[3,8,0], [1,4,3.5], [1,2,2.5]]
// [3 8 0]
// [1 4 3.5]
// [1 2 2.5]
function simplexMinTable(entrada){
    const numVariaveis = entrada[0].length-1;
    const numRestricoes = entrada.length-1;
    const linhas = numVariaveis;
    const colunas = numVariaveis + numRestricoes*2 + 1;

    let M = 100;

    // Montagem da linha Z
    let z = [];
    for(let i=0; i<colunas-1; i++){
        if(i < entrada[0].length-1)
            z.push(entrada[0][i]);
        else{
            z.push(0); // variável auxiliar
            i++;
            z.push(M); // variável artificial
        }
    }

    // Montagem matricial das equações referentes às restrições
    let identidade = 0;
    let tabelaSimplex = [];
    for(let i=0; i<linhas; i++){
        tabelaSimplex.push([]); // Inicializa linha

        for(let j=0; j<colunas; j++){
            if(j < entrada[0].length-1)
                tabelaSimplex[i][j] = entrada[i+1][j];
            else if(j < colunas-1){
                if(i==identidade && j==numVariaveis+identidade*2){
                    tabelaSimplex[i][j] = -1;
                    j++;
                    tabelaSimplex[i][j] = 1;
                    identidade++;
                }
                else
                    tabelaSimplex[i][j] = 0;
            }
            else
                tabelaSimplex[i][j] = entrada[i+1][entrada[0].length-1];
        }
    }

    // Vetor de coeficentes das variáveis na base
    let c = [];
    for(let i=0; i<numRestricoes; i++)
        c.push(M);

    // Vetor Zj
    let zj = [];
    for(let i=0; i<tabelaSimplex[0].length; i++){
        let value = 0;
        let j = 0;

        tabelaSimplex.forEach(element => {
            value += element[i]*c[j];
            j++;
            if(j == c.length)
                j=0;
        });

        zj.push(value);
    }

    // Vetor pesoZj (Cj - Zj)
    let pesoZj = [];
    for(let i=0; i<z.length; i++)
        pesoZj.push(z[i]-zj[i]);
    
    let result = [z, tabelaSimplex, c, zj, pesoZj];

    return result;
}

function simplexMin(entrada){
    const numVariaveis = entrada[0].length-1;
    const numRestricoes = entrada.length-1;

    let result = simplexMinTable(entrada);

    let z = result[0];
    let tabelaSimplex = result[1];
    let c = result[2];
    let zj = result[3];
    let pesoZj = result[4]


    while(1){    
        let minPesoZj=0, colunaPivotal;

        for(let i=0; i<numVariaveis; i++){
            if(!minPesoZj || pesoZj[i] < minPesoZj){
                minPesoZj = pesoZj[i]
                colunaPivotal = i;
            }
        }
        if(minPesoZj === 0)
            return;
        
        let pesoRestricao, linhaPivotal;

        for(let i=0; i<tabelaSimplex.length; i++){
            let element = tabelaSimplex[i];

            if(element[colunaPivotal] > 0 && element[element.length-1] > 0){
                if(!pesoRestricao || element[element.length-1]/element[colunaPivotal] < pesoRestricao){
                    pesoRestricao = element[element.length-1]/element[colunaPivotal];
                    linhaPivotal = i;
                }
            }
        }

        if(!pesoRestricao)
            return;

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

        c[linhaPivotal] = z[colunaPivotal]; 

        for(let i=0; i<tabelaSimplex[0].length; i++){
            let value = 0;
            let j = 0;

            tabelaSimplex.forEach(element => {
                value += element[i]*c[j];
                j++;
                if(j == c.length)
                    j=0;
            });

            zj[i] = value;
        }

        for(let i=0; i<z.length; i++)
            pesoZj[i] = (z[i]-zj[i]);

        console.log(z, tabelaSimplex, c, zj, pesoZj);
    }
}