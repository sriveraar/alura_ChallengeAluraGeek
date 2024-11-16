// Función para cargar el JSON
function cargarLibros() {
    const rutaJSON = "/assets/JSON/libros.json"; // Ruta al archivo JSON (correcta desde la raíz del servidor)

    fetch(rutaJSON)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }
            return response.json();
        })
        .then(libros => {
            generarLibros(libros);
        })
        .catch(error => console.error("Error:", error));
}

// Función para generar las cards de libros
function generarLibros(libros) {
    const librosContainer = document.getElementById('librosContainer');
    librosContainer.innerHTML = ""; // Limpiamos el contenedor

    libros.forEach(libro => {
        const libroHTML = `
            <div class="col-6 col-md-6 col-lg-3 mb-4" id="libro-${libro.id}">
                <div class="producto">
                    <img src="${libro.imagen}" alt="Imagen de ${libro.titulo}" class="img-fluid">
                    <h2>${libro.titulo}</h2>
                    <p><strong>Autor:</strong> ${libro.autor}</p>
                    <p><strong>Precio:</strong> $ ${formatearPrecio(libro.precio)}</p>
                    <button class="btn eliminar_btn" onclick="eliminarLibro(${libro.id}, '${libro.titulo}')">
                        <iconify-icon class="ico_eliminar" icon="mdi:delete" style="font-size: 20px;"></iconify-icon>
                    </button>
                </div>
            </div>
        `;
        librosContainer.insertAdjacentHTML('beforeend', libroHTML);
    });
}

// Función para eliminar un libro con confirmación
function eliminarLibro(id, titulo) {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el libro "${titulo}"?`);

    // Si el usuario confirma la eliminación, se elimina
    if (confirmacion) {
        fetch(`/eliminar-libro/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // Volver a cargar la lista de libros
            cargarLibros(); // Vuelve a cargar todos los libros
        })
        .catch(error => console.error("Error al eliminar el libro:", error));
    } else {
        console.log("Eliminación cancelada");
    }
}

// Función para agregar un nuevo libro
document.getElementById('formProducto').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    const nuevoLibro = {
        id: Date.now(),
        titulo: document.getElementById('tituloInput').value,
        autor: document.getElementById('autorInput').value,
        precio: document.getElementById('precioInput').value,
        imagen: document.getElementById('imagenUrlInput').value
    };

    // Envia los datos del nuevo libro al servidor
    fetch('/add-libro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoLibro)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        cargarLibros(); // Recarga la lista de libros después de agregar el nuevo libro
        document.getElementById('formProducto').reset(); // Limpia los campos del formulario
    })
    .catch(error => console.error('Error al agregar el libro:', error));
});

// Función para formatear el precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-ES').format(precio); // Usa la configuración regional 'es-ES'
}

// Llamamos a la función cargarLibros cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', cargarLibros);