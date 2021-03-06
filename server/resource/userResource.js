var userBusiness = require("./../business/userBusiness");
var emailBusiness = require("./../business/emailBusiness");

var UserResource = (function() {

    /**
     *
     * @constructor
     */
    var UserResource = function() {};

    UserResource.prototype.saveStudent = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveStudent(userModel, function(obj){
            res.json(obj);
        });

    }

    UserResource.prototype.saveInstructor = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveInstructor(userModel, function(obj){
            res.json(obj);
        });

    }

    UserResource.prototype.saveEmail = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveEmail(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.savePassword = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.savePassword(userModel, function(obj){
            res.json(obj);
        });
    }


    UserResource.prototype.saveInstructorSignUp = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveInstructorSignUp(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.saveSetting = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveSetting(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.updateSetting = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.updateSetting(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.getCategorySetting = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.getCategorySetting(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.getTagsSetting = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.getTagsSetting(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.saveEmailStripe = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        userBusiness.saveEmailStripe(userModel, function(obj){
            res.json(obj);
        });
    }

    UserResource.prototype.sendInstructorApplicationEmail = function(req,res){

        var userModel = new Object();

        if (req){
            userModel = req.body;
        }

        emailBusiness.sendInstructorApplicationEmail(userModel, function(){
            res.json();
        });
    }

    return new UserResource();
})();

module.exports = UserResource;