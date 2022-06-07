// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var cCliente;
    
//GETS

async function getDocumentosVencidosTotal(pEmpresa, pFecha){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      var rGetDocumentosVencidosTotal = await fetch(WebApiServer + "api/Cartera/GetDocumentosVencidosTotal?Empresa="+ pEmpresa +"&Fecha="+ pFecha, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

        console.log(rGetDocumentosVencidosTotal);

        await loadTable(rGetDocumentosVencidosTotal);
                    
}


async function setFecha(){

    var cFechaTiempo = new Date();
    cFecha = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    return cFecha;
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
                    50, 100, 200, -1 
                ],
                [
                    50, 100, 200, "Todos"
                ]
            ],
            order: [[ 1, "asc" ]],
            columns: [
                {    // 1
                    title: "Pedido",
                    data: "NRODCTO"
                },
                {    // 2
                    title: "Referencia",
                    data: "DCTOREF"
                }, { // 3
                    title: "Fecha",
                    data: "FECHA",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
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
                }, { // 10
                    title: "Venta",
                    data: "TIPOVENTA"
                },
                
            ]
        });
    
}

$(document).ready(async function(){

    cFecha = await setFecha();

    console.log(cFecha);

    await getDocumentosVencidosTotal(cEmpresa, cFecha);

});

$("#bt-home").click(async function () {
    userHome(cInterno);
});







