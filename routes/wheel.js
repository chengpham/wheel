const express = require('express')
const knex = require('../db/client')
const router = express.Router()
const methodOverride = require('method-override')
router.use(methodOverride((req,res)=>{
    if (req.body && req.body._method){
        return req.body._method
    }
}))

router.get('/', (req,res)=>{
    knex('counter').increment({count:1})
    .then(()=> knex('wheel').where({ is_private: false }).orderBy('created_at', 'desc')
        .then(wheel => res.render('wheel/post', { wheel: wheel }))
    )
})
router.get('/saved', (req,res)=>{
    knex('counter').increment({count:1})
    .then(()=> {
        if (req.cookies.username){
            knex('wheel').where({ is_private: true, username: req.cookies.username })
                .orderBy('created_at', 'desc')
                .then(wheel => res.render('wheel/post', { wheel: wheel }) )
        } else { res.redirect('/wheel') }
    })
})
router.get('/:id', (req,res) => {
    let counter;
    knex('counter').increment({count:1}).returning('count')
        .then(count=> counter=count)
        .then(()=> {
                knex('wheel').where({id: req.params.id}).first()
                .then(wheel=> {
                    if (wheel===undefined){ 
                        res.redirect('/wheel') 
                    } else if (wheel.username==req.cookies.username && wheel.is_private==true){
                        res.render('index', {wheel: wheel, count: counter}) 
                    } else if (wheel.is_private==false){
                        res.render('index', {wheel: wheel, count: counter}) 
                    } else { res.redirect('/wheel') }
                })
            
        })        
})
router.post('/new', (req, res) => {
    knex('wheel')
        .insert({
            username: req.cookies.username,
            group_name: req.body.group_name,
            image_url: req.body.image_url? req.body.image_url: '',
            members: req.body.members,
            is_private: req.body.method==="private"?true:false
        })
        .then(() => res.redirect('/wheel'))
})
router.patch('/:id/edit', (req,res)=>{
    knex('wheel').where({id: req.params.id, username: req.cookies.username})
        .update({
            group_name: req.body.group_name,
            image_url: req.body.image_url? req.body.image_url: '',
            members: req.body.members,
            is_private: req.body.method==="private"?true:false
        })
        .then(()=> res.redirect('/wheel'))
})
router.delete('/:id/del', (req, res) => {
    knex('wheel').where({id: req.params.id, username: req.cookies.username}).del()
        .then(() => res.redirect('/wheel') )
});


module.exports = router;