const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const knex = require('./db/client')
const bcrypt = require('bcrypt');
const aws = require('aws-sdk');
aws.config.region = 'ca-central-1';
const S3_BUCKET = process.env.S3_BUCKET;
if (process.env.NODE_ENV !== 'production') {
    const logger = require('morgan');
    app.use(logger('dev'));
}
app.use((req,res, next)=>{
    if(req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production"){
        res.redirect("https://" + req.hostname + req.url)
    } else { next() }
})
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use((req, res, next) => {
    res.locals.username = "";
    res.locals.profile_img = ""
    if (req.cookies.username) {
        res.locals.username = req.cookies.username
        res.locals.profile_img = req.cookies.profile_img
    }
    next();
})

app.get('/', (req,res)=>{
    knex('counter').increment({count:1}).returning('count')
        .then(count => res.render('index', {wheel: false, count: count} ))
})
app.get('/sign_in', (req,res)=>{
    res.render('sign_in', {user:false})
})
app.get('/sign_up', (req,res)=>{
    res.render('sign_up', {user: false})
})
app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = Date.now() + req.query['file-name'].match(/\.([^.]*)$/)[0].toLowerCase()
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: req.query['file-type'],
      ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){ return res.end() }
        const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}-resized.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
});
app.post('/sign_up', (req, res, next) => {
    knex('users').where({email: req.body.email}).first()
        .then(user => {
            if (user) return res.render('sign_up', {user:true}) 
            return knex('users').insert({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                profile_img: req.body.upfile
            })
        })
        .then(()=>{
            res.cookie('username', req.body.email, { maxAge: 604800000 });
            res.cookie('profile_img', req.body.upfile, { maxAge: 604800000 });
            res.redirect('/wheel')
        })
        .catch(next)
})
app.post('/sign_in', (req, res, next) => {
    knex('users').where({email: req.body.email}).first()
        .then(user => {
            if (user===undefined) return res.render('sign_in', {user:true})
            return bcrypt.compare(req.body.password, user.password)
            .then(passwordMatched => {
                if (!passwordMatched) return res.render('sign_in', {user:true})
                res.cookie('username', req.body.email, { maxAge: 604800000 });
                res.cookie('profile_img', user.profile_img, { maxAge: 604800000 });
                res.redirect('/wheel')
            })
            .catch(next)
        })
})
app.post('/sign_out', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('profile_img');
    res.redirect('/');
})
const wheelRouter = require('./routes/wheel')
app.use('/wheel', wheelRouter)

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server listening on port ${process.env.PORT || 3000}`)
})