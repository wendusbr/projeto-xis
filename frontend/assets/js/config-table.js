// inputTabela
$(document).ready(() =>{
    $("#gerarTabela").on('click', function (){
        var tabelaDinamica = "<table id='modelagemTabelar' class='table table-bordered nowrap mb-4 mt-1'>";
        // tabelaDinamica += "<!--<caption>Lista de motoristas associados aos seus caminhões</caption>-->";

        //-------------Cabeçalho-------------//
        tabelaDinamica += "<thead><tr><th scope='col'>&nbsp;</th>";
        
            for (var i = 1; i <= $('#numVariavel').val() ; i++) {
                tabelaDinamica += "<th scope='col'>x"+ i +"</th>";
            }

        tabelaDinamica += "<th scope='col'>&lt;&gt;=</th><th scope='col'>RSH</th></tr></thead><tbody id='conteudoTabela'>";

        //-------------Nomeação de variáveis-------------//

            // tabelaDinamica += "<tr id='nomeDasVariaveis'><td scope='col'>Nome variável</td>";
            
            //     for (var i = 1; i <= $('#numVariavel').val() ; i++) {
            //         tabelaDinamica += "<td scope='col'>";
            //             tabelaDinamica += '<input style="border: none;" type="text" class="form-control" data-id="x' + i + '" id="nome-x'+ i +'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
            //         tabelaDinamica +="</td>";
            //     }

            // tabelaDinamica += "<td scope='col'></td><td scope='col'></td></tr>";

        //-------------Tipo de problema (max-min)-------------//

        tabelaDinamica += "<tr id='tipoDeProblema'><td scope='col'>";
            tabelaDinamica += '<select id="min-max" class="form-select text-center" aria-label="Small select example">';
            //tabelaDinamica += '<option selected>Tipo de problema</option>';
            tabelaDinamica += '<option value="1">Maximização</option>';
            tabelaDinamica += '<option value="2">Minimização</option>';
            tabelaDinamica += '</select>';
        tabelaDinamica += "</td>";
        
        for (var i = 1; i <= $('#numVariavel').val() ; i++) {
            tabelaDinamica += "<td scope='col'>";
                tabelaDinamica += '<input style="border: none;" type="number" class="form-control" data-id="Z-x'+ i+'" id="Z-x'+ i+'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
            tabelaDinamica += "</td>";
        }

        tabelaDinamica += "<td scope='col'></td><td scope='col'></td></tr>";

        //--------------------------MODELAGEM----------------------------//
        for (var i = 1; i <= $('#numRestricao').val() ; i++) {
            tabelaDinamica += "<tr>";
            
            //Valores das variáveis
            for(var j = 0; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>";
                tabelaDinamica += (j != 0 ? '<input style="border: none;" type="number" class="form-control" data-id="val' + i + j + '" id="r' + i +'x' + j + '" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>' : 'Restrição ' + i);
                tabelaDinamica += "</td>";
            }

            //Tipo de restrição
            tabelaDinamica +=  "<td>";
                tabelaDinamica += '<select id="r'+ i + '" class="form-select text-center" aria-label="Small select example">';
                    tabelaDinamica += '<option value="1" selected>&lt;=</option>';
                    tabelaDinamica += '<option value="2">&lt;</option>';
                    tabelaDinamica += '<option value="3">&gt;=</option>';
                    tabelaDinamica += '<option value="4">&gt;</option>';
                    tabelaDinamica += '<option value="5">=</option>';
                tabelaDinamica += '</select>';
            tabelaDinamica +=  "</td>";

            //RSH
            tabelaDinamica +=  "<td>";
            tabelaDinamica += '<input style="border: none;" type="number" class="form-control" data-id="RSH' + i+ '" id="RSH'+ i +'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
            tabelaDinamica +=  "</td>";

            tabelaDinamica += "</tr>";
        }

        //--------------------------Limites----------------------------//
        tabelaDinamica += "<tr id='limiteSuperior'>";
        tabelaDinamica += "<td>Limites Superiores</td>"
            for(var j = 1; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>" +
                '<input style="border: none;" type="text" class="form-control" data-id="limSuperior" id="limSuperiorX'+ j+ '" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="Infinito" disabled></input>' +
                "</td>";
            }
        tabelaDinamica += "<td></td><td></td>" +
        "</tr>";

        tabelaDinamica += "<tr id='limiteInferior'>" +
        "<td>Limites Inferiores</td>";
            for(var j = 1; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>" +
                '<input style="border: none;" type="number" class="form-control" data-id="limInferior" id="limInferiorX'+ j+ '" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="0" disabled></input>' +
                "</td>";
            }
        tabelaDinamica += "<td></td><td></td>" +
        "</tr>";

        tabelaDinamica += "</tbody></table>";
        $('#inputTabela').html(tabelaDinamica);
    });

    $("#gerarSolucao").on('click', function () {
      const activeElements = $('.menu li a.active');
      if (activeElements.length === 0) {
        alert('Nenhum método selecionado.\nPor favor, selecione um método para gerar a solução.');
        return; // Prevent further execution if no active elements are found
      }

      // Array para armazenar todos os dados
      var dados = [];
  
      // ------------- Dados Iniciais -------------
      var dadosIniciais = [
        { "id": "nome-x1", "value": $("#nome-x1").val() },
        { "id": "nome-x2", "value": $("#nome-x2").val() },
        { "id": "min-max", "value": $("#min-max").val() },
        { "id": "Z-x1", "value": $("#Z-x1").val() },
        { "id": "Z-x2", "value": $("#Z-x2").val() }
      ];
      dados.push({ "id": "dados-iniciais", "value": dadosIniciais });
  
      // ------------- Valores das Restrições -------------
      for (var i = 1; i <= $('#numRestricao').val(); i++) {
        var restricao = [];
        for (var j = 1; j <= $('#numVariavel').val(); j++) {
          restricao.push({ "id": "r" + i + "x" + j, "value": $("#r" + i + "x" + j).val() });
        }
        restricao.push({ "id": "r" + i, "value": $("#r" + i).val() });
        restricao.push({ "id": "RSH" + i, "value": $("#RSH" + i).val() });
        dados.push({ "id": "r" + i, "value": restricao });
      }
  
      // ------------- Limites -------------
      var limites = [
        { "id": "limSuperiorX1", "value": $("#limSuperiorX1").val() },
        { "id": "limSuperiorX2", "value": $("#limSuperiorX2").val() },
        { "id": "limInferiorX1", "value": $("#limInferiorX1").val() },
        { "id": "limInferiorX2", "value": $("#limInferiorX2").val() }
      ];
      dados.push({ "id": "limites", "value": limites });
  
      console.log('Array final:', dados);
      // console.log('\n' + converterParaArrayFormatado(dados));
      chamarConversor(dados);
  
    });

    $('.menu li a').click(function(event) {
      event.preventDefault(); 
  
      const clickedElementId = $(this).attr('id');
      const activeViewClass = 'active';
  
      $('.menu li a').removeClass(activeViewClass);
      $('.menu li').removeAttr('style'); 
  
      $(this).addClass(activeViewClass);
  
      const clickedElementIdWithoutHash = clickedElementId.slice(1); 
      const clickedElement = $('#lin' + clickedElementIdWithoutHash);
  
      clickedElement.css('background-color', '#920686');
      clickedElement.css('color', 'black');
      clickedElement.css('text-shadow', '0px 0px 5px #fff');
      clickedElement.css('font-weight', 'bold');
      clickedElement.css('font-size', '15px');
    });
  });
  

//----------------------------------------------------------TEMPORÁRIO-----------------------------------------------------------
// Função para converter os dados formatados
// Função para converter os dados formatados
function converterParaArrayFormatado(dados) {
    // Encontrar os dados iniciais para Z
    var dadosIniciais = dados.find(item => item.id === "dados-iniciais").value;
    var Z = [];
    Z.push(parseFloat(dadosIniciais.find(item => item.id === "Z-x1")?.value || 0));
    Z.push(parseFloat(dadosIniciais.find(item => item.id === "Z-x2")?.value || 0));
    Z.push(0); // Adiciona o zero no final de Z conforme especificado

    // Extrair as restrições
    var restricoes = [];
    for (var i = 1; i <= dados.length - 2; i++) { // Iterar sobre as restrições, excluindo "dados-iniciais" e "limites"
        var restricao = dados.find(item => item.id === "r" + i);
        if (restricao) {
            var linhaRestricao = [];
            linhaRestricao.push(parseFloat(restricao.value.find(item => item.id === "r" + i + "x1")?.value || 0));
            linhaRestricao.push(parseFloat(restricao.value.find(item => item.id === "r" + i + "x2")?.value || 0));

            var RSH = parseFloat(restricao.value.find(item => item.id === "RSH" + i)?.value || 0);
            if (isNaN(RSH)) {
                console.warn(`RSH não encontrado ou inválido para RSH${i}`);
                RSH = 0; // Definir como 0 se RSH não for um número válido
            }
            linhaRestricao.push(RSH);

            restricoes.push(linhaRestricao);
        } else {
            console.warn(`Restrição não encontrada para r${i}`);
        }
    }

    // Retornar o array formatado com Z seguido das restrições
    return [Z].concat(restricoes);
}

function chamarConversor(dados){
  localStorage.setItem('dados', JSON.stringify(converterParaArrayFormatado(dados)));
  window.location.href = 'D:/Xampp/htdocs/projetoXis/projeto-xis/frontend/resolution.html'; // Redirecionamento para B.html
}