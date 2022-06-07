
//Variables globales
window.alert = async function() {};
var cEmpresa = sessionStorage.getItem('Empresa');
var cNombre = sessionStorage.getItem('Nombre');
var cInterno = sessionStorage.getItem("Interno");


var $listaUbicacion = $('#select-ubicacion');
var $listaMarca = $('#select-marca');
var $listaIva = $('#select-iva');
var $listarRetencion = $('#select-retencion');
var $listaMedida = $('#select-medida');
var $listaDescripcion = $('#select-descripcion');
var $listaTipo = $('#select-tipo');
var $listaLinea = $('#select-linea');
var $listaSublinea = $('#select-sublinea');
var $listaGrupo = $('#select-grupo');
var $listaClas1 = $('#select-clas1');
var $listaClas2 = $('#select-clas2');

myHeaders = new Headers();
myHeaders.append("Authorization", "Basic U29saVBsdXM6ajVxYTZ1cGx2YTVpc2lrdXAyZWRyMXBpYnI2bTBkcmFjODRw");

WebApiServer = "http://soliplus.consolidez.com/ApiRestSoliPlus/";

//Métodos para Mercancia

//GET Inventario
async function getMercancia(pEmpresa){

    var rMercancia;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer+ "api/Maestros/GetMercancia?Empresa="+ pEmpresa, requestOptions)

    .then(response => response.json())
    .then(result => {
        console.log(result);
        rMercancia = result;
    })
    .catch(error => console.log('error', error));

    return rMercancia;
}

//POST Tipo de Inventario
async function postMercancia( pEmpresa,  pClasifica1,  pClasifica2, pClaveprser, pCodagrupa, pCodbarras, pCodgrupo,  pCodigo, pCodigoinv, pCodlinea,  pCodrete,  pCodsblin,  pCodtariva,  pCodubica,  pDescrip2,  pDescripcio, pDescuento1, pDescuento2, pEsproducto,  pHabilitado,  pImdmarca,  pIva, pNota, pUsuario, pTipoinv,  pUbicacion, pUndconvers, pUndempaque, pMedida){
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    var rPostMercancia = await fetch(WebApiServer + "api/Maestros/PostMercancia?Empresa="+pEmpresa+"&Clasifica1="+pClasifica1+"&Clasifica2="+pClasifica2+"&Claveprser="+pClaveprser+"&Codagrupa="+pCodagrupa+"&Codbarras="+pCodbarras+"&Codgrupo="+pCodgrupo+"&Codigo="+pCodigo+"&Codigoinv="+pCodigoinv+"&Codlinea="+pCodlinea+"&Codrete="+pCodrete+"&Codsblin="+pCodsblin+"&Codtariva="+pCodtariva+"&Codubica="+pCodubica+"&Descrip2="+pDescrip2+"&Descripcio="+pDescripcio+"&Descuento1="+pDescuento1+"&Descuento2="+pDescuento2+"&Esproducto="+pEsproducto+"&Habilitado="+pHabilitado+"&Imdmarca="+pImdmarca+"&Iva="+pIva+"&Nota="+pNota+"&Passwordin="+pUsuario+"&Tipoinv="+pTipoinv+"&Ubicacion="+pUbicacion+"&Undconvers="+pUndconvers+"&Undempaque="+pUndempaque+"&Unidadmed="+ pMedida, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
    
    return rPostMercancia;
}

//DELETE Tipo de Inventario
async function deleteMercancia(pEmpresa, pCodigo){
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
     
    var rDeleteMercancia = fetch(WebApiServer + "api/Maestros/DeleteMercancia?Empresa="+pEmpresa+"&CODIGO="+ pCodigo, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));

    return rDeleteMercancia;
}


//UPDATE Tipo de Inventario
async function updateMercancia(pEmpresa,  pClasifica1,  pClasifica2, pClaveprser, pCodagrupa, pCodbarras, pCodgrupo,  pCodigo, pCodigoinv, pCodlinea,  pCodrete,  pCodsblin,  pCodtariva,  pCodubica,  pDescrip2,  pDescripcio, pDescuento1, pDescuento2, pEsproducto,  pHabilitado,  pImdmarca,  pIva, pNota, pUsuario, pTipoinv,  pUbicacion, pUndconvers, pUndempaque, pMedida){
    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch(WebApiServer + "api/Maestros/PutMercancia?Empresa="+pEmpresa+"&Clasifica1="+pClasifica1+"&Clasifica2="+pClasifica2+"&Claveprser="+pClaveprser+"&Codagrupa="+pCodagrupa+"&Codbarras="+pCodbarras+"&Codgrupo="+pCodgrupo+"&Codigo="+pCodigo+"&Codigoinv="+pCodigoinv+"&Codlinea="+pCodlinea+"&Codrete="+pCodrete+"&Codsblin="+pCodsblin+"&Codtariva="+pCodtariva+"&Codubica="+pCodubica+"&Descrip2="+pDescrip2+"&Descripcio="+pDescripcio+"&Descuento1="+pDescuento1+"&Descuento2="+pDescuento2+"&Esproducto="+pEsproducto+"&Habilitado="+pHabilitado+"&Imdmarca="+pImdmarca+"&Iva="+pIva+"&Nota="+pNota+"&Passwordmo="+pUsuario+"&Tipoinv="+pTipoinv+"&Ubicacion="+pUbicacion+"&Undconvers="+pUndconvers+"&Undempaque="+pUndempaque+"&Unidadmed="+ pMedida, requestOptions)
      .then(response => response.json())
        .then(result =>{
            console.log(result);
            if(result !== '"1"'){
                alert("No se pudo cambiar el elemento");
            }
        })
        .catch(error => console.log('error', error));
}

//Diferentes GETS

async function getMercanciaTabla(pEmpresa){

    var rMercanciaT;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetMercanciaTabla?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rMercanciaT = result;
    })
    .catch(error => console.log('error', error));

    return rMercanciaT;
}

async function getUbicaciones(pEmpresa){

    var rUbicacion;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetUbicaciones?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rUbicacion = result;
    })
    .catch(error => console.log('error', error));

    return rUbicacion;
}

async function getMarca(pEmpresa){

    var rMarca;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetMarca?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rMarca = result;
    })
    .catch(error => console.log('error', error));

    return rMarca;
}

async function getIVA(pEmpresa){

    var rIVA;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetTarifasdeIva?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rIVA = result;
    })
    .catch(error => console.log('error', error));

    return rIVA;
}

async function getRetencion(pEmpresa){

    var rRetencion;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetTopedeRetencion?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rRetencion = result;
    })
    .catch(error => console.log('error', error));

    return rRetencion;
}

async function getMedida(pEmpresa){

    var rMedida;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetUnidad?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rMedida = result;
    })
    .catch(error => console.log('error', error));

    return rMedida;
}

async function getTipo(pEmpresa){

    var rTipo;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetTipoInventario?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rTipo = result;
    })
    .catch(error => console.log('error', error));

    return rTipo;
}

async function getLinea(pEmpresa){

    var rLinea;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetLinea?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rLinea = result;
    })
    .catch(error => console.log('error', error));

    return rLinea;
}

async function getSubLinea(pEmpresa){

    var rSubLinea;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetSubLinea?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rSubLinea = result;
    })
    .catch(error => console.log('error', error));

    return rSubLinea;
}

async function getGrupo(pEmpresa){

    var rGrupo;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetGrupo?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rGrupo = result;
    })
    .catch(error => console.log('error', error));

    return rGrupo;
}

async function getClas1(pEmpresa){

    var rClas1;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetClas1?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rClas1 = result;
    })
    .catch(error => console.log('error', error));

    return rClas1;
}

async function getClas2(pEmpresa){

    var rClas2;

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(WebApiServer + "api/Maestros/GetClas2?Empresa="+ pEmpresa, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        rClas2 = result;
    })
    .catch(error => console.log('error', error));

    return rClas2;
}


//SET LISTAS -------------------------------------------------------------------->

async function setListaCodigos(){

    var $listaCodigos = $('#select-codigo');

    elemento = await getMercanciaTabla(cEmpresa);

    $listaCodigos.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaCodigos.append($('<option />', {
            value: (element.CODIGO),
            text: (element.DESCRIPCIO +" - "+  element.CODIGO)
        }));
    });
    // $listaCodigos.val(undefined).select2();
}

async function setListaUbicaciones(){

    elemento = await getUbicaciones(cEmpresa);

    $listaUbicacion.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaUbicacion.append($('<option />', {
            value: (element.CODUBICA),
            text: (element.NOMBRE)
        }));
    });

    // $listaUbicacion.val(undefined).select2();

    $("#select-ubicacion option[value=1]").attr('selected', 'selected');

}

async function setListaMarca(){

    elemento = await getMarca(cEmpresa);

    $listaMarca.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaMarca.append($('<option />', {
            value: (element.CODMARCA),
            text: (element.NOMBRE)
        }));
    });
    // $listaMarca.val(undefined).select2();
}

async function setListaIVA(){

    elemento = await getIVA(cEmpresa);

    $listaIva.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaIva.append($('<option />', {
            value: (element.PORCIVA + "," + element.CODTARIVA),
            text: (element.DESCRIPCIO + " (" + element.PORCIVA + "%)")
        }));
    });
    // $listaIva.val(undefined).select2();

}

async function setListaRet(){

    elemento = await getRetencion(cEmpresa);

    $listarRetencion.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listarRetencion.append($('<option />', {
            value: (element.CODRETE),
            text: (element.DESCRIPCIO + " (" + element.PRETE + "%)")
        }));
    });
    // $listarRetencion.val(undefined).select2();
}

async function setListaMedida(){

    elemento = await getMedida(cEmpresa);

    $listaMedida.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaMedida.append($('<option />', {
            value: (element.UNIDAD),
            text: (element.NOMBRE)
        }));
    });
    // $listaMedida.val(undefined).select2();

}

async function setListaTipo(){

    elemento = await getTipo(cEmpresa);

    $listaTipo.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaTipo.append($('<option />', {
            value: (element.CODIGO),
            text: (element.NOMBRE)
        }));
    });
    // $listaTipo.val(undefined).select2();
}

async function setLinea(){

    elemento = await getLinea(cEmpresa);

    $listaLinea.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaLinea.append($('<option />', {
            value: (element.CODLINEA),
            text: (element.NOMBRE)
        }));
    });
    // $listaLinea.val(undefined).select2();
}

async function setSubLinea(){

    elemento = await getSubLinea(cEmpresa);

    $listaSublinea.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaSublinea.append($('<option />', {
            value: (element.CODSBLIN),
            text: (element.NOMBRE)
        }));
    });
    // $listaSublinea.val(undefined).select2();
}

async function setGrupo(){

    elemento = await getGrupo(cEmpresa);

    $listaGrupo.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaGrupo.append($('<option />', {
            value: (element.CODGRUPO),
            text: (element.NOMBRE)
        }));
    });
    // $listaGrupo.val(undefined).select2();
}

async function setClas1(){

    elemento = await getClas1(cEmpresa);

    $listaClas1.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaClas1.append($('<option />', {
            value: (element.CODIGO),
            text: (element.NOMBRE)
        }));
    });
    // $listaClas1.val(undefined).select2();
}

async function setClas2(){

    elemento = await getClas2(cEmpresa);

    $listaClas2.html('<optgroup label="Seleccione"></optgroup>');

    elemento.forEach(element => {

        $listaClas2.append($('<option />', {
            value: (element.CODIGO),
            text: (element.NOMBRE)
        }));
    });
    // $listaClas2.val(undefined).select2();
}

//Funcion para poner mismos valores al cambiar un codigo

async function cambiarDatos(elemento){

    $("#select-ubicacion option["+elemento.CODUBICA+"]").attr('selected', 'selected');
    $("#select-marca option["+elemento.CODMARCA+"]").attr('selected', 'selected');
    $("#select-iva option["+elemento.IVA+"]").attr('selected', 'selected');
    $("#select-retencion option["+elemento.CODRETE+"]").attr('selected', 'selected');
    $("#select-medida option["+elemento.UNIDAD+"]").attr('selected', 'selected');
    $("#select-tipo option["+elemento.CODIGO+"]").attr('selected', 'selected');
    $("#select-linea option["+elemento.CODLINEA+"]").attr('selected', 'selected');
    $("#select-sublinea option["+elemento.CODSBLIN+"]").attr('selected', 'selected');
    $("#select-grupo option["+elemento.CODGRUPO+"]").attr('selected', 'selected');
    $("#select-clas1 option["+elemento.CODIGO+"]").attr('selected', 'selected');
    $("#select-clas2 option["+elemento.CODIGO+"]").attr('selected', 'selected');

    if(elemento.ESPRODUCTO == true){
        $("#radio-producto").prop("checked", true);
    }
    else{
        $("#radio-servicio").prop("checked", true);
    }

    if(elemento.HABILITADO == true){
        $("#check-habilitar").prop('checked', true);
    }
    else{
        $("#check-habilitar").prop('checked', false);
    }

    $("#input-nombre").val(elemento.DESCRIPCIO);
    $("#input-descripcion").val(elemento.DESCRIP2);

}

async function escogerCodigo(codigoActual){

    var codElegido;

    productos = await getMercancia(cEmpresa);

    productos.forEach(element => {
        if(element.CODIGO == codigoActual){
            codElegido = element;
        }
    });

    return codElegido;
}

//Modal de Errores
async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");

    $(document).on("click", "#btn-modal", function() {
        location.reload();
    });
}

async function verificarInsertar(pRepetido, pInsertingItem){
    //Si no hay un elemento repetido guardamos en la base de datos
    if(pRepetido){
        await postMercancia(cEmpresa, pInsertingItem.CODIGO, pInsertingItem.NOMBRE, pInsertingItem.UNIDINT, pInsertingItem.ENTEROS);
    }
    else{
        showModal("Alerta", "CODIGO repetido, por favor usar otro CODIGO");
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

    filtering: true,
    sorting: true,
    paging: true,

    autoload: true,
    controller: {
            
        loadData: function(filter) {

            return $.grep(database, function (group) { 
                if(filter.DESCRIPCIO !== undefined){
                    return group.DESCRIPCIO.toLowerCase().indexOf(filter.DESCRIPCIO) != -1;
                }
                else{
                    return filter.DESCRIPCIO;
                }
                
            }); 

        },
    },
    
    fields: [
        { name: "CODIGO", type: "text",  title: "Codigo", width: 80, validate: "required", filtering: false},
        { name: "DESCRIPCIO", type: "text",  title: "Nombre", width: 100, validate: "required"},
        { name: "IMDMARCA", type: "text",  title: "Marca", width: 100, validate: "required", filtering: false},
        { name: "DESCRIP2", type: "text",  title: "Descripcion",width: 100, filtering: false},
        { name: "IVA", type: "text",  title: "IVA", width: 50, validate: "required", filtering: false},
        { name: "CODTARIVA", type: "text",  title: "Tarifa IVA",width: 100, validate: "required", filtering: false},
        { name: "UNIDADMED", type: "text",  title: "Unidad Medida",width: 100, validate: "required", filtering: false},
        { name: "UNDEMPAQUE", type: "text",  title: "Unidad Empaque",width: 120, validate: "required", filtering: false},
        { name: "UNDCONVERS", type: "text", title: "Unidad Comversion", width: 100, validate: "required", filtering: false},
        { 
            type: "control",
            editButton: false,
            deleteButton: false
        }
    ]
});

}

//BOTONES ------------------------------------------------------------------------------->

$(document).on("click", "#bt-nuevo", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-descripcion').disabled = false;
    document.getElementById('select-ubicacion').disabled = false;
    document.getElementById('select-marca').disabled = false;
    document.getElementById('select-iva').disabled = false;
    document.getElementById('select-retencion').disabled = false;
    document.getElementById('select-medida').disabled = false;
    document.getElementById('select-tipo').disabled = false;
    document.getElementById('select-linea').disabled = false;
    document.getElementById('select-sublinea').disabled = false;
    document.getElementById('select-grupo').disabled = false;
    document.getElementById('select-clas1').disabled = false;
    document.getElementById('select-clas2').disabled = false;
    document.getElementById('radio-producto').disabled = false;
    document.getElementById('radio-servicio').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    $("#input-codigo").val(undefined);
    $("#input-nombre").val(undefined);
    $("#input-descripcion").val(undefined);
    $("#select-iva").val(undefined);
    $("#select-retencion").val(undefined);
    $("#select-medida").val(undefined);
    $("#select-tipo").val(undefined);
    $("#select-linea").val(undefined);
    $("#select-sublinea").val(undefined);
    $("#select-grupo").val(undefined);
    $("#select-clas1").val(undefined); 
    $("#select-clas2").val(undefined);
  

    $("#titulo-producto").replaceWith(
        "<h3 id='titulo-producto' style='text-align: center;margin-bottom: 25px;'>Agregar Producto a Mercancia</h3>"
    );
    
    $("#select-codigo").replaceWith(
        "<input id='input-codigo' class='form-control' type='text'/>"
    );

    $("#bt-cambiar").replaceWith(
        "<button id='bt-guardar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Guardar</button>"
    );

    $("#bt-borrar2").replaceWith(
        "<button id='bt-guardar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Guardar</button>"
    );

    $("#input-codigo").focus();

    await setListaUbicaciones();
    await setListaMarca();
    await setListaIVA();
    await setListaRet();
    await setListaMedida();
    await setListaTipo();
    await setLinea();
    await setSubLinea();
    await setGrupo();
    await setClas1();
    await setClas2();

});

$(document).on("click", "#bt-guardar", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-descripcion').disabled = false;
    document.getElementById('select-ubicacion').disabled = false;
    document.getElementById('select-marca').disabled = false;
    document.getElementById('select-iva').disabled = false;
    document.getElementById('select-retencion').disabled = false;
    document.getElementById('select-medida').disabled = false;
    document.getElementById('select-tipo').disabled = false;
    document.getElementById('select-linea').disabled = false;
    document.getElementById('select-sublinea').disabled = false;
    document.getElementById('select-grupo').disabled = false;
    document.getElementById('select-clas1').disabled = false;
    document.getElementById('select-clas2').disabled = false;
    document.getElementById('radio-producto').disabled = false;
    document.getElementById('radio-servicio').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    var guardar = true;

    var cCodigo = $("#input-codigo").val();
    var cUbicacion = $("#select-ubicacion").val();
    var cDescripcion = $("#input-nombre").val();
    var cMarca = $("#select-marca").val();
    var cDescripcion2 = $("#input-descripcion").val();
    var cIva =  $("#select-iva").val();
    var cRetencion =  $("#select-retencion").val();
    var cUnidad = $("#select-medida").val();
    var cRadio =  $("input[type='radio'][name='radio']:checked").val();
    var cTipo = $("#select-tipo").val();
    var cLinea = $("#select-linea").val();
    var cSublinea = $("#select-sublinea").val();
    var cGrupo = $("#select-grupo").val();
    var cClas1 = $("#select-clas1").val(); 
    var cClas2 = $("#select-clas2").val();
    var cHabilitar =  $("input[type='checkbox'][name='habilitar']:checked").val();

    var split = cIva.split(",");
    var cPorIva = split[0];
    var cCodtariva = split[1];

    if(cRadio == "producto"){
        cEsproducto = true;
    }
    else{
        cEsproducto = false;
    }

    if(cHabilitar == undefined){
        cHabilita = false;
    }
    else{
        cHabilita = true;
    }

    //Verficamos que todos los datos ingresados sean correctos
    productos = await getMercancia(cEmpresa);


    productos.forEach(element => {
        if(element.CODIGO == cCodigo){
            guardar = false;
        }
    });

    if((cCodigo.length == 0)){
        showModal("Error de ingreso de datos", "Debe ingresar un codigo");
    }
    else if((cDescripcion.length == 0)){
        showModal("Error de ingreso de datos", "Debe ingresar un nombre asociado a el producto");
    }
    else if((cRadio == undefined)){
        showModal("Error de ingreso de datos", "Debe de escoger si el pedido es un producto o un servicio");
    }
    else if(guardar == false){
        showModal("Error de ingreso de datos", "Ese codigo ya existe");
    }
    else{
        var resp_post = await postMercancia(cEmpresa, cClas1, cClas2, "", "", "", cGrupo,  cCodigo, "", cLinea, cRetencion, cSublinea, cCodtariva, cUbicacion, cDescripcion2, cDescripcion, 0.00, 0.00, cEsproducto, cHabilita, cMarca, cPorIva,"", cNombre, cTipo, cUbicacion, "", "", cUnidad);
        console.log(resp_post);
        if(resp_post == '1'){
            showModal("Mensaje", "Producto creado correctamente");
        }
        else{
            showModal("Error BD", "No se pudo crear el producto");
        }
    }

    await reload("#jsGrid");

});

$(document).on("click", "#bt-modificar", async function() {

    document.getElementById('input-nombre').disabled = false;
    document.getElementById('input-descripcion').disabled = false;
    document.getElementById('select-ubicacion').disabled = false;
    document.getElementById('select-marca').disabled = false;
    document.getElementById('select-iva').disabled = false;
    document.getElementById('select-retencion').disabled = false;
    document.getElementById('select-medida').disabled = false;
    document.getElementById('select-tipo').disabled = false;
    document.getElementById('select-linea').disabled = false;
    document.getElementById('select-sublinea').disabled = false;
    document.getElementById('select-grupo').disabled = false;
    document.getElementById('select-clas1').disabled = false;
    document.getElementById('select-clas2').disabled = false;
    document.getElementById('radio-producto').disabled = false;
    document.getElementById('radio-servicio').disabled = false;
    document.getElementById('check-habilitar').disabled = false;

    $("#titulo-producto").replaceWith(
        "<h3 id='titulo-producto' style='text-align: center;margin-bottom: 25px;'>Modificar Producto en Mercancia</h3>"
    );

    $("#input-codigo").replaceWith(
        "<select id='select-codigo' name='selector'class='form-select'></select>"
    );

    await setListaCodigos();
    await setListaUbicaciones();
    await setListaMarca();
    await setListaIVA();
    await setListaRet();
    await setListaMedida();
    await setListaTipo();
    await setLinea();
    await setSubLinea();
    await setGrupo();
    await setClas1();
    await setClas2();


    $("#bt-guardar").replaceWith(
        "<button id='bt-cambiar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Actualizar</button>"
    );

    $("#bt-borrar2").replaceWith(
        "<button id='bt-cambiar' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-primary);'>Actualizar</button>"
    );

    var selectCodigo = $("#select-codigo").val();

    await cambiarDatos(await escogerCodigo(selectCodigo));

});

$(document).on("change", "#select-codigo", async function() {

    var selectCodigo = $("#select-codigo").val();
    if(selectCodigo.length != 0){
        await cambiarDatos(await escogerCodigo(selectCodigo));
    }
});

$("#select-medida").change(async function() {

    console.log("haciendo algo");

});

$(document).on("click", "#bt-cambiar", async function() {

    console.log("PROBANDO");

    var cCodigo = $("#select-codigo").val();
    var cUbicacion = $("#select-ubicacion").val();
    var cDescripcion = $("#input-nombre").val();
    var cMarca = $("#select-marca").val();
    var cDescripcion2 = $("#input-descripcion").val();
    var cIva =  $("#select-iva").val();
    var cRetencion =  $("#select-retencion").val();
    var cUnidad = $("#select-medida").val();
    var cRadio =  $("input[type='radio'][name='radio']:checked").val();
    var cTipo = $("#select-tipo").val();
    var cLinea = $("#select-linea").val();
    var cSublinea = $("#select-sublinea").val();
    var cGrupo = $("#select-grupo").val();
    var cClas1 = $("#select-clas1").val(); 
    var cClas2 = $("#select-clas2").val();
    var cHabilitar =  $("input[type='checkbox'][name='habilitar']:checked").val();

    var split = cIva.split(",");
    var cPorIva = split[0];
    var cCodtariva = split[1];

    if(cRadio == "producto"){
        cEsproducto = true;
    }
    else{
        cEsproducto = false;
    }

    if(cHabilitar == undefined){
        cHabilita = false;
    }
    else{
        cHabilita = true;
    }

    //Verficamos que todos los datos ingresados sean correctos

    if((cCodigo.length == 0)){
        showModal("Error de ingreso de datos", "Para hacer el cambio, debe ingresar un codigo");
    }
    else if((cDescripcion.length == 0)){
        showModal("Error de ingreso de datos", "Para hacer el cambio, debe ingresar un nombre asociado a el producto");
    }
    else if((cRadio == undefined)){
        showModal("Error de ingreso de datos", "Para hacer el cambio, debe de escoger si el pedido es un producto o un servicio");
    }
    else{
        var resp_update = await updateMercancia(cEmpresa, cClas1, cClas2, "", "", "", cGrupo,  cCodigo, "", cLinea, cRetencion, cSublinea, cCodtariva, cUbicacion, cDescripcion2, cDescripcion, 0.00, 0.00, cEsproducto, cHabilita, cMarca, cPorIva,"", cNombre, cTipo, cUbicacion, "", "", cUnidad);
        if(resp_update == '1'){
            showModal("Mensaje", "Producto actualizado correctamente");
        }
        else{
            showModal("Error BD", "El producto no fue actualizado");
        }
    }


});

$(document).on("click", "#bt-borrar", async function() {

    $("#input-codigo").replaceWith(
        "<select id='select-codigo' name='selector'class='form-select'></select>"
    );

    await setListaCodigos();
    await setListaUbicaciones();
    await setListaMarca();
    await setListaIVA();
    await setListaRet();
    await setListaMedida();
    await setListaTipo();
    await setLinea();
    await setSubLinea();
    await setGrupo();
    await setClas1();
    await setClas2();

    $("#titulo-producto").replaceWith(
        "<h3 id='titulo-producto' style='text-align: center;margin-bottom: 25px;'>Borrar Producto en Mercancia</h3>"
    );

    $("#bt-guardar").replaceWith(
        "<button id='bt-borrar2' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-red);border-color: var(--bs-red);'>Borrar</button>"
    );

    $("#bt-cambiar").replaceWith(
        "<button id='bt-borrar2' class='btn btn-primary' type='button' style='margin-top: 30px;color: var(--bs-white);background: var(--bs-red);border-color: var(--bs-red);'>Borrar</button>"
    );

    document.getElementById('input-nombre').disabled = true;
    document.getElementById('input-descripcion').disabled = true;
    document.getElementById('select-ubicacion').disabled = true;
    document.getElementById('select-marca').disabled = true;
    document.getElementById('select-iva').disabled = true;
    document.getElementById('select-retencion').disabled = true;
    document.getElementById('select-medida').disabled = true;
    document.getElementById('select-tipo').disabled = true;
    document.getElementById('select-linea').disabled = true;
    document.getElementById('select-sublinea').disabled = true;
    document.getElementById('select-grupo').disabled = true;
    document.getElementById('select-clas1').disabled = true;
    document.getElementById('select-clas2').disabled = true;
    document.getElementById('radio-producto').disabled = true;
    document.getElementById('radio-servicio').disabled = true;
    document.getElementById('check-habilitar').disabled = true;

});

$(document).on("click", "#bt-borrar2", async function() {
    
    var cCodigoB = $("#select-codigo").val();

    resp_delete = await deleteMercancia(cEmpresa, cCodigoB);
    if(resp_delete == '1'){
        showModal("Mensaje", "Porducto eliminado correctamente");
    }
    else{
        showModal("Error","No se pudo elimianr el producto");
    }

    await setListaCodigos();
    await setListaUbicaciones();
    await setListaMarca();
    await setListaIVA();
    await setListaRet();
    await setListaMedida();
    await setListaTipo();
    await setLinea();
    await setSubLinea();
    await setGrupo();
    await setClas1();
    await setClas2();
});

document.addEventListener("DOMContentLoaded", async function() {

    $("#input-codigo").focus();

    await setListaUbicaciones();
    await setListaMarca();
    await setListaIVA();
    await setListaRet();
    await setListaMedida();
    await setListaTipo();
    await setLinea();
    await setSubLinea();
    await setGrupo();
    await setClas1();
    await setClas2();

    var cMercancia = await getMercancia(cEmpresa);
    database = cMercancia;
    setTabla();

  });
