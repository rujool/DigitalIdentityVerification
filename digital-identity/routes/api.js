var express = require('express');
var router = express.Router();
var multer = require('multer');
var dateformat = require('dateformat');
var cryptoJS = require('crypto-js');
const IdentityRegistry = require('../lib/identityregistry');
var NodeRSA = require('node-rsa');
var fs = require('fs');

var multerConf = {
    fileFilter: function(req, file, next) {
        if (!file) {
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if (image) {
            next(null, true);
        } else {
            next({ message: "file type not supported" }, false);
        }
    }
};

var upload = multer();
var mulUpload = upload.fields([{name: 'idPhoto',maxCount:1},{name:'signPhoto',maxCount:1}]);

/* GET home page. */
router.get('/', function(req, res, next) {
   res.send("API")
});

router.route('/official')
    .post(function(req,res,next){
        var idReg = new IdentityRegistry();
        idReg.init().then(function(){
            idReg.addOfficial(req.body).then(function success(){
                res.send("Success!");
            },function err(){
                res.send("Error");
            });
        });
    });

router.post('/passport',mulUpload,function(req,res){
    var files = req.files;
    var idPhotoStr = req.files['idPhoto'][0].buffer.toString('base64');
    var signPhotoStr = req.files['signPhoto'][0].buffer.toString('base64');
    var passportData = {
        'formData':req.body,
        'idPhotoStr': idPhotoStr,
        'signPhotoStr': signPhotoStr
    };
    var idReg = new IdentityRegistry();
    idReg.init().then(function(){
        idReg.addPassport(passportData).then(function success(){
            res.send("Success!");
        },function err(){
            res.send("Error");
        });
    });
});

router.get('/passport/:id',function(req,res){
    var idReg = new IdentityRegistry();
    idReg.init().then(function(){
        idReg.getPassport(req.params.id).then(function(response){
            response.DOB = dateformat(response.DOB, "dd/mm/yyyy");
            response.issueDate = dateformat(response.issueDate,"dd/mm/yyyy");
            response.expiryDate = dateformat(response.expiryDate,"dd/mm/yyyy");
            res.render('view-passport',{'passportData':response});
        },function error(err){
            res.send(err);
        });      
    }, function(err){
        res.send(err);
    });
});

router.route('/government')
    .post(function(req,res,next){
        var idReg = new IdentityRegistry();
        var key = new NodeRSA();
        key.generateKeyPair();
        var publicKey = key.exportKey('pkcs8-public-pem');
        var privateKey = key.exportKey('pkcs1-private-pem');
        var filename = __dirname+'/../keys/governments/'+req.body.name+'.txt';    
        fs.writeFile(filename,privateKey,function(err){
            if(err){
                return console.log(err);
            }
            console.log('File saved');
        });
        var govData = {
            'publicKey' : publicKey,
            'name' : req.body.name
        }
        idReg.init().then(function(){
            idReg.addGovernment(govData).then(function success(){
                res.send("Success!");    
            },function err(){
                res.send("Error");
            });
        });
    });

module.exports = router;
