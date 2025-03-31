const table = document.querySelector('#table');
const registrarbtn = document.getElementById('registrar')

const listaCompetidores = async () =>{
    const res = await fetch("http://127.0.0.1:3000/competidores");
    const data = await res.json();

    const tableb = table.querySelector('#tablebody')
    tableb.innerHTML = '';

    data.forEach(comp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="cuadroid">${comp.id}</td>
            <td class="cuadroid">${comp.nombre}</td>
            <td class="cuadroid">${comp.apellido}</td>
            <td class="cuadroid">${comp.deporte}</td>
            <td class="cuadroid">${comp.prueba}</td>
            <td class="cuadroid">${comp.tiempo}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn">Eliminar</button>
            </td>
        `;
        const editBoton = row.querySelector('.edit-btn');
        const botoneliminar = row.querySelector('.delete-btn');

        editBoton.addEventListener('click',()=> putcompetidores(comp.id, comp.nombre, comp.apellido, comp.deporte, comp.prueba, comp.tiempo));
        botoneliminar.addEventListener('click', () => eliminarCompetidor(comp.id));

        tableb.appendChild(row);
    });
}
console.log(document.getElementById('miform'));
console.log(registrarbtn);
registrarbtn.addEventListener('click', async (e) =>{
    e.preventDefault();

    const nombre = document.getElementById('formnombre').value;
    const apellido = document.getElementById('formapellido').value;
    const deporte = document.getElementById('formdeporte').value;
    const prueba = document.getElementById('formprueba').value;
    const tiempo = document.getElementById('formtiempo').value;

    console.log(nombre, apellido)

    if(nombre && apellido && deporte && prueba && tiempo){
        console.log(nombre, apellido)
        const response = await fetch('http://localhost:3000/competidores',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nombre, apellido, deporte, prueba, tiempo}),
        });
        const result = await response.json();
        alert(result.message);
        listaCompetidores();
    }else{
        alert("Porfavor Complete todos los campos")
    }

});

const eliminarCompetidor = async (id) =>{
    const res = await fetch(`http://localhost:3000/competidores/${id}`,{
        method: "DELETE",
    });
    const result = await res.json();
    alert(result.message);
    listaCompetidores();
};


const putcompetidores = async (id,nombre,apellido,deporte,prueba,tiempo) =>{
    document.getElementById('formnombre').value = nombre;
    document.getElementById('formapellido').value = apellido;
    document.getElementById('formdeporte').value = deporte;
    document.getElementById('formprueba').value = prueba;
    document.getElementById('formtiempo').value = tiempo;

    const form = document.getElementById('miform');
    form.onsubmit = async (e) =>{
        e.preventDefault();
        const putnombre = document.getElementById('formnombre').value;
        const putapellido = document.getElementById('formapellido').value;
        const putdeporte = document.getElementById('formdeporte').value;
        const putprueba = document.getElementById('formprueba').value;
        const puttiempo = document.getElementById('formtiempo').value;

        const resp  = await fetch(`http://localhost:3000/${id}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nombre: putnombre, apellido: putapellido, deporte: putdeporte, prueba: putprueba, tiempo: puttiempo}),
        });
        const result = await resp.json();
        alert(result.message);
        listaCompetidores();
        form.reset();
        form.onsubmit = arguments.callee;
    }
}

window.onload = listaCompetidores;