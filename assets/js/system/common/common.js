// Variables Generales

var cElemento;


// Funciones comunes en el sistema

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

async function showModal(pTitulo, pMensaje){

    $("#md-alertas .modal-title").html(pTitulo);
    $("#md-alertas .modal-body").html(pMensaje);
    $("#md-alertas").modal("show");
    
}



function formatNumber(pNumero){

    var cNumero = parseFloat(pNumero.toString().replaceAll(",",""));
    
    return cNumero.toLocaleString('en-US',{style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2});
 
}

function userHome(pInterno){

    if(pInterno == 1){
        window.location.href = "/home.html";
    }
    else if(pInterno == 0){
        window.location.href = "/home-clientes.html";
    }
    else{
        window.location.href = "/home-ek.html";
    }
}

function setNumeric(pString){

    var cNumero = 0;
    

    if(jQuery.type(pString) === 'string' && pString.search(",") != -1){

        cNumero = Number.parseFloat(pString.replaceAll(",",""));

    } else if ( jQuery.type(pString) === 'string' && pString.search(",") == -1){

        cNumero = Number.parseFloat(pString);

    } else if (jQuery.type(pString) === 'number') {

        cNumero = pString;

    }

    return cNumero;

}