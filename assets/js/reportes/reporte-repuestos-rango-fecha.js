// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

async function getReporteRepuestosRangoFecha(pEmpresa, pTipoReporte, pFechaIni, pFechaFin){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        var rGetReporteRepuestosRangoFecha = await fetch(`${WebApiServer}api/Cartera/GetReporteRepuestosRangoFecha?Empresa=${pEmpresa}&Tipo=${pTipoReporte}&FechaIni=${pFechaIni}&FechaFin=${pFechaFin}`, requestOptions)
                                            .then(response => response.json());

        await loadTable(rGetReporteRepuestosRangoFecha);

}

async function setFecha(){

    var cFechaTiempo = new Date();
    cFecha = new Date(cFechaTiempo - cFechaTiempo.getTimezoneOffset() * 60000).toISOString().substr(0, 10);

    return cFecha;

}

async function loadTable(cSource) {

    $('#reportTable').DataTable({
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
                       2
                    ]
    
                }
            ],
            buttons: [ 
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel"></i> ',
                    title: cTitituloReporte,
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success',
                    autoFilter: true
                },
                {
                    extend: 'pdf',
                    messageBottom: null,
                    text: '<i class="fas fa-file-pdf"></i>',
                    title: cTitituloReporte,
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fas fa-copy"></i>',
                    title: cTitituloReporte,
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
                    -1, 100, 200
                ],
                [
                    "Todos", 100, 200
                ]
            ],
            order: [[ 0, "asc" ]],
            columns: [
                {    // 0
                    title: "Nombre",
                    data: "NOMBRE"
                },
                {    // 1
                    title: "Pedido SP",
                    data: "NRODCTO"
                },
                {    // 2
                    title: "Pedido EK",
                    data: "PEDIDO_EK"
                },
                {    // 3
                    title: "Fecha",
                    data: "FECHA",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, 
                {    // 4
                    title: "Tipo Inventario",
                    data: "TIPO_INVENTARIO"
                },
                { // 5
                    title: "Tipo Pago",
                    data: "TIPO_PAGO"
                },
                {    // 6
                    title: "Nro Aprobación",
                    data: "NUMAPROB"
                },
                {    // 7
                    title: "Monto US",
                    data: "MONTO_US",
                    render: DataTable.render.number( ',', '.', 2)

                },
                {    // 8
                    title: "Monto BS",
                    data: "MONTO_BS",
                    render: DataTable.render.number( ',', '.', 2)
                }
                
            ]
        });
    
}


$("#bt-generar").click(async function () {

    cFechaIni = $("#input-fecha-inicial").val();
    cFechaFin = $("#input-fecha-final").val();
    cTitituloReporte =  `Reporte de Pedidos de Repuestos entre ${cFechaIni} y ${cFechaFin}`;

    var cTipoReporte = $('#input-tipo-reporte').val();

    await getReporteRepuestosRangoFecha(cEmpresa, cTipoReporte, cFechaIni, cFechaFin);

});


$("#bt-home").click(async function () {

    userHome(cInterno);

});









