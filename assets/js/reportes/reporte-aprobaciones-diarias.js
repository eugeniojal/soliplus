// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

async function getAprobacionesDiarias(pEmpresa, pFecha){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetAprobacionesDiarias = await fetch(WebApiServer + "api/Cartera/GetAprobacionesDiarias?Empresa=" + pEmpresa +"&Fecha=" + pFecha, requestOptions)
        .then(response => response.json());

        console.log('probando');
        console.log(rGetAprobacionesDiarias);
        await loadTable(rGetAprobacionesDiarias);

}

async function setFecha(){

    var cFechaTiempo = new Date();
    cFecha = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);

    return cFecha;

}

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
                       0,
                       1,
                       2,
                       3
                    ]
    
                }
            ],
            buttons: [ 
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel"></i> ',
                    title: 'Extracto de Cartera',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success',
                    autoFilter: true
                },
                {
                    extend: 'pdf',
                    messageBottom: null,
                    text: '<i class="fas fa-file-pdf"></i>',
                    title: 'Extracto de Cartera',
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fas fa-copy"></i>',
                    title: 'Extracto de Cartera',
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
                    -1, 50, 100, 200
                ],
                [
                    "Todos", 50, 100, 200,
                ]
            ],
            order: [[ 1, "asc" ]],
            columns: [
                {    // 1
                    title: "Nombre",
                    data: "NOMBRE"
                },
                {    // 2
                    title: "Pedido EK",
                    data: "DCTOREF"
                },
                {    // 3
                    title: "Aprobacion",
                    data: "NUMAPROB"
                },
                {    // 4
                    title: "Cantidad",
                    data: "CANTIDAD"
                }, 
                {    // 5
                    title: "Tipo Pago",
                    data: "TIPO"
                },
                {    // 6
                    title: "Detalle",
                    data: "DETALLE"
                },
            ]
        });
    
}




$(document).ready(async function(){



});

$("#bt-generar").click(async function () {

    cFecha = $("#input-fecha").val();
    
    await getAprobacionesDiarias(cEmpresa, cFecha);

});


$("#bt-home").click(async function () {
    userHome(cInterno);
});









