var factory = require("./../factory/dbfactory");

var DiscountBusiness = (function() {

    var DiscountBusiness = function() {

    };

    DiscountBusiness.prototype.save = function(discountModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " DELETE FROM class_discount WHERE cla_id =  " + discountModel.cla_id + " ; ";
        sql = sql + " INSERT INTO class_discount (cla_id,cld_early,cld_early_discount,cld_early_limit,cld_early_deadline,cld_last,cld_last_discount)";
        sql = sql + " VALUES( ";
        sql = sql + " " + discountModel.cla_id + ", ";
        sql = sql + " '" + discountModel.cld_early + "', ";
        sql = sql + " " + discountModel.cld_early_discount + ", ";
        sql = sql + " " + discountModel.cld_early_limit + ", ";
        sql = sql + " '" + discountModel.cld_early_deadline + "', ";
        sql = sql + " '" + discountModel.cld_last + "', ";
        sql = sql + " " + discountModel.cld_last_discount + " ";
        sql = sql + " ) ";

        connection.query(sql,function(err,age){
            connection.end();
            if(!err) {

                var collectionAge = age;

                callback(collectionAge);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    DiscountBusiness.prototype.saveCodes = function(discountModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " DELETE FROM class_promo_codes WHERE cla_id = " + discountModel.cla_id + "; ";

        discountModel.codes.forEach(function(item){
            sql = sql + " INSERT INTO class_promo_codes (cla_id,cpc_code_name,cpc_discount,cpc_limit,cpc_deadline)";
            sql = sql + " values( ";
            sql = sql + " " + discountModel.cla_id + ", ";
            sql = sql + " '" + item.cpc_code_name + "', ";
            sql = sql + " " + item.cpc_discount + ", ";
            sql = sql + " " + item.cpc_limit + ", ";
            sql = sql + " '" + item.cpc_deadline + "' ";
            sql = sql + " ); ";
        })

        connection.query(sql,function(err,age){
            connection.end();
            if(!err) {

                var collectionAge = age;

                callback(collectionAge);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    DiscountBusiness.prototype.getDiscount = function(discountModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT * FROM class_discount WHERE cla_id = " + discountModel.cla_id + ";";

        connection.query(sql,function(err,discount){
            connection.end();
            if(!err) {

                var collectionDiscount = discount;
                callback(collectionDiscount);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    DiscountBusiness.prototype.getDiscountClass = function(discountModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT ";
        sql = sql + " case when now() <= cld_early_deadline and cld_early = 'Y' then 'E' ";
        sql = sql + " when  (DATE_FORMAT(now(),'%Y-%m-%d') between DATE_ADD(cla_deadline,INTERVAL -1 DAY) and cla_deadline) and cld_last = 'Y' then 'L' else 'N' ";
        sql = sql + " end as type, ";
        sql = sql + " (cla_cost - cld_early_discount) as early_value, ";
        sql = sql + " (cla_cost - cld_last_discount) as last_value, ";
        sql = sql + " cast(((cld_early_discount * 100)/cla_cost) as decimal(18,2)) as early_perc_value, ";
        sql = sql + " cast(((cld_last_discount * 100)/cla_cost) as decimal(18,2)) as last_perc_value, ";
        sql = sql + " (select case when count(*) < cld_early_limit then 'N' else 'Y' end ";
        sql = sql + " from class_register where cla_id = " + discountModel.cla_id + " and clr_cost = (cla_cost - cld_early_discount)) as reach_limit_early ";
        sql = sql + " FROM class c ";
        sql = sql + " INNER JOIN class_discount cd on c.cla_id = cd.cla_id ";
        sql = sql + " WHERE c.cla_id = " + discountModel.cla_id + "; ";

        connection.query(sql,function(err,discount){
            connection.end();
            if(!err) {

                var collectionDiscount = discount;
                callback(collectionDiscount);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    DiscountBusiness.prototype.getDiscountCodes = function(discountModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT  *,@rownum:=@rownum+1 AS 'index' FROM class_promo_codes ,(SELECT @rownum := 0) r  WHERE cla_id = " + discountModel.cla_id + ";";

        connection.query(sql,function(err,discount){
            connection.end();
            if(!err) {

                var collectionDiscount = discount;
                callback(collectionDiscount);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    return new DiscountBusiness();
})();

module.exports = DiscountBusiness;