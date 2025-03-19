const { main } = require('./database');
const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function mostrar() {
    const connection = await main();
    try {

        console.time('Tiempo consulta personas');
        const [rows] = await connection.execute('SELECT * FROM personas');
        console.table(rows);
        console.timeEnd('Tiempo consulta personas');

        console.time('Tiempo consulta eventos');
        const [event] = await connection.execute('SELECT * FROM eventos');
        console.table(event);
        console.timeEnd('Tiempo consulta eventos');

        console.time('Tiempo consulta asistencia');
        const [row] = await connection.execute('SELECT * FROM asistencia');
        console.table(row);
        console.timeEnd('Tiempo consulta asistencia');

        rl.question('Desea actualizar (U), eliminar (D) o añadir (A) un registro: ', async (ans) => {
            if (ans.toUpperCase() === 'U') {
                rl.question('Ingrese el id del registro que desea actualizar: ', async (id) => {
                    rl.question('Ingrese el nombre del registro que cambiara: ', async (nombre) => {
                        rl.question('Ingrese el apellido del registro que cambiara: ', async (apellido) => {
                            rl.question('Ingrese el correo del registro que cambiara: ', async (correo) => {
                                rl.question('Ingrese el rol del registro que cambiara: ', async (rol) => {
                                    console.time('Tiempo actualización');
                                    try {
                                        await connection.execute('UPDATE personas SET nombre = ?, apellido = ?, correo = ?, rol = ? WHERE id = ?', [nombre, apellido, correo, rol, id]);
                                        console.log('Registro actualizado correctamente');

                                        const [array] = await connection.execute('SELECT * FROM personas');
                                        console.table(array);
                                    } catch (error) {
                                        console.error('Error al actualizar el registro', error);
                                    } finally {
                                        console.timeEnd('Tiempo actualización');
                                        connection.end();
                                        rl.close();
                                    }
                                });
                            });
                        });
                    });
                });
            } else if (ans.toUpperCase() === 'D') {
                rl.question('Ingrese el id de la persona que desea eliminar: ', async (id) => {
                    console.time('Tiempo eliminación');
                    try {
                        await connection.execute('DELETE FROM personas WHERE id = ?', [id]);
                        const [array] = await connection.execute('SELECT * FROM personas');
                        console.table(array);
                        console.log('Registro eliminado correctamente.');
                    } catch (error) {
                        console.log('Error al eliminar el registro', error);
                    } finally {
                        console.timeEnd('Tiempo eliminación');
                        connection.end();
                        rl.close();
                    }
                });
            } else if (ans.toUpperCase() === 'A') {
                rl.question('Ingrese el nombre del nuevo registro: ', async (nombre) => {
                    rl.question('Ingrese el apellido del nuevo registro: ', async (apellido) => {
                        rl.question('Ingrese el correo del nuevo registro: ', async (correo) => {
                            rl.question('Ingrese el rol del nuevo registro: ', async (rol) => {
                                console.time('Tiempo inserción');
                                try {
                                    await connection.execute('INSERT INTO personas (nombre, apellido, correo, rol) VALUES (?,?,?,?)', [nombre, apellido, correo, rol]);

                                    const [array] = await connection.execute('SELECT * FROM personas');
                                    console.table(array);
                                } catch (error) {
                                    console.error('Error al insertar un registro. ', error);
                                } finally {
                                    console.timeEnd('Tiempo inserción');
                                    connection.end();
                                    rl.close();
                                }
                            })
                        })
                    })
                })
            } else {
                console.log('Opción no válida.');
                connection.end();
                rl.close();
            }
        });
    } catch (error) {
        console.log('Error en la consulta de personas: ', error);
        connection.end();
        rl.close();
    }
}

async function ejecutar() {
    console.log('//////////////////////////////CONEXIÓN POR PROMESAS////////////////////////////////////////////');
    await mostrar();
}

ejecutar();
