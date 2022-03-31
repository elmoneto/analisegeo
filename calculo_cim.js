
export function obtemCodigoCIM() {};

/**
 * Módulo para cálculo de código de folhas da Carta Internacional do Mundo ao Milionésimo (CIM).
 *  *
 * @link   https://github.com/elmoneto
 * @author Elmo Neto
 * @since  2022.03.31
 */

const codigo_faixas = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V'];
const dicio_um_500_mil = {NO: "V", NE: 'X', SO: 'Y', SE: "Z"};
const dicio_um_250_mil = {NO: "A", NE: "B", SO: "C", SE: "D"};
const dicio_um_50_mil = {NO: 1, NE: 2, SO: 3, SE: 4};
const dicio_um_25_mil = {NO: "NO", NE: "NE", SO: "SO", SE: "SE"};

var pontos_limite = null;
var cod_carta = '';

function obtemCodigoCIM(latitude,longitude){
    let lat = latitude;
    let lon = longitude;
    pontos_limite = carta_milionesimo(lat, lon);
    pontos_limite = amplia_4reg(lat, lon, pontos_limite, dicio_um_500_mil);
    pontos_limite = amplia_4reg(lat, lon, pontos_limite, dicio_um_250_mil);
    pontos_limite = amplia_6reg(lat, lon, pontos_limite);
    pontos_limite = amplia_4reg(lat, lon, pontos_limite, dicio_um_50_mil);
    pontos_limite = amplia_4reg(lat, lon, pontos_limite, dicio_um_25_mil);
    return cod_carta.slice(0,-1);
}

function carta_milionesimo(arglat, arglon){
    if (arglat > 0){ cod_carta = cod_carta + 'N'; }
    else{cod_carta = cod_carta + 'S';}
   
    let cod_faixa = Math.floor(Math.abs(arglat) / 4);
    cod_carta = cod_carta + codigo_faixas[cod_faixa];

    let cod_fuso = 0;
    console.log(arglon)
    cod_fuso = Math.ceil((180 + arglon) / 6);
    if (arglon % 6 == 0){
        cod_fuso = cod_fuso + 1;
    }
    cod_carta = cod_carta + '.' + cod_fuso + '-';

    let limite_inf_faixa = ((Math.floor(arglat / 4)) * 4) * 1.0;
    let limite_sup_faixa = limite_inf_faixa + 4;
    let limite_esq_fuso = ((Math.floor(arglon / 6)) * 6) * 1.0;
    let limite_dir_fuso = limite_esq_fuso + 6;

    let ponto_a = {x: limite_esq_fuso, y: limite_inf_faixa};
    let ponto_b = {x: limite_esq_fuso, y: limite_sup_faixa};
    let ponto_c = {x: limite_dir_fuso, y: limite_sup_faixa};
    let ponto_d = {x: limite_dir_fuso, y: limite_inf_faixa};

    let novos_pontos = {
        pto_inf_esq: ponto_a,
        pto_sup_esq: ponto_b,
        pto_sup_dir: ponto_c,
        pto_inf_dir: ponto_d
    }
    return novos_pontos;
}

function amplia(linhax1, linhay1, linhax2, linhay2){
    let ponto_a = {x: linhax1, y: linhay1};
    let ponto_b = {x: linhax1, y: linhay2};
    let ponto_c = {x: linhax2, y: linhay2};
    let ponto_d = {x: linhax2, y: linhay1};
    
    let novos_pontos = {
        pto_inf_esq: ponto_a,
        pto_sup_esq: ponto_b,
        pto_sup_dir: ponto_c,
        pto_inf_dir: ponto_d
    }
    return novos_pontos;
}

function amplia_4reg(arglat, arglon, pontos, codigos){
    ponto_medio_x = (pontos.pto_inf_esq.x + pontos.pto_inf_dir.x) / 2;
    ponto_medio_y = (pontos.pto_inf_esq.y + pontos.pto_sup_esq.y) / 2;
    let novos_pontos = null;
    if ((arglat >= ponto_medio_y) & (arglon < ponto_medio_x)){
        cod_carta = cod_carta + codigos.NO + '-';
        novos_pontos = amplia(pontos.pto_inf_esq.x, ponto_medio_y,ponto_medio_x, pontos.pto_sup_esq.y);
        return novos_pontos;
    }
    if ((arglat >= ponto_medio_y) & (arglon >= ponto_medio_x)){
        cod_carta = cod_carta + codigos.NE + '-';
        novos_pontos = amplia(ponto_medio_x, ponto_medio_y, pontos.pto_sup_dir.x, pontos.pto_sup_dir.y);
        return novos_pontos;
    }

    if ((arglat < ponto_medio_y) & (arglon < ponto_medio_x)){
        cod_carta = cod_carta + codigos.SO + '-';
        novos_pontos = amplia(pontos.pto_inf_esq.x, pontos.pto_inf_esq.y, ponto_medio_x, ponto_medio_y);
        return novos_pontos;
    }
    if ((arglat < ponto_medio_y) & (arglon >= ponto_medio_x)){
        cod_carta = cod_carta + codigos.SE + '-';
        novos_pontos = amplia(ponto_medio_x, pontos.pto_inf_esq.y, pontos.pto_inf_dir.x, ponto_medio_y);
        return novos_pontos;
    }
}

function amplia_6reg(arglat, arglon, pontos){
    temp = (pontos.pto_inf_dir.x - pontos.pto_inf_esq.x) / 3;
    pmx1 = pontos.pto_inf_esq.x + temp;
    pmx2 = pmx1 + temp;
    let novos_pontos = null;
    pmy = (pontos.pto_inf_esq.y + pontos.pto_sup_esq.y) / 2;
    if ((arglat >= pmy) & (arglon < pmx1)){
        cod_carta = cod_carta + "I" + '-';
        novos_pontos = amplia(pontos.pto_sup_esq.x, pmy, pmx1, pontos.pto_sup_esq.y);
        return novos_pontos;
    }
    if ((arglat >= pmy) & (arglon < pmx2)){
        cod_carta = cod_carta + "II" + '-';
        novos_pontos = amplia(pmx1, pmy, pmx2, pontos.pto_sup_esq.y);
        return novos_pontos;
    }
    if ((arglat >= pmy) & (arglon >= pmx2)){
        cod_carta = cod_carta + "III" + '-';
        novos_pontos = amplia(pmx2, pmy, pontos.pto_sup_dir.x, pontos.pto_sup_dir.y);
        return novos_pontos;
    }
    if ((arglat < pmy) & (arglon < pmx1)){
        cod_carta = cod_carta + "IV" + '-';
        novos_pontos = amplia(pontos.pto_inf_esq.x, pontos.pto_inf_esq.y, pmx1, pmy);
        return novos_pontos;
    }
    if ((arglat < pmy) & (arglon < pmx2)){
        cod_carta = cod_carta + "V" + '-';
        novos_pontos = amplia(pmx1, pontos.pto_inf_esq.y, pmx2, pmy)
        return novos_pontos;
    }
    if ((arglat < pmy) & (arglon >= pmx2)){
        cod_carta = cod_carta + "VI" + '-';
        novos_pontos = amplia(pmx2, pontos.pto_inf_esq.y, pontos.pto_inf_dir.x, pmy);
        return novos_pontos;
    }
}
