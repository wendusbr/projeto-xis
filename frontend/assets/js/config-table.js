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
                        tabelaDinamica += '<input style="border: none;" type="text" class="form-control" data-id="x' + i + '" id="x'+ i +'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
                    tabelaDinamica +="</td>";
                }

            tabelaDinamica += "<td scope='col'></td><td scope='col'></td></tr>";

        //-------------Tipo de problema (max-min)-------------//

        tabelaDinamica += "<tr id='tipoDeProblema'><td scope='col'>";
            tabelaDinamica += '<select class="form-select text-center" aria-label="Small select example">';
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
                tabelaDinamica += (j != 0 ? '<input style="border: none;" type="number" class="form-control" data-id="val' + i + j + '" id="val' + i + j + '" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>' : 'Restrição ' + i);
                tabelaDinamica += "</td>";
            }

            //Tipo de restrição
            tabelaDinamica +=  "<td>";
                tabelaDinamica += '<select id="r-'+ i + '" class="form-select text-center" aria-label="Small select example">';
                    tabelaDinamica += '<option value="1" selected>&lt;=</option>';
                    tabelaDinamica += '<option value="2">&lt;</option>';
                    tabelaDinamica += '<option value="2">&gt;=</option>';
                    tabelaDinamica += '<option value="2">&gt;</option>';
                tabelaDinamica += '</select>';
            tabelaDinamica +=  "</td>";

            //RSH
            tabelaDinamica +=  "<td>";
            tabelaDinamica += '<input style="border: none;" type="number" class="form-control" data-id="RSH' + i + j + '" id="RSH'+ i+j +'" aria-describedby="basic-addon3 basic-addon4" maxlength="8"></input>';
            tabelaDinamica +=  "</td>";

            tabelaDinamica += "</tr>";
        }

        //--------------------------Limites----------------------------//
        tabelaDinamica += "<tr id='limiteSuperior'>";
        tabelaDinamica += "<td>Limites Superiores</td>"
            for(var j = 1; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>" +
                '<input style="border: none;" type="text" class="form-control" data-id="limSuperior" id="limSuperior" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="Inf"></input>' +
                "</td>";
            }
        tabelaDinamica += "<td></td><td></td>" +
        "</tr>";

        tabelaDinamica += "<tr id='limiteInferior'>" +
        "<td>Limites Inferiores</td>";
            for(var j = 1; j <= $('#numVariavel').val() ; j++){
                tabelaDinamica +=  "<td>" +
                '<input style="border: none;" type="number" class="form-control" data-id="limInferior" id="limInferior" aria-describedby="basic-addon3 basic-addon4" maxlength="8" value="0"></input>' +
                "</td>";
            }
        tabelaDinamica += "<td></td><td></td>" +
        "</tr>";

        tabelaDinamica += "</tbody></table>";
        $('#inputTabela').html(tabelaDinamica);
    });
});

$(document).ready(function() {
    $('#myButton').click(function() {
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            type: 'GET',
            success: function(response) {
                $('#response').text(JSON.stringify(response, null, 2));
            },
            error: function(error) {
                $('#response').text('An error occurred');
            }
        });
    });
});