
//Variables globales
filter = '';

var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");

var $listaClientes = $("#select-cliente");
window.alert = async function() {};

myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";


//GET Inventario
async function getCertificaRif(pEmpresa, pRif){

    var rCertificaRif;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Certificados/GetCertificaRif?Empresa="+pEmpresa+"&Rif="+ pRif, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rCertificaRif = result;
    })
    .catch(error => console.log('error', error));

    return rCertificaRif;
}

async function getListaClientes(pEmpresa, pUsuario, pFiltrado){
    
    var rClientes;

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
  
    await fetch(WebApiServer + "api/Common/GetListaClientes?Empresa=" + pEmpresa +"&Usuario=" + pUsuario + "&Filtrado=" + pFiltrado, requestOptions)       
        .then(response => response.json())
        .then(result => {
            console.log(result);
            rClientes = result;
        })
        .catch(error => console.log('error', error));

    return rClientes;
}

async function setClientes(){

    elemento = await getListaClientes(cEmpresa);

    $listaClientes.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaClientes.append($('<option />', {
            value: (element.RIF),
            text: (element.NOMBRE + " - " + element.RIF)
        }));
    });

    $listaClientes.val(undefined).select2();

}

//POST Tipo de Inventario
async function postCertifica(pEmpresa, pCodigo, pNombre){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch(WebApiServer+ "api/Maestros/PostCertifica?Empresa="+pEmpresa+"&Codigo="+pCodigo+"&Nombre="+pNombre, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//DELETE Tipo de Inventario
async function deleteCertifica(pEmpresa, pCodigo){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    await fetch(WebApiServer + "api/Certificados/deleteCertifica?Empresa="+pEmpresa+"&ID="+pCodigo, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            respuesta2 = result;
        })
        .catch(error => console.log('error', error));

    return respuesta2;
}

//DELETE Tipo Imagen
async function deleteImagen(pEmpresa, ubicacion){

    pUbicacion = ubicacion.replace(/\\\\/g, '\\');
    console.log(pUbicacion);

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };
      
    await fetch("http://soliplus.consolidez.com/ApiRestSoliPlus/api/Delete/DeleteFile?Empresa="+pEmpresa+"&Ubicacion="+pUbicacion, requestOptions)
        .then(response => response.json())
        .then(result => {
            respuesta = result;
            console.log(result);
        })
        .catch(error => console.log('error', error));
    
    return respuesta;
}

//UPDATE Tipo de Inventario
async function updateCertifica(pEmpresa, pCodigo, pNombre){
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch(WebApiServer + "api/Maestros/PutCertifica?Empresa="+pEmpresa+"&Codigo="+pCodigo+"&Nombre="+ pNombre, requestOptions)
        .then(response => response.text())
        .then(result =>{
            console.log(result);
            if(result !== '"1"'){
                alert("No se pudo cambiar el elemento");
            }
        })
        .catch(error => console.log('error', error));
}

$( "#select-cliente" ).change(async function() {
    cRif = $("#select-cliente").val();
    var cCertifica = await getCertificaRif(cEmpresa, cRif);


    cCertifica.forEach(element => {
        console.log(element);
        link_imagen = element.URLCOMPROB.replace("C:\\inetpub\\wwwroot\\", "http://soliplus.consolidez.com/" );
        link_imagen = link_imagen.replaceAll(/\\/g, '/');
        console.log(link_imagen);
        cCertifica[0].LINK = link_imagen;
    });

    database = cCertifica;
    await setTabla();         
});

//Modal de Errores
async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
}

async function verificarInsertar(pRepetido, pInsertingItem){
    //Si no hay un elemento repetido guardamos en la base de datos
    if(pRepetido){
        if(pInsertingItem.ID != ""){
            if(pInsertingItem.RIF != ""){
                await postCertifica(cEmpresa, pInsertingItem.ID, pInsertingItem.RIF);
            }
            else{
                showModal("Alerta", "Debe colocar un RIF");
            }
        }
        else{
            showModal("Alerta", "Debe colocar un ID");
        }
       
    }
    else{
        showModal("Alerta", "ID repetido, por favor usar otro ID");
    }
}

$("#bt-home").click(async function () {
    userHome(cInterno);
});


//Crear tabla

async function loadTable(tinvalidas) {
 	
    $("#jsGridMovimientoError").jsGrid({
       
       height: "auto",
       width: "100%",
       autoload: true,
       paging: false,
       responsive: true,
       selecting: true,
       controller: {
           loadData: function() {
               return tinvalidas;
           }
       },	
       fields: [ 
           { name: "FECHA",          type: "date",   format: 'dd/MM/yyyy', title: "Fecha Transacción",   width: "5%",  headercss: "text-center text-primary", align: "center" },
           { name: "REFERENCIA",           type: "text",   title: "Referencia",        width: "5%",  headercss: "text-center text-primary", align: "center" },
           { name: "TIPOTRANSACCION",           type: "text",title: "Tipo Operación",    width: "5%",  headercss: "text-center text-primary", align: "center" },
           { name: "MONTO",              type: "number", format: "{0:n2}",  title: "Monto",        width: "5%",  headercss: "text-center text-primary", align: "center" },
       ]

   }); 

   $("#jsGridMovimiento").jsGrid("sort", { field: "FECHA", order: "desc" });
   $("#jsGridMovimientoError").jsGrid("sort", { field: "FECHA", order: "desc" });
   
   document.getElementById('TituloTransaccionInvalida').innerHTML = "Transacciones Inválidas";
   document.getElementById('TituloTransaccionValida').innerHTML = "Transacciones Válidas";
 
}
// async function setTabla() {

// $("#jsGrid").jsGrid({
//     height: "auto",
//     width: "100%",

//     filtering: true,
//     sorting: true,
//     paging: true,

//     pageSize: 15,
//     pageButtonCount: 5,

//     deleteConfirm: "Do you really want to delete the client?",

//     autoload: true,
//     controller: {
        
//         loadData: function(filtro) {
//             //Implementacion de filtro hasta 4 caracteres
//             if((filtro.ID !== "") || (filtro.RIF !== "")){
//                 var filtered_database = database.filter(function(el){
//                     if(filtro.length == 1){
//                         return el.ID.slice(0,1) == filtro.ID.slice(0,1) || el.RIF.toLowerCase().slice(0,1) == filtro.RIF.toLowerCase().slice(0,1);
//                     }
//                     else if(filtro.length == 2){
//                         return el.ID.slice(0,2) == filtro.ID.slice(0,2) || el.RIF.toLowerCase().slice(0,2) == filtro.RIF.toLowerCase().slice(0,2);
//                     }
//                     else if(filtro.length == 3){
//                         return el.ID.slice(0,3) == filtro.ID.slice(0,3) || el.RIF.toLowerCase().slice(0,3) == filtro.RIF.toLowerCase().slice(0,3);
//                     }
//                     else if(filtro.length == 4){
//                         return el.ID.slice(0,4) == filtro.ID.slice(0,4) || el.RIF.toLowerCase().slice(0,4) == filtro.RIF.toLowerCase().slice(0,4);
//                     }
//                     else{
//                         return el.ID == filtro.ID || el.RIF.toLowerCase() == filtro.RIF.toLowerCase();
//                     }
//                 });
//                 return filtered_database;
//             }
//             else{
//                 return database;
//             }
//         },
//         //Borramos
//         deleteItem: async function(deletingItem) {
//             console.log(deletingItem); 
//             cUbicacion = deletingItem.URLCOMPROB;
//             resultado = await deleteImagen(cEmpresa, cUbicacion);
//             console.log(resultado);
//             // resultado_certi = await deleteCertifica(cEmpresa, deletingItem.ID);


//             if(resultado.Response == "1"){
//                 console.log("Funciono!");
//                 resultado_certi = await deleteCertifica(cEmpresa, deletingItem.ID);
//                 console.log(resultado_certi);

//                 if(resultado_certi == 1){
//                     showModal("Mensaje", "Certificado eliminado correctamente");
//                 }
//                 else{
//                     showModal("Error", "Problema al eliminar el certificado");
//                 }
//             }

//             cRif = $("#select-cliente").val();
//             var cCertifica = await getCertificaRif(cEmpresa, cRif);
//             cCertifica.forEach(element => {
//                 console.log(element);
//                 link_imagen = element.URLCOMPROB.replace("C:\\inetpub\\wwwroot\\", "http://soliplus.consolidez.com/" );
//                 link_imagen = link_imagen.replaceAll(/\\/g, '/');
//                 cCertifica[0].LINK = link_imagen;
//             });
//             database = cCertifica;
//             await setTabla();           
//         },
//     },
    
//     fields: [
//         { name: "RIF", type: "text", title: "RIF", width: 100, validate: [
//             "required",
//             { validator: "range", param: [0, 99999] },
//         ] },
//         { name: "ID", type: "text", title: "ID", width: 40, validate: "required"},
//         { name: "ORIGEN", type: "text", title: "Origen",  width: 50, validate: "required"},
//         { name: "NRODCTO", type: "text",  title: "# Dcto", width: 50, validate: "required"},
//         { name: "TIPODCTO", type: "text",  title: "Tipo Dcto", width: 50, validate: "required"},
//         { name: "CODTIPOCERTIF", type: "text",  title: "Tipo Certificado",  width: 50, validate: "required"},
//         { name: "MONTO", type: "text",  title: "Monto", width: 70, validate: "required"},
//         { name: "NROCOMPROB", type: "text",  title: "Comprobante",  width: 100, validate: "required"},
//         { name: "DESCRIPCION", type: "text",  title: "Descripcion", width: 120, validate: "required"},
//         { name: "LINK", 
//             itemTemplate: function(value) {
//                 return $("<a>").attr("href", value).text("Link Imagen");
//             }, type: "text",  title: "Link", width: 80, validate: "required"},
//         { 
//             type: "control",
//             editButton: false,
//         }
//     ]
// });

// }


//Carga la tabla luego de correr todo el documento
document.addEventListener("DOMContentLoaded", async function() {
    cRif = $("#select-cliente").val();
    var cCertifica = await getCertificaRif(cEmpresa, cRif);
    setClientes();
    database = cCertifica;
    setTabla();
  });
