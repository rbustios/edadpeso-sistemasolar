// Simuladora de edad y peso terrestre en el resto de planetas del sistema solar
// Desarrollado por Roberto Bustíos
// v0.1 alpha

/*- Declaración e inicialización de variables y constantes -*/

let nombreUsuario = "";
let edadUsuario = 0;
let pesoUsuario = 0;
let planeta = "";
let planetaValido = false;

const orbitas = {
    "Mercurio": 0.24,
    "Venus": 0.62,
    "Marte": 1.88,
    "Júpiter": 11.86,
    "Saturno": 29.46,
    "Urano": 84,
    "Neptuno": 164.8,
    "Plutón": 247
}

const peso = {
    "Mercurio": 3.7,
    "Venus": 8.87,
    "Marte": 3.7,
    "Júpiter": 24.79,
    "Saturno": 10.44,
    "Urano": 8.87,
    "Neptuno": 11.15,
    "Plutón": 0.62
}

/*- Solicitud de datos al usuario -*/

nombreUsuario = prompt("¡Bienvenido! ¿Cuál es tu nombre?");
edadUsuario = parseInt(prompt("Ingresa tu edad"));
pesoUsuario = parseFloat(prompt("Ingresa tu peso aproximado"));
planeta = prompt("Escribe el planeta:\n-> Mercurio\n-> Venus\n-> Marte\n-> Júpiter\n-> Saturno\n-> Urano\n-> Neptuno\n-> Plutón");

/*- Funciones -*/

function calcularEdad(edadUsuario, planeta) {
    if (planeta === null) {
        planetaValido = false;
        return;
    } else {
        for (let i in orbitas) { // Valida si el planeta ingresado es alguno de los que están dentro del objeto 'orbitas'
            if (i.toLowerCase() === planeta.toLowerCase()) {
                planetaValido = true;
                return (edadUsuario / orbitas[planeta]).toFixed(2);
            } else {
                planetaValido = false;
            }
        }
    }
    return;
}

function calcularPeso(pesoUsuario, planeta) {
    if (planeta === null) {
        planetaValido = false;
        return;
    } else {
        for (let i in peso) { // Valida si el planeta ingresado es alguno de los que están dentro del objeto 'peso'
            if (i.toLowerCase() === planeta.toLowerCase()) {
                planetaValido = true;
                return ((pesoUsuario * peso[planeta]) / 9.81).toFixed(2);
            } else {
                planetaValido = false;
            }
        }
    }
    return;
}

function main(nombreUsuario, edadUsuario, pesoUsuario, planeta){

    // Inicializa las variables que contendrán los valores de las funciones calcularEdad y calcularPeso
    let edadPlaneta = calcularEdad(edadUsuario, planeta);
    let pesoPlaneta = calcularPeso(pesoUsuario, planeta);

    /*- Validaciones -*/

    if (nombreUsuario === "" || !isNaN(nombreUsuario) || nombreUsuario === null) {
        console.error("¡Nombre inválido!");
        return;
    }
    if (isNaN(edadUsuario) || edadUsuario === "" || edadUsuario === null) {
        console.error("¡La edad ingresada no es válida!");
        return;
    }
    if (edadUsuario <= 0) {
        console.error("¡La edad no puede ser menor o igual a cero!");
        return;
    }
    if (isNaN(pesoUsuario) || pesoUsuario === "" || pesoUsuario === null) {
        console.error("¡El peso ingresado no es válido!");
        return;
    }
    if (pesoUsuario <= 0) {
        console.error("¡El peso no puede ser menor o igual a cero!");
        return;
    }
    if (!planetaValido) {
        console.error("¡El planeta no es uno de la lista!");
        return;
    }

    /*- Si todo sale bien, muestra lo siguiente: -*/

    console.log(nombreUsuario + ",");
    console.log("--------------");
    console.log("Tu edad es: " + edadUsuario + " en años terrestres");
    console.log("Si vivieras en " + planeta + ", tu edad sería: " + edadPlaneta + " años");
    console.log("--------------");
    console.log("Tu peso es: " + pesoUsuario + " en la Tierra");
    console.log("Si vivieras en " + planeta + ", tu peso sería: " + pesoPlaneta + " kilos");
    console.log("--------------");
}

/*- Ejecución principal de la función main () -*/

main(nombreUsuario, edadUsuario, pesoUsuario, planeta);