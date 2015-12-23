require('es6-promise').polyfill();
import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

let app = express();

// 3rd party middleware
app.use(cors({
	exposedHeaders: ['Link']
}));

let mailserver = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "XXXXXXXX@gmail.com",//你的帳號
        pass: "你的應用程式密碼"
    },
    from : 'server@gmail.com',
    headers : {
        'My-Awesome-Header' : '123'
    }
});

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(bodyParser.json({
	limit : '100kb'
}));

// internal middleware

app.server = http.createServer(app);

//routes
app.get('/', (req, res, next) => {
    mailserver.sendMail({
        to: 'XXXXX@gmail.com',//要寄給誰
            subject: 'hello',
            text: 'hello world!',
            html:'<h1>HTML CODE</h1>'
    }, (err, resp) => {
        if(err){
            res.send(err.message);
        }else{
            res.send('success');
        }
    });
})
app.use((err, req, res, next) => {
    console.log(err);
});

//意外的錯誤，應該要寫入資料庫，
process.on('uncaughtException', function(err) {
    console.log(err);
});

app.server.listen(process.env.PORT || 9999);

console.log(`Started on port 9999`);

export default app;
