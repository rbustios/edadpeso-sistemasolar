// Simuladora de edad y peso terrestre en el resto de planetas del sistema solar
// Desarrollado por Roberto Bustíos
// v0.2 alpha

/*- Declaración e inicialización de variables y constantes -*/

const planetas = [
    { nombre: "Mercurio", orbita: "0.24", gravedad: "3.7" },
    { nombre: "Venus", orbita: "0.62", gravedad: "8.87" },
    { nombre: "Marte", orbita: "1.88", gravedad: "3.7" },
    { nombre: "Júpiter", orbita: "11.86", gravedad: "24.79" },
    { nombre: "Saturno", orbita: "29.46", gravedad: "10.44" },
    { nombre: "Urano", orbita: "84", gravedad: "8.87" },
    { nombre: "Neptuno", orbita: "164.8", gravedad: "11.15" },
    { nombre: "Plutón", orbita: "247", gravedad: "0.62" },
]

const usuario = {
    nombre: prompt("¡Bienvenido! ¿Cuál es tu nombre?"),
    edad: parseInt(prompt("Ingresa tu edad")),
    peso: parseFloat(prompt("Ingresa tu peso aproximado")),
    planeta: prompt("Escribe el planeta:\n-> Mercurio\n-> Venus\n-> Marte\n-> Júpiter\n-> Saturno\n-> Urano\n-> Neptuno\n-> Plutón")
};

/*- Funciones -*/

function calcularEdad(edad, orbita) {
    return (edad / orbita).toFixed(2);
}

function calcularPeso(peso, gravedad) {
    return ((peso * gravedad) / 9.81).toFixed(2);
}

function main(usuario) {

    const planetaElegido = planetas.find(p => p.nombre.toLowerCase() === usuario.planeta.toLowerCase());

    /*- Validaciones -*/

    if (!usuario.nombre || !isNaN(usuario.nombre)) {
        console.error("¡Nombre inválido!");
        return;
    }
    if (!usuario.edad || isNaN(usuario.edad)) {
        console.error("¡La edad ingresada no es válida!");
        return;
    }
    if (!usuario.peso || isNaN(usuario.peso)) {
        console.error("¡El peso ingresado no es válido!");
        return;
    }
    if (!planetaElegido) {
        console.error("¡El planeta no es uno de la lista!");
        return;
    }

    // Inicializa las variables que contendrán los valores de las funciones calcularEdad y calcularPeso

    const edadPlaneta = calcularEdad(usuario.edad, planetaElegido.orbita);
    const pesoPlaneta = calcularPeso(usuario.peso, planetaElegido.gravedad);

    /*- Si todo sale bien, muestra lo siguiente: -*/

    console.log(usuario.nombre + ",");
    console.log("--------------");
    console.log("Tu edad es: " + usuario.edad + " en años terrestres");
    console.log("Si vivieras en " + usuario.planeta + ", tu edad sería: " + edadPlaneta + " años");
    console.log("--------------");
    console.log("Tu peso es: " + usuario.peso + " en la Tierra");
    console.log("Si vivieras en " + usuario.planeta + ", tu peso sería: " + pesoPlaneta + " kilos");
    console.log("--------------");
}

/*- Ejecución principal de la función main () -*/

main(usuario);