// Simuladora de edad y peso terrestre en el resto de planetas del sistema solar
// Desarrollado por Roberto Bustíos
// v0.3 alpha

/*- DECLARACIÓN DE CONSTANTES Y VARIABLES -*/

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

const paginas = document.querySelectorAll('.page');
let paginaActual = 0;

const botonIzquierda = document.querySelector('.page-left');
const botonDerecha = document.querySelector('.page-right');
const calcular = document.getElementById('calcular');
const calcQuiz = document.getElementById('calc-quiz');

/*- FUNCIONES -*/

function mostrarPagina(indice) {
    paginas.forEach((paginas, i) => {
        paginas.classList.toggle('active', i === indice);
    });
    botonIzquierda.disabled = (indice === 0);
    botonDerecha.disabled = (indice === paginas.length - 1);
}

function calcularEdad(edad, orbita) {
    return (edad / orbita).toFixed(2);
}

function calcularPeso(peso, gravedad) {
    return ((peso * gravedad) / 9.81).toFixed(2);
}

function main() {
    const usuario = {
        nombre: document.getElementById("name").value.trim(),
        edad: parseInt(document.getElementById("age").value),
        peso: parseFloat(document.getElementById("weight").value),
        planeta: document.querySelector('input[name="planet"]:checked')?.value
    };

    const mensajeError = document.getElementById("errormessage");
    const mensajeExito = document.getElementById("successmessage");
    mensajeError.textContent = "";
    mensajeExito.textContent = "";

    if (usuario.nombre === "" || usuario.edad === "" || usuario.peso === "" || usuario.planeta === undefined) {
        mensajeError.textContent = "¡Faltan llenar campos!";
        return;
    }
    if (!usuario.nombre || !isNaN(usuario.nombre)) {
        mensajeError.textContent = "¡Nombre inválido!";
        return;
    }
    if (!usuario.edad || isNaN(usuario.edad)) {
        mensajeError.textContent = "¡La edad ingresada no es válida!";
        return;
    }
    if (!usuario.peso || isNaN(usuario.peso)) {
        mensajeError.textContent = "¡El peso ingresado no es válido!";
        return;
    }

    const planetaElegido = planetas.find(p => p.nombre.toLowerCase() === usuario.planeta.toLowerCase());

    if (!planetaElegido) {
        mensajeError.textContent = "¡El planeta no es uno de la lista!";
        return;
    }

    const edadPlaneta = calcularEdad(usuario.edad, planetaElegido.orbita);
    const pesoPlaneta = calcularPeso(usuario.peso, planetaElegido.gravedad);

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
        calcQuiz.style.display = 'block';
        paginaActual = 0; // Reiniciar a la primera página
        mostrarPagina(paginaActual);
        focusNextInput();
    });
    mensajeExito.appendChild(botonRegresar);

    const resultadoNuevo = {
        id: Date.now(), // Se usa un timestamp como identificador único
        nombre: usuario.nombre,
        planeta: usuario.planeta,
        edad: usuario.edad,
        edadplaneta: edadPlaneta,
        peso: usuario.peso,
        pesoplaneta: pesoPlaneta
    };

    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    resultados.push(resultadoNuevo);
    localStorage.setItem("resultados", JSON.stringify(resultados));

    calcQuiz.style.display = "none";
    mensajeExito.style.display = "flex";

    mostrarResultados();

    usuario.nombre.innerHTML == "";
    usuario.edad.textContent = "";
}

function mostrarResultados() {
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    const tbody = document.querySelector('.table-results tbody');

    tbody.innerHTML = resultados.length ? '' : `<tr id="res-no-results">
                <td colspan="8">No hay resultados calculados</td>
            </tr>`;

    resultados.forEach(resultado => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${resultado.id}</td>
            <td>${resultado.nombre}</td>
            <td>${resultado.planeta}</td>
            <td>${resultado.edad} años</td>
            <td>${resultado.edadplaneta} años</td>
            <td>${resultado.peso} kilos</td>
            <td>${resultado.pesoplaneta} kilos</td>
            <td><button class="btn btn-light rounded-0 borrar-resultado" data-id="${resultado.id}">&#10006;</button></td>
        `;

        tbody.appendChild(tr);
    });

    document.querySelectorAll('.borrar-resultado').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            resultados = resultados.filter(res => res.id != id);
            localStorage.setItem('resultados', JSON.stringify(resultados));
            mostrarResultados();
        });
    });
}

function focusNextInput() {
    const currentInput = paginas[paginaActual].querySelector('input');
    if (currentInput) {
        currentInput.focus();
    }
}

/*- INSTRUCCIONES -*/

document.addEventListener("DOMContentLoaded", function (event) {
    mostrarResultados();
});

botonDerecha.addEventListener('click', () => {
    if (paginaActual < paginas.length - 1) {
        paginaActual++;
        mostrarPagina(paginaActual);
        focusNextInput();
    }
});

botonIzquierda.addEventListener('click', () => {
    if (paginaActual > 0) {
        paginaActual--;
        mostrarPagina(paginaActual);
        focusNextInput();
    }
});

mostrarPagina(paginaActual);

paginas.forEach((pagina, index) => {
    const inputs = pagina.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                if (index < paginas.length - 1) {
                    paginaActual++;
                    mostrarPagina(paginaActual);
                    focusNextInput();
                } else if (index === paginas.length - 1) {
                    main();
                }
            }
        });
    });
});

calcular.addEventListener('click', main);

document.getElementById("borrar-ls").addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});