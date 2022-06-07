
//Variables globales
filter = '';

var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");
var cUsuario = sessionStorage.getItem("Usuario");


async function getCertificaEstado(pEmpresa, pEstado, pCodigoCta){


    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    var rCertificaEstado = await fetch(`${WebApiServer}api/Certificados/GetCertificaEstado?Empresa=${pEmpresa}&Estado=${pEstado}&CodigoCta=${pCodigoCta}`, requestOptions)
                            .then(response => response.json());

    cCertificadosEstado = rCertificaEstado;
    console.log(cCertificadosEstado);
    return rCertificaEstado;
}

async function loadTableConciliados(datos) {
 	
    $("#jsGridCertificados").jsGrid({
       
       height: "auto",
       width: "100%",
       autoload: true,
       paging: false,
       responsive: true,
       selecting: true,
       controller: {
           loadData: function() {
               return datos;
           }
       },	
       fields: [ 
        { name: "FECHA",          type: "date",   format: 'dd/MM/yyyy', title: "Fecha Transacción",   width: "5%",  headercss: "text-center text-primary", align: "center" },
        { name: "NROCOMPROB",     type: "text",                         title: "Referencia",          width: "5%",  headercss: "text-center text-primary", align: "center" },
        { name: "MONTO",          type: "number", format: "{0:n2}",     title: "Monto",               width: "5%",  headercss: "text-center text-primary", align: "center" },


       ],  

       rowClick: function(args) {

            ModalImagen(args.item);

    },


   }); 

   $("#jsGridConciliado").jsGrid("sort", { field: "FECHA", order: "desc" });
 
}

function ModalImagen(pCertificado){

    link_imagen = pCertificado.URLCOMPROB.replace("C:\\inetpub\\wwwroot\\", "http://soliplus.consolidez.com/" );
    link_imagen = link_imagen.replaceAll(/\\/g, '/');
    $("#imagen-certificado").attr('src', link_imagen);

    $("#md-imagen").modal("show");



}

$("#bt-generar").click(async function () {

    await getCertificaEstado(cEmpresa, '4', cBanco);

    await loadTableConciliados(cCertificadosEstado);

});

$( "#input-banco" ).change(function() {

    cBanco = $( "#input-banco" ).val();

  });

//Carga todo el documento
document.addEventListener("DOMContentLoaded", async function() {
    cRif = $("#select-cliente").val();
    await getListaBancos(cEmpresa);


  });