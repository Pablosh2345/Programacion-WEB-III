var express = require('express')
var router =  express.Router();
const {pool} = require('./db');
router.use(express.json());


router.get('/', function(req, res, next) {
    pool.query('SELECT * FROM competidores',(err,results) =>{
        if(err){
            return res.status(500).json({error: err.message });
        }
        res.json(results)
    })
});
router.put('/:id', function(req, res){
    const{ id } = req.params;
    const{nombre, apellido, deporte, prueba, tiempo} =  req.body;

    if(!nombre || !apellido || !deporte || !prueba || !tiempo){
        return res.status(400).json({error: "Faltan datos"});
    }

    pool.query('UPDATE competidores SET nombre=?, apellido = ?, deporte=?, prueba=?, tiempo=? WHERE id=?',[nombre, apellido, deporte, prueba, tiempo,id], (err, resultado) =>{
        if(err){
            return res.status(500).json({error: err.message});
        }
        if(resultado.affectedRows == 0) {
            return res.status(404).json({error: "Competir no encontrado"});
        }
        res.json({message: "Competidor actualizado"})
    });
});

router.delete('/:id', function(req, res){
    const {id} =  req.params;
    pool.query('DELETE FROM competidores WHERE id=?', [id],(err, results) =>{
        if(err){
            return res.status(500).json({error: err.message});
        }
        if(results.affectedRows == 0) {
            return res.status(404).json({error: "Competir no encontrado"});
        }
        res.json({ message: "Competidor eliminado" });
    })
})

router.post('/', function(req, res){
    const {nombre, apellido, deporte, prueba, tiempo} =  req.body;
    if (!nombre || !apellido || !deporte || !prueba || !tiempo) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    
    pool.query('INSERT INTO competidores (nombre, apellido, deporte, prueba, tiempo) VALUES (?, ?, ?, ?, ?)', 
    [nombre, apellido, deporte, prueba, tiempo], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Competidor agregado", id: results.insertId });
    });
})
module.exports = router;