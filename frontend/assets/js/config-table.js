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

            tabelaDinamica += "<tr id='nomeDasVariaveis'><td scope='col'>Nome variável</td>";
            
                for (var i = 1; i <= $('#numVariavel').val() ; i++) {
                    tabelaDinamica += "<td scope='col'>";
                        tabelaDinamica += '<input style="border: none;" type="text" class="form-control" data-id="x' + i + '" id="nome-x'+ i +'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
                    tabelaDinamica +="</td>";
                }

            tabelaDinamica += "<td scope='col'></td><td scope='col'></td></tr>";

        //-------------Tipo de problema (max-min)-------------//

        tabelaDinamica += "<tr id='tipoDeProblema'><td scope='col'>";
            tabelaDinamica += '<select id="min-max" class="form-select text-center" aria-label="Small select example">';
            tabelaDinamica += '<option selected>Tipo de problema</option>';
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
                '<input style="border: none;" type="text" class="form-control" data-id="limSuperior" id="limSuperiorX'+ j+ '" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="Inf"></input>' +
                "</td>";
            }
        tabelaDinamica += "<td></td><td></td>" +
        "</tr>";

        tabelaDinamica += "<tr id='limiteInferior'>" +
        "<td>Limites Inferiores</td>";
            for(var j = 1; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>" +
                '<input style="border: none;" type="number" class="form-control" data-id="limInferior" id="limInferiorX'+ j+ '" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="0"></input>' +
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
      
      console.log('Teste:\n', convertJSONtoTempArray(dados));
  
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

  function convertJSONtoTempArray(jsonData) {
    // Initialize the temporary array
    const tempArray = [];
  
    // Iterate through each object in the JSON data
    for (const obj of jsonData) {
      // Extract the ID and value properties
      const id = obj.id;
      const value = obj.value;
  
      // Handle different ID cases
      switch (id) {
        // Case for initial data
        case 'dados-iniciais':
          // Extract variable names
          const varNames = value.map(item => item.value);
  
          // Add variable names to the temporary array
          tempArray.push(varNames);
          break;
  
        // Case for restriction objects
        case `r${restrictionNumber}`:
          // Extract constraint coefficients and RHS value
          const coefficients = value.slice(0, -3).map(item => item.value);
          const rhsValue = value[value.length - 1].value;
  
          // Convert coefficients and RHS to a string representation
          const constraintString = `${coefficients.join('x') + varNames.join('')} <= ${rhsValue}`;
  
          // Add the constraint string to the temporary array
          tempArray.push(constraintString);
          break;
  
        // Case for limit objects
        case 'limites':
          // Extract upper and lower limits
          const upperLimits = value.slice(0, 2).map(item => item.value);
          const lowerLimits = value.slice(2).map(item => item.value);
  
          // Convert limits to a string representation
          const limitStrings = [];
          for (let i = 0; i < varNames.length; i++) {
            limitStrings.push(`${varNames[i]} <= ${upperLimits[i]}`);
            limitStrings.push(`${varNames[i]} >= ${lowerLimits[i]}`);
          }
  
          // Add the limit strings to the temporary array
          tempArray.push(...limitStrings);
          break;
  
        default:
          console.warn('Unrecognized ID:', id);
      }
    }
  
    // Return the temporary array
    return tempArray;
  }