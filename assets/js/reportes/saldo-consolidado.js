// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

$(document).ready(function(){

    getReporteSaldoConsolidado(cEmpresa, cUsuario, cFiltrado);
   
});




async function getReporteSaldoConsolidado(pEmpresa, pUsuario, pFiltrado){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetReporteSaldoConsolidado = await fetch(WebApiServer + "api/Cartera/GetReporteSaldoConsolidado?Empresa=" + pEmpresa +"&Usuario=" + pUsuario + "&Filtrado=" + pFiltrado, requestOptions)
        .then(response => response.json());

        await loadTable(rGetReporteSaldoConsolidado);

}

$("#bt-home").click(async function () {
    userHome(cInterno);
});


async function loadTable(cSource) {

    $('#reportTable').DataTable({
            data: await cSource,
            destroy: true,
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
                },
                "buttons": {
                    "copyTitle": 'Datos copiados',
                    "copySuccess": {
                        "1": "Se copió una fila",
                        "_": "Se copiaron %d filas"
                    },
                    "copy": "Copiar",
                    "colvis": "Visibilidad"
                },
               
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
                       1,
                       2,
                       4
                    ]
    
                }, {
                    searchPanes: {
                        show: false
                    },
                    targets: [
                        0,
                        3,
                        5
                    ]
                }
            ],
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel"></i> ',
                    title: 'Reporte Saldo Consolidado',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success',
                    autoFilter: true
                },
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
                    100, 200, 300, -1
                ],
                [
                    100, 200, 300, "Todos"
                ]
            ],
            order: [[ 1, "asc" ]],
            columns: [
                {    // 0
                    title: "RIF",
                    data: "RIF"
                }, { // 1
                    title: "Nombre Cliente",
                    data: "NOMBRE_CLIENTE"
                }, { // 2
                    title: "Tipo Deuda",
                    data: "TIPO"
                }, { // 3
                    title: "Vendedor",
                    data: "VENDEDOR"
                }, { // 4
                    title: "Nombre Vendedor",
                    data: "NOMBRE_VENDEDOR"
                }, { // 5
                    title: "Saldo BS",
                    data: "SALDO_BS",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2, '$' )
                }, { // 6
                    title: "Saldo US",
                    data: "SALDO_US",
                    className: 'dt-body-right',
                    render: DataTable.render.number( ',', '.', 2, '$' )
                }
            ]
        });
    
    }


