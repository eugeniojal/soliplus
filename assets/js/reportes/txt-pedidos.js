// Variables

var cEmpresa = sessionStorage.getItem("Empresa");
var cUsuario = sessionStorage.getItem("Usuario");
var cFiltrado = sessionStorage.getItem("Filtrado");
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $('#input-cliente');
var cCliente;
    


async function getListaTxt(pEmpresa, pFecAprob){

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      var rGetListaTxt = await fetch(WebApiServer + "api/Facturas/GetListaTxt?Empresa="+ pEmpresa +"&FecAprob=" + pFecAprob, requestOptions)
        .then(response => response.json());

        console.log(rGetListaTxt);
        await loadTable(rGetListaTxt);

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
                    className: "dt-head-center"
                },

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
            order: [[ 0, "asc" ], [2, "asc"]],
            columns: [
                   { // 0
                    title: "Cliente",
                    data: "CLIENTE"
                }, { // 1
                    title: "# Aprobación",
                    data: "NUMAPROB"
                }, { // 2
                    title: "Pedido EK",
                    data: "DCTOREF"
                }, { // 3 
                    title: "ID",
                    data: "NRODCTO"
                }, { // 4
                    title: "Fecha Pedido",
                    data: "FECHA",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, { // 5
                    title: "Fecha Tasa",
                    data: "FECTCAMB",
                    render: DataTable.render.moment('YYYY-MM-DDT00:00:00', 'YYYY/MM/DD')
                }, { // 6
                    title: "Pago",
                    data: "TIPOPAGO"
                }, { // 7
                    title: "Tipo",
                    data: "TIPO_INVENTARIO"
                }, { // 8
                    "targets": -1,
                    "title": "Generar Txt",
                    "data": null,
                    "className": 'dt-body-center',
                    "defaultContent":   `<div class="btn-group" role="group">
                                            <a id="bt-crear-txt" class="btn btn-primary role="button">
                                                <svg class="bi bi-file-text-fill" xmlns="http://www.w3.org/2000/svg" width=".8em" height=".8em" fill="currentColor" viewBox="0 0 16 16" style="font-size: 1.2em;">
                                                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z"></path>
                                                </svg>
                                            </a>
                                         </div>`

                    
                    
                    //'<button id="btn-pdf" style="padding: 11px 11px; font-size: 10px;" class="btn btn-primary crear-txt" type="button">.TXT</button>'
                    
                },
                
            ]
        });
    
}



$("#bt-generar").click(async function () {

    cFechaAprob = $("#input-fecha-aprobacion").val();

    console.log(cFechaAprob);

    await getListaTxt(cEmpresa, cFechaAprob);

    
    $('#reportTable tbody').on('click', '#bt-crear-txt', async function (e) {

        nro_dcto =  $(this).parents('tr').find("td:eq(3)").text();
        console.log(nro_dcto);
        cFecha = new Date();

        console.log(cFecha);

    
        respuesta_txt = await CrearArchivoTxt(cEmpresa, 2, '2022/01/01', 'FAC', 'PD', nro_dcto);
        console.log(respuesta_txt);

    });

});


$("#bt-home").click(async function () {
    userHome(cInterno);
});