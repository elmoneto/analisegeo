import obtemCodigoCIM from "./calculo_cim";

function mostraResultado(){
    let latitude = parseFloat(document.getElementById("lat").value);
    let longitude = parseFloat(document.getElementById('lon').value);
    var resultado = document.getElementById('resultado');
    let codigo = obtemCodigoCIM(latitude,longitude);
    resultado.innerHTML = codigo;
}
