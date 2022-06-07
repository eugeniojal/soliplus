
//Variables globales
unidad = undefined;
nombre = undefined;
filter = '';

var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");


window.alert = async function() {};

myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";

//GET Inventario
async function getUnidad(pEmpresa){

    var rUnidad;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetUnidad?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rUnidad = result;
    })
    .catch(error => console.log('error', error));

    return rUnidad;
}

//POST Tipo de Inventario
async function postUnidad(pEmpresa, pUnidad, pNombre, pUnidInt, pEnteros){

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch(WebApiServer + "api/Maestros/PostUnidad?Empresa="+pEmpresa+"&Enteros="+pEnteros+"&Nombre="+pNombre+"&Unidad="+pUnidad+"&UnidInt="+ pUnidInt, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//DELETE Tipo de Inventario
async function deleteUnidad(pEmpresa, pUnidad){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    fetch(WebApiServer + "api/Maestros/DeleteUnidad?Empresa="+pEmpresa+"&Unidad="+ pUnidad, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            if(result != '"1"'){
                alert("No se pudo borrar el elemento");
            }
        })
        .catch(error => console.log('error', error));
}

//UPDATE Tipo de Inventario
async function updateUnidad(pEmpresa, pUnidad, pNombre, pUnidInt, pEnteros){
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch(WebApiServer + "api/Maestros/PutUnidad?Empresa="+pEmpresa+"&Enteros="+pEnteros+"&Nombre="+pNombre+"&Unidad="+pUnidad+"&UnidInt="+ pUnidInt, requestOptions)
        .then(response => response.text())
        .then(result =>{
            console.log(result);
            if(result !== '"1"'){
                alert("No se pudo cambiar el elemento");
            }
        })
        .catch(error => console.log('error', error));
}

//Modal de Errores
async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");

    $("#btn-modal").click(function(){

        location.reload();
    });
}

async function verificarInsertar(pRepetido, pInsertingItem){
    //Si no hay un elemento repetido guardamos en la base de datos
    if(pRepetido){
        await postUnidad(cEmpresa, pInsertingItem.UNIDAD, pInsertingItem.NOMBRE, pInsertingItem.UNIDINT, pInsertingItem.ENTEROS);
    }
    else{
        showModal("Alerta", "UNIDAD repetido, por favor usar otro UNIDAD");
    }
}

$("#bt-home").click(async function () {
    userHome(cInterno);
});


//Crear tabla
async function setTabla() {

$("#jsGrid").jsGrid({
    height: "auto",
    width: "100%",

    editing: true,
    filtering: true,
    inserting: true,
    sorting: true,
    paging: true,

    pageSize: 15,
    pageButtonCount: 5,

    deleteConfirm: "Do you really want to delete the client?",

    autoload: true,
    controller: {
        
        loadData: function(filter) {

            return $.grep(database, function (group) { 
                if(filter.NOMBRE !== undefined){
                    return group.NOMBRE.toLowerCase().indexOf(filter.NOMBRE) != -1;
                }
                else{
                    return filter.NOMBRE;
                }
                
            }); 

        },
        insertItem: async function(insertingItem){
            repetido = true;
            console.log(insertingItem);

            var inventario = await getUnidad(cEmpresa);

            inventario.forEach(element => {
                if(element.UNIDAD == insertingItem.UNIDAD){
                    repetido = false;
                }
            });
        
            await verificarInsertar(repetido, insertingItem);

        },
        //Borramos
        deleteItem: async function(deletingItem) {
            console.log(deletingItem); 
            await deleteUnidad(cEmpresa, deletingItem.UNIDAD);

            var cUnidad = await getUnidad(cEmpresa);
            database = cUnidad;
            await setTabla();  
            location.reload();
         
        },
        //Guardamos los cambios
        updateItem: async function(updatingItem) {
            console.log(updatingItem);
            await updateUnidad(cEmpresa, updatingItem.UNIDAD, updatingItem.NOMBRE, updatingItem.UNIDINT, updatingItem.ENTEROS);

            var cUnidad = await getUnidad(cEmpresa);
            database = cUnidad;
            await setTabla(); 
        }
    },
    
    fields: [
        { name: "UNIDAD", type: "text", title: "Unidad", width: 50, validate: [
            "required",
        ], filtering: false },
        { name: "NOMBRE", type: "text", title: "Nombre", width: 150, validate: "required"},
        { name: "UNIDINT", type: "text", title: "Unidad Int", width: 150, filtering: false},
        { name: "ENTEROS", type: "checkbox", title: "Enteros", width: 150, validate: "required", filtering: false},
        { 
            type: "control",
            editButton: false 
        }
    ]
});

}
//Carga la tabla luego de correr todo el documento
document.addEventListener("DOMContentLoaded", async function() {
    filter.ENTEROS = true;

    var cUnidad = await getUnidad(cEmpresa);
    database = cUnidad;
    setTabla();
  });
