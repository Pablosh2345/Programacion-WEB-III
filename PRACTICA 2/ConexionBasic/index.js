const connection = require('./database');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    console.time('Tiempo total de ejecución');

    // Medir el tiempo de consulta a eventos
    console.time('Tiempo consulta eventos');
    connection.query('SELECT * FROM eventos', (err, results) => {
        if (err) throw err;
        console.table(results);
        console.timeEnd('Tiempo consulta eventos');
    });

    // Medir el tiempo de consulta a asistencia
    console.time('Tiempo consulta asistencia');
    connection.query('SELECT * FROM asistencia', (err, results) => {
        if (err) throw err;
        console.table(results);
        console.timeEnd('Tiempo consulta asistencia');
    });

    // Medir el tiempo de consulta a personas
    console.time('Tiempo consulta personas');
    connection.query('SELECT * FROM personas', (err, results) => {
        if (err) throw err;
        console.table(results);
        console.timeEnd('Tiempo consulta personas');
    });

    rl.question('Desea actualizar (U), eliminar (D) o añadir (A) un registro: ', (ans) => {
        if (ans.toUpperCase() === 'U') {
            rl.question('Ingrese el ID del registro que desea actualizar: ', (id) => {
                rl.question('Ingrese el nuevo nombre: ', (nombre) => {
                    rl.question('Ingrese el nuevo apellido: ', (apellido) => {
                        rl.question('Ingrese el nuevo correo: ', (correo) => {
                            rl.question('Ingrese el nuevo rol: ', (rol) => {
                                console.time('Tiempo actualización');
                                connection.query(
                                    'UPDATE personas SET nombre = ?, apellido = ?, correo = ?, rol = ? WHERE id = ?',
                                    [nombre, apellido, correo, rol, id],
                                    (err, results) => {
                                        if (err) console.error('Error al actualizar el registro:', err);
                                        else console.log('Registro actualizado correctamente.');
    
                                        connection.query('SELECT * FROM personas', (err, results) => {
                                            if (err) console.error('Error al consultar personas:', err);
                                            else console.table(results);
                                            console.timeEnd('Tiempo actualización');
                                            connection.end();
                                            rl.close();
                                        });
                                    }
                                );
                            });
                        });
                    });
                });
            });
        } else if (ans.toUpperCase() === 'D') {
            rl.question('Ingrese el ID de la persona que desea eliminar: ', (id) => {
                console.time('Tiempo eliminación');
                connection.query('DELETE FROM personas WHERE id = ?', [id], (err, results) => {
                    if (err) console.error('Error al eliminar el registro:', err);
                    else console.log('Registro eliminado correctamente.');
    
                    connection.query('SELECT * FROM personas', (err, results) => {
                        if (err) console.error('Error al consultar personas:', err);
                        else console.table(results);
                        console.timeEnd('Tiempo eliminación');
                        connection.end();
                        rl.close();
                    });
                });
            });
        } else if (ans.toUpperCase() === 'A') {
            rl.question('Ingrese el nombre del nuevo registro: ', (nombre) => {
                rl.question('Ingrese el apellido del nuevo registro: ', (apellido) => {
                    rl.question('Ingrese el correo del nuevo registro: ', (correo) => {
                        rl.question('Ingrese el rol del nuevo registro: ', (rol) => {
                            console.time('Tiempo inserción');
                            connection.query(
                                'INSERT INTO personas (nombre, apellido, correo, rol) VALUES (?, ?, ?, ?)',
                                [nombre, apellido, correo, rol],
                                (err, results) => {
                                    if (err) console.error('Error al insertar un registro:', err);
                                    else console.log('Registro agregado correctamente.');
    
                                    connection.query('SELECT * FROM personas', (err, results) => {
                                        if (err) console.error('Error al consultar personas:', err);
                                        else console.table(results);
                                        console.timeEnd('Tiempo inserción');
                                        connection.end();
                                        rl.close();
                                    });
                                }
                            );
                        });
                    });
                });
            });
        } else {
            console.log('Opción no válida.');
            connection.end();
            rl.close();
        }
    });

    console.timeEnd('Tiempo total de ejecución');
}

main();
