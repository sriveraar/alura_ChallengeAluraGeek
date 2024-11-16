const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para parsear datos del cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para cargar el archivo JSON
app.get('/assets/JSON/libros.json', (req, res) => {
    fs.readFile(path.join(__dirname, 'assets', 'JSON', 'libros.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo JSON' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar un nuevo libro
app.post('/add-libro', (req, res) => {
    const newLibro = req.body; // Datos del libro enviados desde el formulario

    // Leer el archivo libros.json
    fs.readFile(path.join(__dirname, 'assets', 'JSON', 'libros.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo JSON' });
        }

        const libros = JSON.parse(data);
        libros.push(newLibro); // Agregar el nuevo libro

        // Guardar el archivo actualizado
        fs.writeFile(path.join(__dirname, 'assets', 'JSON', 'libros.json'), JSON.stringify(libros, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el archivo JSON' });
            }
            res.status(200).json({ message: 'Libro agregado con éxito', libro: newLibro });
        });
    });
});

// Ruta para eliminar un libro por id
app.delete('/eliminar-libro/:id', (req, res) => {
    const libroId = parseInt(req.params.id); // Obtener el id de la URL y convertirlo a número
    console.log('ID recibido para eliminar:', libroId); // Agregamos un log para ver el id recibido

    // Leer el archivo libros.json
    fs.readFile(path.join(__dirname, 'assets', 'JSON', 'libros.json'), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo JSON' });
        }

        const libros = JSON.parse(data);
        // Filtrar el libro por su ID
        const librosFiltrados = libros.filter(libro => libro.id !== libroId);

        console.log('Libros después de eliminar:', librosFiltrados); // Verificamos si el filtro funciona

        // Si no se encuentra el libro, enviamos un error
        if (libros.length === librosFiltrados.length) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        // Guardamos el archivo actualizado después de eliminar el libro
        fs.writeFile(path.join(__dirname, 'assets', 'JSON', 'libros.json'), JSON.stringify(librosFiltrados, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el archivo JSON' });
            }
            res.status(200).json({ message: 'Libro eliminado con éxito' });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
