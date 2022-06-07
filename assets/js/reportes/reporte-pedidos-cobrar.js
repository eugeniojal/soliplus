// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var cCliente;
    
//GETS
async function getListaClientes(pEmpresa, pUsuario, pFiltrado){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetListaClientes = await fetch(WebApiServer + "api/Common/GetListaClientes?Empresa=" + pEmpresa +"&Usuario=" + pUsuario + "&Filtrado=" + pFiltrado, requestOptions)
    .then(response => response.json());
  
    $listaClientes.html('<optgroup label="Seleccione"></optgroup>');

    await asyncForEach(rGetListaClientes, async (element) => { 

        $listaClientes.append($('<option />', {
            value: (element.RIF),
            text: (element.NOMBRE)
        }));

    });

    $("#input-cliente").val(undefined).select2();

}

async function getDocumentosVencidos(pEmpresa, pRif, pFecha){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      var rGetDocumentosVencidos = await fetch(WebApiServer + "api/Cartera/GetDocumentosVencidos?Empresa="+ pEmpresa +"&Rif="+ pRif +"&Fecha="+ pFecha, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        console.log(rGetDocumentosVencidos);

        await loadTable(rGetDocumentosVencidos);
                    
}

async function getTasaCambio(pEmpresa, pFecha){

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rGetTasaCambio = await fetch(WebApiServer + "api/Common/GetTasaCambio?Empresa="+pEmpresa+"&Fecha="+ pFecha, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    
    if(rGetTasaCambio.length > 0){

        if(rGetTasaCambio[0].VALOR == 0){

            return "1.00";

        } else {

            return formatNumber(rGetTasaCambio[0].VALOR);

        }     
        

    } else {

        return formatNumber(1);

    }

}

//PUT
async function putActualizarTasaPedido(pEmpresa, pTipoDcto, pNroDcto, pTasaCambio, pFecha, pUsuario){

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      
      return await fetch(`${WebApiServer}api/Cartera/PutActualizarTasaPedido?Empresa=${pEmpresa}&NroDcto=${pNroDcto}&TipoDcto=${pTipoDcto}&TasaCambio=${pTasaCambio}&Fecha=${pFecha}&PasswordMo=${pUsuario}`, requestOptions)
                    .then(response => response.json())
                    .catch(error => console.log('error', error));
      
}

//FUNCIONES FUNCIONALES
async function setFecha(){

    var cFechaTiempo = new Date();
    cFechaNueva = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    return cFechaNueva;
}

async function setFechaVencimiento(pFecha, pPlazo){

    cFechaInicial = moment(pFecha);    
    cFechaFinal = cFechaInicial.add(pPlazo, 'days'); 
    cFechaVencimiento = cFechaFinal.format().substr(0,10);
    return cFechaVencimiento;
}

//TABLA
async function loadTable(cSource) {

    var table = $('#reportTable').DataTable({
            data: await cSource,
            destroy: true,
            fixedHeader: {
                header: true,
                headerOffset: 64
            },
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla =(",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            searchPanes: {
                cascadePanes: true,
                initCollapsed: true,
                layout: 'columns-3',
                dtOpts: {
                    dom: 'tp',
                    paging: 'true',
                    pagingType: 'numbers'
                }
    
            },
            responsive: true,
            dom: '<"top"P>rtBi<"bottom"lp><"clear">',
            columnDefs: [
                {
                    searchPanes: {
                        show: true
                    },
                    targets: [
                       0,
                       1,
                    ]
    
                }
            ],
            buttons: [
                {
                    extend: 'pdf',
                    messageBottom: null,
                    text: '<i class="fas fa-file-pdf"></i>',
                    title: 'Reporte Saldo Consolidado',
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fas fa-copy"></i>',
                    title: 'Reporte Saldo Consolidado',
                    className: 'btn btn-primary',
                    exportOptions: {
                        modifier: {
                            page: 'current'
                        }
                    }
                }

            ],
            lengthMenu: [
                [
                    -1, 100, 200, 300 
                ],
                [
                    "Todos", 100, 200, 300, 
                ]
            ],
            order: [[ 1, "asc" ]],
            columns: [
                {    // 0
                    title: "Tipo Dcto",
                    data: "TIPODCTO"
                },
                {    // 1
                    title: "Pedido",
                    data: "NRODCTO"
                },
                {    // 2
                    title: "Referencia",
                    data: "DCTOREF"
                }, { // 3
                    title: "Fecha Vencimiento",
                    data: "FECHA_VEN",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, { // 4
                    title: "Plazo",
                    data: "PLAZO",
                }, { // 5
                    title: "Valor US",
                    data: "VALORUS"
                }, { // 6
                    title: "Valor BS",
                    data: "VALORBS"
                }, { // 7
                    title: "Saldo US",
                    data: "SALDOUS"
                }, { // 8
                    title: "Saldo BS",
                    data: "SALDOBS"
                }, { // 9
                    title: "Tasa",
                    data: "TCAMBIO"
                }, { // 1-
                    title: "Fecha Cambio",
                    data: "FECTCAMB",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, {
                    "title": "Ajustar Tasa",
                    "targets": -1,
                    "data": null,
                    "defaultContent":'<button id="bt-proceso" style="padding: 8 5" type="button" class="btn btn-primary btn-sm">Actualizar</button>'
                },
                
            ]
        });
    
}


$(document).ready(async function(){

    await getListaClientes(cEmpresa, cUsuario, cFiltrado);
    

});

$("#input-cliente").change(async function(){

    cCliente = this.value;

});

$("#bt-home").click(async function () {
    userHome(cInterno);
});

$("#bt-generar").click(async function (){

    cDatosCliente = $("#input-cliente").val();
    cFecha = $("#input-fecha").val();
    cTasa = await getTasaCambio(cEmpresa, cFecha);
    
    console.log(cTasa);

    $("#input-tasa-dia").val(cTasa);
    $("#tasa-dia").removeClass("visually-hidden");

    await getDocumentosVencidos(cEmpresa, cDatosCliente, cFecha);

    $('#reportTable tbody').on( 'click', 'button', async function () {

        var cTipoDcto = $(this).parents('tr').find("td:eq(0)").text();
        var cNroDcto = $(this).parents('tr').find("td:eq(1)").text();

        var respuesta = await putActualizarTasaPedido(cEmpresa, cTipoDcto, cNroDcto, cTasa, cFecha, cUsuario);

        if(respuesta[0].Response == true){

            showModal('Mensaje', 'Pedido actualizado correctamente');
            var myTable = $('#reportTable').DataTable();
            myTable.clear();
            await getDocumentosVencidos(cEmpresa, cDatosCliente, cFecha);

        } else {
            showModal('Error', 'Error al actualizar pedido');
        }
        
    } );


});







