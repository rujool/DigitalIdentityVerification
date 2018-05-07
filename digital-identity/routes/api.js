var express = require('express');
var router = express.Router();
var multer = require('multer');
var dateformat = require('dateformat');
var cryptoJS = require('crypto-js');
const IdentityRegistry = require('../lib/identityregistry');
var NodeRSA = require('node-rsa');
var crypto = require('crypto');
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
    var photoIDStr = req.files['idPhoto'][0].buffer.toString('base64');
    var signStr = req.files['signPhoto'][0].buffer.toString('base64');
    var AESkey = req.body.password;
    var countryName = req.body.countryName;
    var countryPrivateKey = __dirname+"/../keys/governments/"+countryName + ".txt";
    fs.readFile(countryPrivateKey, 'utf8', function (err,fileData) {
        if (err) {
          return console.log(err);
        }
        var privateKey = fileData;
        passportData = {
            formData: req.body,
            idPhotoStr: photoIDStr,
            signPhotoStr: signStr
        };
        IV = cryptoJS.lib.WordArray.random(128/8);
        password = cryptoJS.lib.WordArray.create(req.body.password);
        var encryptedID = cryptoJS.AES.encrypt(req.body.id,password,{
            'iv':IV
        });
        var cipherTextID = encryptedID.toString();
        var filename = __dirname+'/../keys/users/'+req.body.id+'.txt';
        var fileStr = IV.toString();    
        fs.writeFile(filename,fileStr,function(err){
            if(err){
                return console.log(err);
            }
            console.log('File saved');
        });
        var encryptedData = cryptoJS.AES.encrypt(JSON.stringify(passportData),password,{
            'iv':IV,
        });
        finalPassportData = {
            'passportID': cipherTextID,
            'data' : encryptedData.toString()
        }
        var signObj = crypto.createSign('RSA-SHA256');
        signObj.update(JSON.stringify(finalPassportData));
        var signature = signObj.sign(privateKey,'base64');
        passportObj = {
            'passportData':finalPassportData,
            'signature':signature
        };
    });
    var idReg = new IdentityRegistry();
    idReg.init().then(function(){
        idReg.addPassport(passportObj).then(function success(){
            res.send("Success!");
        },function err(){
            res.send("Error");
        });
    });
});

router.post('/verify-passport',function(req,res){
    
    var password = cryptoJS.lib.WordArray.create(req.body.password);
    var userKeyFile = __dirname+"/../keys/users/"+req.body.id+".txt";
    if (!fs.existsSync(userKeyFile)) {
        return res.send("Passport does not exist!");
    }
    fs.readFile(userKeyFile,'utf8',function(err,fileStr){
        if(err){
            res.send("Error in fetching user details!");
        }
        var iv = cryptoJS.enc.Hex.parse(fileStr);
        var encryptedID = cryptoJS.AES.encrypt(req.body.id,password,{
            'iv': iv
        });
        var credObj = {
            id: encryptedID.toString(),
            iv: iv,
            password: password
        }
        var idReg = new IdentityRegistry();
        idReg.init().then(function(){
            idReg.getPassport(credObj).then(function(response){
                var formData = response.formData;
                formData.DOB = dateformat(formData.DOB, "dd/mm/yyyy");
                formData.issueDate = dateformat(formData.issueDate,"dd/mm/yyyy");
                formData.expiryDate = dateformat(formData.expiryDate,"dd/mm/yyyy");
                formData.photoString = response.idPhotoStr;
                formData.signatureString = response.signPhotoStr;
                res.render('view-passport',{'passportData':formData});
            },function error(err){
                res.send(err);
            });      
        }, function(err){
            res.send(err);
        });        
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
