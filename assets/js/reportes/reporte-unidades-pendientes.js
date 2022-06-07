// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

async function getUnidadesPendientes(pEmpresa, pFecha){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetUnidadesPendientes = await fetch(WebApiServer + "api/Cartera/GetUnidadesPendientes?Empresa=" + pEmpresa +"&Fecha=" + pFecha, requestOptions)
        .then(response => response.json());

        console.log(rGetUnidadesPendientes);
        await loadTable(rGetUnidadesPendientes);

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
          
            responsive: true,
            dom: '<"top">rtBi<"bottom"lp><"clear">',
            columnDefs: [
                {
    
                    searchPanes: {
                        show: true
                    },
                    targets: [
                       0,
                       1,
                       2,
                    ]
    
                }
            ],
            buttons: [ 
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel"></i> ',
                    title: 'Reporte de Aprobaciones del Día ',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success',
                    autoFilter: true
                },
                {
                    extend: 'pdf',
                    messageBottom: null,
                    text: '<i class="fas fa-file-pdf"></i>',
                    title: 'Reporte de Aprobaciones del Día',
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fas fa-copy"></i>',
                    title: 'Reporte de Aprobaciones del Día',
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
                {    // 0
                    title: "Nombre",
                    data: "NOMBRE"
                },
                {    // 1
                    title: "Modelo",
                    data: "MODELO"
                },
                {    // 2
                    title: "Nro Doc",
                    data: "NRODCTO"
                },
                {    // 3
                    title: "Peido EK",
                    data: "PEDIDO_EK"
                }, 
                {    // 4
                    title: "Pago",
                    data: "TIPO_PAGO"
                },
                { // 5
                    title: "Fecha",
                    data: "FECHA",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                },
                {    // 6
                    title: "Unidades",
                    data: "UNIDADES"
                },
                
            ]
        });
    
}




$(document).ready(async function(){



});

$("#bt-generar").click(async function () {

    cFecha = $("#input-fecha").val();

    await getUnidadesPendientes(cEmpresa, cFecha);

});


$("#bt-home").click(async function () {
    userHome(cInterno);
});









