// Simuladora de edad y peso terrestre en el resto de planetas del sistema solar
// Desarrollado por Roberto Bustíos
// v1.0 beta

/*- DECLARACIÓN DE CONSTANTES Y VARIABLES -*/

const paginas = document.querySelectorAll('.page');
let paginaActual = 0;

const botonIzquierda = document.querySelector('.page-left');
const botonDerecha = document.querySelector('.page-right');
const botonCalcular = document.getElementById('calcular');
const buscador = document.getElementById("buscador");

const mensajeError = document.getElementById("errormessage");
const mensajeExito = document.getElementById("successmessage");
const mensajeCargando = document.getElementById("loadingmessage");

const calculadora = document.getElementById('calc-quiz');

const cargarPlanetas = async () => {
    try {
        const respuesta = await fetch("./js/planetas.json");
        if (!respuesta.ok) throw new Error("Error al cargar los datos de los planetas");
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        mostrarMensajeError("Error al cargar los datos de los planetas.");
        return [];
    }
}

const mostrarPagina = (indice) => {
    paginas.forEach((paginas, i) => paginas.classList.toggle('active', i === indice));
    botonIzquierda.disabled = (indice === 0);
    botonDerecha.disabled = (indice === paginas.length - 1);
}

const validarUsuario = ({ nombre, edad, peso }) => {
    if (!nombre || !isNaN(nombre)) return "¡Nombre inválido!";
    if (!edad || isNaN(edad)) return "¡La edad ingresada no es válida!";
    if (!peso || isNaN(peso)) return "¡El peso ingresado no es válido!";
    return "";
}

const mostrarMensajeError = (mensaje) => {
    mensajeError.textContent = mensaje;
    mensajeCargando.style.display = "none";
}

const calcularEdad = (edad, orbita) => (edad / orbita).toFixed(2);
const calcularPeso = (peso, gravedad) => ((peso * gravedad) / 9.81).toFixed(2);

const ejecutarCalculo = async () => {

    const usuario = {
        nombre: document.getElementById("name").value.trim(),
        edad: parseInt(document.getElementById("age").value),
        peso: parseFloat(document.getElementById("weight").value),
        planeta: document.querySelector('input[name="planet"]:checked')?.value
    };

    if (usuario.nombre === "" || usuario.edad === "" || usuario.peso === "" || usuario.planeta === undefined)
        return mostrarMensajeError("¡Faltan llenar campos!");        

    mensajeError.textContent = "";
    mensajeExito.textContent = "";
    mensajeCargando.style.display = "flex";

    const error = validarUsuario(usuario);
    if (error) return mostrarMensajeError(error);

    const planetas = await cargarPlanetas();
    if (planetas.length === 0) return mostrarMensajeError("No se encontraron planetas.");

    const planetaElegido = planetas.find(p => p.nombre.toLowerCase() === usuario.planeta.toLowerCase());
    if (!planetaElegido) return mostrarMensajeError("¡El planeta no es uno de la lista!");

    const edadPlaneta = calcularEdad(usuario.edad, planetaElegido.orbita);
    const pesoPlaneta = calcularPeso(usuario.peso, planetaElegido.gravedad);

    guardarResultado({ ...usuario, edadPlaneta, pesoPlaneta });

    await esperaRetrasada(mostrarResultadoExito(usuario, edadPlaneta, pesoPlaneta));
    await esperaRetrasada(mostrarResultados());

}

const mostrarResultadoExito = async (usuario, edadPlaneta, pesoPlaneta) => {
    mensajeExito.innerHTML = `
        <h3>${usuario.nombre}, en la Tierra:</h3>
        <p>Tu edad es <strong>${usuario.edad} años</strong> y pesas <strong>${usuario.peso} kilos</strong></p><br>
        <h3>En ${usuario.planeta}:</h3>
        <div class="message-container">
            <div class="message message-age">
                <i class="fa-solid fa-calendar-days"></i><br>
                <p>Tu edad sería:<br><strong>${edadPlaneta} años</strong></p>
            </div>
            <div class="message message-weight">
                <i class="fa-solid fa-weight-scale"></i><br>
                <p>Tu peso sería:<br><strong>${pesoPlaneta} kilos</strong></p>
            </div>
        </div>
        `;

    const botonRegresar = document.createElement('button');
    botonRegresar.textContent = 'Regresar';
    botonRegresar.addEventListener('click', () => {
        mensajeExito.style.display = 'none';
        calculadora.style.display = 'block';
        paginaActual = 0;
        mostrarPagina(paginaActual);
        enfocarSiguienteInput();
    });
    mensajeExito.appendChild(botonRegresar);

}

const guardarResultado = (resultado) => {
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    resultados.push({ id: Date.now(), ...resultado });
    localStorage.setItem("resultados", JSON.stringify(resultados));
}

const filtrarResultados = (query) => {
    const resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    const tbody = document.querySelector(".table-results tbody");
    const filtrados = resultados.filter(resultado => resultado.nombre.toLowerCase().includes(query.toLowerCase()));

    tbody.innerHTML = filtrados.length
        ? filtrados.map(resultado => crearFilaResultado(resultado)).join("")
        : `<tr id="res-no-results"><td colspan="8">No se encontraron resultados</td></tr>`;
}

const crearFilaResultado = ({ id, nombre, planeta, edad, edadPlaneta, peso, pesoPlaneta }) =>  `
    <tr>
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${planeta}</td>
        <td>${edad} años</td>
        <td>${edadPlaneta} años</td>
        <td>${peso} kilos</td>
        <td>${pesoPlaneta} kilos</td>
        <td><button class="btn btn-light rounded-0 borrar-resultado" data-id="${id}">&#10006;</button></td>
    </tr>
`;

const mostrarResultados = () => filtrarResultados("");

const borrarResultado = (id) => {
    const resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    localStorage.setItem("resultados", JSON.stringify(resultados.filter(resultado => resultado.id != id)));
    filtrarResultados(buscador.value.trim());
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Registro eliminado",
        icon: "error"
    });
}

const enfocarSiguienteInput = () => paginas[paginaActual].querySelector('input')?.focus();

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const esperaRetrasada = async () => {
    mensajeExito.style.display = "none";
    mensajeCargando.style.display = "flex";
    calculadora.style.display = "none";
    await esperar(1000);
    mensajeCargando.style.display = "none";
    mensajeExito.style.display = "flex";
}

const inicializar = () => {

    mostrarResultados();

    botonDerecha.addEventListener('click', () => {
        if (paginaActual < paginas.length - 1) {
            paginaActual++;
            mostrarPagina(paginaActual);
            enfocarSiguienteInput();
        }
    });
    
    botonIzquierda.addEventListener('click', () => {
        if (paginaActual > 0) {
            paginaActual--;
            mostrarPagina(paginaActual);
            enfocarSiguienteInput();
        }
    });

    botonCalcular.addEventListener('click', ejecutarCalculo);

    document.querySelector('.table-results tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('borrar-resultado')) {
            borrarResultado(e.target.getAttribute("data-id"));
        }
    });

    buscador.addEventListener("input", function () {
        filtrarResultados(this.value.trim());
    });

    paginas.forEach((pagina, index) => {
        pagina.querySelectorAll('input').forEach(input => {
            input.addEventListener("keydown", (event) => {
                if (event.key === 'Enter') {
                    index < paginas.length - 1 ? paginaActual++ : ejecutarCalculo();
                    mostrarPagina(paginaActual);
                    enfocarSiguienteInput();
                }
            })
        });
    });

    document.getElementById("borrar-ls").addEventListener('click', () => {
        if (localStorage.getItem("resultados")) {
            Swal.fire({
                title: "¿Estás seguro de borrar todos los registros?",
                text: "Esta acción no se podrá revertir",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#000000",
                cancelButtonColor: "#FFFFFF",
                confirmButtonText: "Borrar todo"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    Swal.fire({
                        title: "Registros eliminados",
                        confirmButtonColor: "#000000"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            });
        } else {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                title: "No existen datos para borrar",
                icon: "error"
            });
        }
    });

}

/*- INSTRUCCIONES -*/

document.addEventListener("DOMContentLoaded", inicializar);