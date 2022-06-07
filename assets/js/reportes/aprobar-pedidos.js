// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var cCliente;
    


async function getPorAprobar(pEmpresa){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetReportePedidos = await fetch(WebApiServer + "api/Facturas/GetPorAprobar?Empresa=" + pEmpresa, requestOptions)
        .then(response => response.json());

        console.log(rGetReportePedidos);
        await loadTable(rGetReportePedidos);

}

async function PutAprobarPedidos(pEmpresa, pTipoDcto, pNroDcto, pPasswordMo){
    
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    var rPutAprobarPedidos = await fetch(`${WebApiServer}api/Facturas/PutAprobarPedidos?Empresa=${pEmpresa}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}&PasswordMo=${pPasswordMo}`, requestOptions)
                                .then(response => response.json());

    return rPutAprobarPedidos[0].Response;

}


async function CrearArchivoTxt(pEmpresa, pTipoTxt, pFecha, pOrigen, pTipoDcto, pNroDcto){

    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    var rCrearArchivoTxt = await fetch(`${WebApiServer}api/Facturas/GetInfoArchivoTxt?Empresa=${pEmpresa}&TipoTxt=${pTipoTxt}&Fecha=${pFecha}&Origen=${pOrigen}&TipoDcto=${pTipoDcto}&NroDcto=${pNroDcto}`, requestOptions)
                                .then(response => response.text())
                                .then(result => console.log(result))
                                .catch(error => console.log('error', error));
                                
    console.log(rCrearArchivoTxt);

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
                       2
                    ]
    
                }
            ],
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<i class="fas fa-file-excel"></i> ',
                    title: 'Reporte Pedidos por Rango de Fechas',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success',
                    autoFilter: true
                },
                {
                    extend: 'pdf',
                    messageBottom: null,
                    text: '<i class="fas fa-file-pdf"></i>',
                    title: 'Reporte Pedidos por Rango de Fechas',
                    titleAttr: 'Exportar a PDF',
                    className: 'btn btn-danger'
                },
                {
                    extend: 'copyHtml5',
                    text: '<i class="fas fa-copy"></i>',
                    title: 'Reporte Pedidos por Rango de Fechas',
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
                {    // 1
                    title: "Pedido",
                    data: "NRODCTO"
                },
                {    // 2
                    title: "Pedido EK",
                    data: "DCTOREF"
                }, { // 3
                    title: "Fecha",
                    data: "FECHA",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, { // 4
                    title: "Saldo US",
                    data: "SALDOUS"
                }, { // 5
                    title: "Saldo BS",
                    data: "SALDOBS"
                }, { // 6
                    title: "Pago",
                    data: "TIPOPAGO"
                }, { // 6
                    title: "Tipo",
                    data: "TIPO_INVENTARIO"
                }, {
                    "targets": -1,
                    "data": null,
                    "defaultContent":'<button id="btn-pdf" style="padding: 5 3" class="btn btn-danger crear-aprobacion fas fa-file" type="button"></button>'

                },
                
            ]
        });
    
}




$(document).ready(async function(){

    await getPorAprobar(cEmpresa);

    $('#reportTable tbody').on('click', '.crear-aprobacion', async function (e) {

        nro_dcto =  $(this).parents('tr').find("td:eq(0)").text();
        console.log(nro_dcto);
    
        respuesta_aprobacion = await PutAprobarPedidos(cEmpresa, 'PD', nro_dcto, cUsuario);
        console.log(respuesta_aprobacion);
    
    });

    
    
});


$("#bt-home").click(async function () {
    userHome(cInterno);
});







