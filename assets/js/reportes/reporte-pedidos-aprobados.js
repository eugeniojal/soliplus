// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var cCliente;
    

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

async function getPedidosReporte(pEmpresa, pCliente){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetReportePedidos = await fetch(WebApiServer + "api/Cartera/GetPedidosReporte?Empresa=" + pEmpresa +"&Rif=" + pCliente, requestOptions)
        .then(response => response.json());

        console.log(rGetReportePedidos);
        await loadTable(rGetReportePedidos);

}

async function getPedidoPDF(pEmpresa, pOrigen, pTipoDcto, pNroDcto){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        var rGetPedidoPDF = await fetch(WebApiServer + "api/Common/GetPedidoPDF?Empresa=" + pEmpresa +"&Origen=" + pOrigen+ "&TipoDcto=" + pTipoDcto+ "&NroDcto=" + pNroDcto, requestOptions)
        .then(response => response.json());

        return rGetPedidoPDF;

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
                }, { // 4
                    title: "Valor US",
                    data: "VALORUS"
                }, { // 5
                    title: "Valor BS",
                    data: "VALORBS"
                }, { // 6
                    title: "Tasa Cambio",
                    data: "TCAMBIO"
                }, {
                    "targets": -1,
                    "data": null,
                    "defaultContent":'<button id="btn-pdf" style="padding: 5 3" class="btn btn-danger fas fa-file-pdf" type="button"></button> <button id="btn-email" style="padding: 5 3" class="btn btn-primary fas fa-paper-plane" type="button"></button>'

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

    await getPedidosReporte(cEmpresa, cCliente);

    $('#reportTable tbody').on('click', '.fa-file-pdf', async function (e) {

        nro_dcto =  $(this).parents('tr').find("td:eq(0)").text();
        console.log(nro_dcto);

        var path_pedido = await getPedidoPDF(cEmpresa, "FAC", "PD", nro_dcto);

        e.preventDefault();  //stop the browser from following
        window.open("http://soliplus.consolidez.com/"+path_pedido,'_blank');

    
    });

});







