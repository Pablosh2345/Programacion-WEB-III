const { pool } = require('./database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function main() {
  console.time('Tiempo total de ejecución');
  try {

    console.time('Tiempo consulta personas');
    pool.query('SELECT * FROM personas', (err, results) => {
      if (err) {
        console.error('Error al realizar la consulta:', err);
        return;
      }
      console.table(results);
      console.timeEnd('Tiempo consulta personas');
    });

    console.time('Tiempo consulta eventos');
    pool.query('SELECT * FROM eventos', (err, results) => {
      if (err) {
        console.error('Error al realizar la consulta ', err);
        return;
      }
      console.table(results);
      console.timeEnd('Tiempo consulta eventos');
    });

    console.time('Tiempo consulta asistencia');
    pool.query('SELECT * FROM asistencia', (err, results) => {
      if (err) {
        console.error('Error al realizar la consulta ', err);
        return;
      }
      console.table(results);
      console.timeEnd('Tiempo consulta asistencia');
    });
  } catch (error) {
    console.error('Error en la consulta:', error);
  }

  rl.question('Desea actualizar (U), eliminar (D) o añadir (A) un registro: ', (ans) => {
    if (ans.toUpperCase() === 'U') {
      rl.question('Ingrese el ID del registro que desea actualizar: ', (id) => {
        rl.question('Ingrese el nuevo nombre: ', (nombre) => {
          rl.question('Ingrese el nuevo apellido: ', (apellido) => {
            rl.question('Ingrese el nuevo correo: ', (correo) => {
              rl.question('Ingrese el nuevo rol: ', (rol) => {
                console.time('Tiempo actualización');
                pool.query('UPDATE personas SET nombre = ?, apellido = ?, correo = ?, rol = ? WHERE id = ?',
                  [nombre, apellido, correo, rol, id], (err) => {
                    if (err) console.error('Error al actualizar el registro:', err);
                    else {
                      console.log('Registro actualizado correctamente.');
                      pool.query('SELECT * FROM personas', (err, results) => {
                        if (err) console.error('Error al consultar personas:', err);
                        else {
                          console.table(results);
                          console.timeEnd('Tiempo actualización');
                          pool.end();
                          rl.close();
                        }
                      });
                    }
                  });
              });
            });
          });
        });
      });
    } else if (ans.toUpperCase() === 'D') {
      rl.question('Ingrese el ID de la persona que desea eliminar: ', (id) => {
        console.time('Tiempo eliminación');
        pool.query('DELETE FROM personas WHERE id = ?', [id], (err) => {
          if (err) console.error('Error al eliminar el registro:', err);
          else {
            console.log('Registro eliminado correctamente.');
            pool.query('SELECT * FROM personas', (err, results) => {
              if (err) console.error('Error al consultar personas:', err);
              else {
                console.table(results);
                console.timeEnd('Tiempo eliminación');
                pool.end();
                rl.close();
              }
            });
          }
        });
      });
    } else if (ans.toUpperCase() === 'A') {
      rl.question('Ingrese el nombre del nuevo registro: ', (nombre) => {
        rl.question('Ingrese el apellido del nuevo registro: ', (apellido) => {
          rl.question('Ingrese el correo del nuevo registro: ', (correo) => {
            rl.question('Ingrese el rol del nuevo registro: ', (rol) => {
              console.time('Tiempo inserción');
              pool.query('INSERT INTO personas (nombre, apellido, correo, rol) VALUES (?, ?, ?, ?)',
                [nombre, apellido, correo, rol], (err) => {
                  if (err) console.error('Error al insertar un registro:', err);
                  else {
                    console.log('Registro agregado correctamente.');
                    pool.query('SELECT * FROM personas', (err, results) => {
                      if (err) console.error('Error al consultar personas:', err);
                      else {
                        console.table(results);
                        console.timeEnd('Tiempo inserción');
                        pool.end();
                        rl.close();
                      }
                    });
                  }
                });
            });
          });
        });
      });
    } else {
      console.log('Opción no válida.');
      pool.end();
      rl.close();
    }
  });

  console.timeEnd('Tiempo total de ejecución');
}

main();
