const carrito = document.getElementById('carrito');
const productos = document.getElementById('lista-1');
const listaProductos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const totalCarrito = document.getElementById('total-carrito');

cargarEventListeners();

function cargarEventListeners() {
    productos.addEventListener('click', comprarProducto);
    carrito.addEventListener('click', eliminarProducto);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    listaProductos.addEventListener('input', function(e) {
        if (e.target.classList.contains('cantidad')) {
            actualizarTotal();
        }
    });
}
function comprarProducto(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const producto = e.target.parentElement.parentElement;
        leerDatosProducto(producto);
    }
}

function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.precio').textContent,
        id: producto.querySelector('a').getAttribute('data-id')
    };
    insertarCarrito(infoProducto);
}

function insertarCarrito(producto) {
     const precio = parseFloat(
        producto.precio.replace(',', '.')
    ) || 0;

    // Si el producto ya está en el carrito, aumenta su cantidad
    const filas = listaProductos.querySelectorAll('tr');

    for (const fila of filas) {
        if (fila.dataset.id === producto.id) {
            const cantidad = fila.querySelector('.cantidad');
            cantidad.value = parseInt(cantidad.value) + 1;
            actualizarTotal();
            return;
        }
    }

    const row = document.createElement('tr');
    row.dataset.id = producto.id;
    row.dataset.precio = precio;

    row.innerHTML = `
        <td><img src="${producto.imagen}" width="70"></td>
        <td>${producto.titulo}</td>
        <td>Bs ${precio.toFixed(2)}</td>
        <td>
            <input type="number" class="cantidad"
                   value="1" min="1" step="1" style="width:55px">
        </td>
        <td class="subtotal">Bs ${precio.toFixed(2)}</td>
        <td>
            <a href="#" class="borrar-producto"
               data-id="${producto.id}">X</a>
        </td>
    `;

    listaProductos.appendChild(row);
    actualizarTotal();
}

function actualizarTotal() {
    let total = 0;

    const filas = listaProductos.querySelectorAll('tr');

    filas.forEach(function(fila) {
        const precio = parseFloat(fila.dataset.precio) || 0;
        const campoCantidad = fila.querySelector('.cantidad');

        let cantidad = parseInt(campoCantidad.value) || 1;

        if (cantidad < 1) {
            cantidad = 1;
            campoCantidad.value = 1;
        }

        const subtotal = precio * cantidad;

        fila.querySelector('.subtotal').textContent =
            `Bs ${subtotal.toFixed(2)}`;

        total += subtotal;
    });

    totalCarrito.textContent = `Bs ${total.toFixed(2)}`;
}

function eliminarProducto(e) {
    e.preventDefault();
     if (e.target.classList.contains('borrar-producto')) {
        e.target.closest('tr').remove();
        actualizarTotal();
    }
}

function vaciarCarrito() {
   listaProductos.innerHTML = '';
    actualizarTotal();
    return false;
}