var factory = require("./../factory/dbfactory");
var utilBusiness = require("./../business/utilBusiness");

var ClassBusiness = (function() {

    var ClassBusiness = function() {

    };

    var time_zone_date = " DATE_FORMAT(CONVERT_TZ(now(),'-00:00', cit_time_zone),'%Y-%m-%d') ";

    ClassBusiness.prototype.getClassMultiple = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT DATE_FORMAT(clt_date,'%m/%d/%Y') AS date,DATE_FORMAT(clt_start_time,\"%l:%i %p\") AS time, clt_address AS address, @rownum:=@rownum+1  AS 'index' ";
        sql = sql + " FROM class C";
        sql = sql + " INNER JOIN class_time CT ON C.cla_id = CT.cla_id ";
        sql = sql + " ,(SELECT @rownum := 0) r ";
        sql = sql + " WHERE C.cla_id =  " + classModel.cla_id + " AND clt_firstClass = 'N' ";
        sql = sql + " ORDER BY clt_date; ";


        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    ClassBusiness.prototype.save = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var d = new Date();
        classModel.cla_added_date = d.getDate();

        var sql = "";
        if(classModel.cla_id != "")
        {
            sql = sql + " UPDATE class SET ";
            sql = sql + " cla_session_type = '" + classModel.cla_session_type + "',";
            sql = sql + " cla_duration = '" + classModel.cla_duration + "',";
            sql = sql + " cla_cost = '" + classModel.cla_cost + "',";
            sql = sql + " cla_min_size = '" + classModel.cla_min_size + "',";
            sql = sql + " cla_max_size = '" + classModel.cla_max_size + "',";
            sql = sql + " cla_address = '" + classModel.cla_address.replace(/'/g, "\\'") + "',";
            sql = sql + " cla_location_name = '" + classModel.cla_location_name.replace(/'/g, "\\'") + "',";
            sql = sql + " cla_added_date = '" + classModel.cla_added_date + "',";
            sql = sql + " cla_status = '" + classModel.cla_status + "',";
            sql = sql + " cla_deadline = '" + classModel.cla_deadline + "',";
            sql = sql + " cla_allow_lateRegistration = '" + classModel.cla_allow_lateRegistration + "',";
            sql = sql + " cla_allow_lateWithdraw = '" + classModel.cla_allow_lateWithdraw + "',";
            sql = sql + " cla_lateWithdraw_date = '" + classModel.cla_lateWithdraw_date + "',";
            sql = sql + " age_id = '" + classModel.age_id + "',";
            sql = sql + " col_id = '" + classModel.col_id + "',";
            sql = sql + " cit_id = '" + classModel.cit_id + "',";
            sql = sql + " cor_id = '" + classModel.cor_id + "',";
            sql = sql + " use_id = '" + classModel.use_id + "',";
            sql = sql + " nei_id = '" + classModel.nei_id + "',";
            sql = sql + " cla_latitude = '" + classModel.latitude + "',";
            sql = sql + " cla_longitude = '" + classModel.longitude + "'";
            sql = sql + " WHERE ";
            sql = sql + " cla_id = " + classModel.cla_id + ";";
        }
        else{

            sql = sql + " INSERT INTO class (cla_session_type,cla_duration,cla_cost,cla_min_size, ";
            sql = sql + " cla_max_size,cla_address,cla_added_date,cla_status,cla_deadline, ";
            sql = sql + " cla_allow_lateRegistration,cla_allow_lateWithdraw,cla_lateWithdraw_date, ";
            sql = sql + " age_id,col_id,cit_id,cor_id,use_id,nei_id,cla_latitude,cla_longitude,cla_link,cla_location_name) ";
            sql = sql + " VALUES (";
            sql = sql + " '" + classModel.cla_session_type + "',";
            sql = sql + " '" + classModel.cla_duration + "','"  + classModel.cla_cost + "',";
            sql = sql + " '" + classModel.cla_min_size + "','"  + classModel.cla_max_size + "',";
            sql = sql + " '" + classModel.cla_address.replace(/'/g, "\\'") + "','"  + classModel.cla_added_date + "',";
            sql = sql + " '" + classModel.cla_status + "','"  + classModel.cla_deadline + "',";
            sql = sql + " '" + classModel.cla_allow_lateRegistration + "','"  + classModel.cla_allow_lateWithdraw + "',";
            sql = sql + " '" + classModel.cla_lateWithdraw_date + "','"  + classModel.age_id + "',";
            sql = sql + " '" + classModel.col_id + "','"  + classModel.cit_id + "',";
            sql = sql + " '" + classModel.cor_id + "','"  + classModel.use_id + "',";
            sql = sql + " '" + classModel.nei_id + "','" + classModel.latitude + "','" +  classModel.longitude + "','',";
            sql = sql + " '" + classModel.cla_location_name.replace(/'/g, "\\'") + "'";
            sql = sql + " );";
        }

        connection.query(sql,function(err,classObj){
            if(!err) {

                if(classModel.cla_id != "") {
                    sql = "";
                    sql = sql + " DELETE  FROM class_time ";
                    sql = sql + " WHERE ";
                    sql = sql + " cla_id = " + classModel.cla_id + ";";
                }else{
                    sql = "";
                    sql = sql + " DELETE  FROM class_time ";
                    sql = sql + " WHERE ";
                    sql = sql + " cla_id = " + classObj.insertId + ";";

                    var newCode = Math.random().toString(36).slice(-12);
                    classModel.cla_link = classModel.cla_link + classObj.insertId + "/" + newCode;

                    sql = sql + " UPDATE class set cla_link = '" + classModel.cla_link + "', cla_codSource = '" + newCode + "'  WHERE cla_id = " + classObj.insertId + "; ";

                    classModel.cla_id =  classObj.insertId;
                }

                connection.query(sql,function(err,classObj1){
                    if(!err) {

                        sql = "";

                        classModel.class_time_data.forEach(function (item) {

                            sql = sql + " INSERT INTO class_time (clt_date,clt_start_time,cla_id,clt_address,clt_firstClass) ";
                            sql = sql + " VALUES ('" + item.clt_date + "', ";
                            sql = sql + " TIME( STR_TO_DATE( '" + item.clt_start_time + "', '%h:%i %p' ) ), ";
                            sql = sql + " " + classModel.cla_id + ", ";
                            if(item.clt_address == "null" || item.clt_address == undefined){
                                sql = sql + " null ,";
                            }else{
                                sql = sql + " '" + item.clt_address + "' ,";
                            }

                            sql = sql + " '" + item.clt_firstClass + "' ";
                            sql = sql + " ); ";

                        });

                        connection.query(sql, function (err, classObj2) {
                            connection.end();
                            if (!err) {

                                if(classModel.cla_status == 'A' && (classModel.cla_status_prev == 'P' || classModel.cla_status_prev == "")) {
                                    utilBusiness.InstructorClassPosting(classModel.cla_id);
                                }

                                if(classModel.cla_id != "") {
                                    utilBusiness.UserClassChangeNotification(classModel.cla_id);
                                }

                                var ret_class = classModel.cla_id.toString();
                                callback(ret_class);
                            }
                        });
                    }

                });
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Error to connect database"});
        });

    };

    ClassBusiness.prototype.postClass = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE class SET cla_status = 'A' WHERE cla_id = " + classModel.cla_id + ";";

        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    ClassBusiness.prototype.getClass = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT *, ";
        sql = sql + " case ";
        sql = sql + " when number_session > 1 then Concat(number_session, ' Sessions') ";
        sql = sql + " else cla_duration ";
        sql = sql + " end AS number_session,(cla_max_size - students) AS spot_left ";
        sql = sql + " FROM   ( ";

        sql = sql + " select CL.use_id as use_id_instructor, CL.cla_id,Cl.cor_id, cla_session_type, cla_duration, cla_cost, cla_min_size, cla_max_size, cla_address,nullif(cla_location_name,'') as cla_location_name, ";
        sql = sql + "   coalesce(nullif(cor_waiver,''),'') as cor_waiver,cla_status, cla_allow_lateRegistration, cla_allow_lateWithdraw, DATE_FORMAT(cla_lateWithdraw_date, \"%b %d, %Y\") cla_lateWithdraw_date, ";
        sql = sql + "   cla_latitude, cla_longitude, clt_date, clt_start_time, clt_address, clt_firstClass, cor_name, cor_description, ";
        sql = sql + "   cor_accreditation, cor_accreditation_description, cor_learn, cor_bring, cor_aware_before,cor_about_me, ";
        sql = sql + "   cor_structure, cor_image, cor_added_date, cor_who_isfor, cor_expertise, cor_why_love, ";
        sql = sql + "   cor_style, cor_why_take, CONCAT(coalesce(US.use_first_name,''),' ',coalesce(US.use_last_name,'') ) AS use_name, ";
        sql = sql + "   use_description, use_email, usi_about, usi_expertise, usi_credential, use_image, ";
        sql = sql + "   usi_coached_before, usi_coached_experience, usi_speaking_groups, usi_speaking_experience, ";
        sql = sql + "   DATE_FORMAT(CT.clt_date, \"%b %d\") as dateShow, DATE_FORMAT(CT.clt_date, \"%Y-%m-%d\") as clt_date_url, ";
        sql = sql + "   case  ";
        sql = sql + "       when cla_session_type = 'S' then DATE_FORMAT(cla_deadline, \"%b %d, %Y\")  ";
        sql = sql + "       when cla_session_type = 'M' and cla_allow_lateWithdraw = 'Y' then  DATE_FORMAT(cla_lateWithdraw_date, \"%b %d, %Y\")  ";
        sql = sql + "       when cla_session_type = 'M' and cla_allow_lateWithdraw = 'N' then DATE_FORMAT(cla_deadline, \"%b %d, %Y\")  ";
        sql = sql + "   end as dateShowC , ";
        sql = sql + "   cit_description, pro_code, age_description,col_description, ";
        sql = sql + "   DATE_FORMAT(CT.clt_start_time,\"%l:%i %p\") AS timeShow, DAYNAME(CT.clt_date) AS dayName, ";
        sql = sql + "   TIMESTAMPDIFF(day,"+time_zone_date+",Date_format(CL.cla_deadline, \"%y-%m-%d\")) as cla_deadline2, ";
        sql = sql + "  CASE WHEN Date_format(CL.cla_deadline,\"%Y-%m-%d\") = "+time_zone_date+" THEN 'Today' else Date_format(CL.cla_deadline, \"%b %d, %Y\") end AS cla_deadline, ";
        sql = sql + " (select coalesce(count(*),0) from class_review where cor_id = cl.cor_id) AS number_reviews, ";
        sql = sql + " (select coalesce(Sum(cre_stars) / Count(cre_id),0) from class_review  where cor_id = cl.cor_id) star_general, ";
        sql = sql + " (select coalesce(count(clr_id),0) from class_register where cla_id = cl.cla_id and clr_status = 'A') as students, ";
        sql = sql + " (select count(*) from class_time where cla_id = cl.cla_id) AS number_session, ";
        sql = sql + " (select count(wis_id) from wishlist where cor_id = CO.cor_id) wishlist ";
        if(classModel.use_id != "")
            sql = sql + "      ,COALESCE(WL.wis_status,'N') AS wis_status ";
        sql = sql + " from class CL ";
        sql = sql + "   INNER JOIN class_time CT ON CL.cla_id = CT.cla_id  ";
        sql = sql + "   INNER JOIN course CO ON CL.cor_id = CO.cor_id ";
        sql = sql + "   INNER JOIN user US ON CO.use_id = US.use_id ";
        sql = sql + "   INNER JOIN user_instructor UI ON US.use_id = UI.use_id ";
        sql = sql + "   INNER JOIN age AG ON CL.age_id = AG.age_id ";
        sql = sql + "   INNER JOIN course_level LV ON CL.col_id = LV.col_id ";
        sql = sql + "   INNER JOIN city CY ON CL.cit_id = CY.cit_id ";
        sql = sql + "   INNER JOIN province PR ON CY.pro_id = PR.pro_id ";
        if(classModel.use_id != "")
            sql = sql + "   LEFT JOIN wishlist WL ON CL.cor_id = WL.cor_id and WL.use_id = " + classModel.use_id  + " ";
        sql = sql + " where CL.cla_id = " + classModel.cla_id + " AND CT.clt_firstClass = 'Y' ";
        sql = sql + " GROUP BY CO.cor_id, CL.cla_id ) AS AUX; ";

        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                ClassBusiness.prototype.saveClassVisit(classModel.cla_id,classModel.use_id);

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    ClassBusiness.prototype.saveClassVisit = function(cla_id,use_id) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        if(use_id != "")
            sql = sql + " insert into class_visit (cla_id,clv_date,use_id) values (" + cla_id + ",now(), "+use_id+"); ";
        else
            sql = sql + " insert into class_visit (cla_id,clv_date) values (" + cla_id + ",now()); ";

        connection.query(sql,function(err,classObj){
            connection.end();
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    ClassBusiness.prototype.getClassComments = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT cre_id,cre_review,cre_stars,use_image, ";
        sql = sql + " US.use_first_name AS use_name ";
        sql = sql + " FROM class_review CR ";
        sql = sql + " INNER JOIN user US ON CR.use_id = US.use_id ";
        sql = sql + " where cor_id = " + classModel.cor_id + " and cre_status = 'A' and cre_review_private = 'N' ; ";


        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });
    };

    ClassBusiness.prototype.getClassTime = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT DATE_FORMAT(clt_date, \"%b %d\") as dateShow,DATE_FORMAT(clt_start_time,\"%l:%i %p\") AS timeShow, DATE_FORMAT(clt_date, \"%a.\")  AS dayName, ";
        sql = sql + " TIME_FORMAT(ADDTIME(Ct.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, clt_address ";
        sql = sql + " FROM class_time ct ";
        sql = sql + " inner join class c on ct.cla_id = c.cla_id ";
        sql = sql + " where c.cla_id = " + classModel.cla_id + " order by clt_date; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.otherClassTime = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT distinct CT.cla_id, DATE_FORMAT(clt_date, \"%b %d\") as dateShow, Date_format(clt_date, \"%Y-%m-%d\") as clt_date_url, DATE_FORMAT(clt_start_time,\"%l:%i %p\") AS timeShow, DAYNAME(clt_date) AS dayName, ";
        sql = sql + " CT.cla_cost, TIME_FORMAT(C.clt_start_time, '%l:%i %p') AS clt_start_time, COU.cor_name, ";
        sql = sql + " TIME_FORMAT(ADDTIME(C.clt_start_time, SEC_TO_TIME(cT.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " (SELECT COUNT(*) FROM class_time WHERE cla_id = CT.cla_id) AS sessions, ";
        sql = sql + " (select cat_description from course_subcategory cs ";
        sql = sql + " inner join category cat on cs.cat_id = cat.cat_id ";
        sql = sql + " inner join subcategory subcat on cat.cat_id = subcat.cat_id and cs.sca_id = subcat.sca_id ";
        sql = sql + " where cor_id = CT.cor_id limit 1) as category_url, ";
        sql = sql + " (select sca_description from course_subcategory cs ";
        sql = sql + " inner join category cat on cs.cat_id = cat.cat_id ";
        sql = sql + " inner join subcategory subcat on cat.cat_id = subcat.cat_id and cs.sca_id = subcat.sca_id ";
        sql = sql + " where cor_id = CT.cor_id limit 1) as subcategory_url ";
        sql = sql + " FROM class CT ";
        sql = sql + " INNER JOIN class_time C ON CT.cla_id = C.cla_id ";
        sql = sql + " INNER JOIN course COU ON CT.cor_id = COU.cor_id ";
        sql = sql + " INNER JOIN city cit ON CT.cit_id = cit.cit_id ";
        sql = sql + " where CT.cor_id = " + classModel.cor_id + "  and clt_firstClass = 'Y' AND CT.cla_status = 'A' and C.clt_date > "+time_zone_date+" and CT.cla_id <> " +  classModel.cla_id + " ";
        sql = sql + " ORDER BY clt_date "

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.allClassTime = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " SELECT distinct CT.cla_id, DATE_FORMAT(clt_date, \"%b %d\") as dateShow,DATE_FORMAT(clt_start_time,\"%l:%i %p\") AS timeShow, DAYNAME(clt_date) AS dayName, ";
        sql = sql + " CT.cla_cost, TIME_FORMAT(C.clt_start_time, '%l:%i %p') AS clt_start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(C.clt_start_time, SEC_TO_TIME(cT.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " (SELECT COUNT(*) FROM class_time WHERE cla_id = CT.cla_id) AS sessions, ";
        sql = sql + " coalesce(nullif(CD.cld_early,''),'N') as cld_early, coalesce(nullif(CD.cld_last,''),'N') as cld_last, ";
        sql = sql + " case when DATE_FORMAT(CONVERT_TZ(now(),'-00:00', cit_time_zone),'%Y-%m-%d') <= cld_early_deadline then 'Y' else 'N' end as date_early, ";
        sql = sql + " case when TIMESTAMPDIFF(day,DATE_FORMAT(CONVERT_TZ(now(),'-00:00', cit_time_zone),'%Y-%m-%d'),C.clt_date) between 0 and 1 then 'Y' else 'N' end as date_last, ";
        sql = sql + " (select cld_early_discount from class_discount where cla_id = ct.cla_id) as early_value, ";
        sql = sql + " (select COALESCE(cld_last_discount,0) from class_discount where cla_id = ct.cla_id ) as last_value";
        sql = sql + " FROM class CT ";
        sql = sql + " INNER JOIN class_time C ON CT.cla_id = C.cla_id ";
        sql = sql + " INNER JOIN city cit ON CT.cit_id = cit.cit_id ";
        sql = sql + " INNER JOIN class_discount CD ON CT.cla_id = CD.cla_id ";
        sql = sql + " where CT.cor_id = " + classModel.cor_id + "  and clt_firstClass = 'Y' AND CT.cla_status = 'A' and C.clt_date >= "+time_zone_date+" ";
        sql = sql + " ORDER BY clt_date ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesAttending = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else cla_duration  end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name,city.cit_description, prov.pro_code,cr.clr_id, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p') AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
        sql = sql + " TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) day_until_num,c.cla_address,CAST(coalesce(clr_discount,0) as DECIMAL(18,2)) as clr_discount, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " inner join province prov on city.pro_id = prov.pro_id ";
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'A' and clr_transaction_status <> 'C' ";
        sql = sql + " and ct.clt_date >= "+time_zone_date+"  ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesAttended = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else cla_duration  end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name,co.cor_id, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost,city.cit_description, prov.pro_code, ";
        sql = sql + " ct.clt_date clt_date_order, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d, %Y\") clt_date_line, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
        sql = sql + " TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) day_until_num, c.cla_address, cre.cre_id,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " inner join province prov on city.pro_id = prov.pro_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cor_id = cre.cor_id AND cre.use_id = " + classModel.use_id + " and cre.cla_id = c.cla_id "
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'A' and clr_transaction_status <> 'C' ";
        //sql = sql + " AND cre_id is null ";
        sql = sql + " and ct.clt_date < "+time_zone_date+"  ) as aux ";
        sql = sql + " ORDER BY clt_date_order DESC ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getAllClassesAttended = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else cla_duration end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, co.cor_id, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
        sql = sql + " TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) day_until_num, c.cla_address, coalesce(cre.cre_id,0) as cre_id,CAST(coalesce(clr_discount,0) as DECIMAL(18,2)) as clr_discount,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cla_id = cre.cla_id AND cre.use_id = " + classModel.use_id + " "
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'A' and clr_transaction_status <> 'C' ";
        sql = sql + " and ct.clt_date < "+time_zone_date+"  ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesCancelled = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else cla_duration end as sessions ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name,use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " DATE_FORMAT(clr_added_date, \"%Y-%m-%d\") purchase_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(clr_cancel_date, \"%Y-%m-%d\") clr_cancel_date, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date), ' days') else 'Starts today' end  as day_until, ";
        sql = sql + " c.cla_address, cre.cre_id,";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
        sql = sql + " inner join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " LEFT JOIN class_review cre ON c.cla_id = cre.cla_id AND cre.use_id = " + classModel.use_id + " "
        sql = sql + " where cr.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and clr_status = 'I' and clr_transaction_status = 'C' ";
        sql = sql + " and ct.clt_date < "+time_zone_date+"  ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesTeaching = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else cla_duration end as sessions, ";
        sql = sql + " (students*cla_cost) gross, ";
        sql = sql + " concat(students,'/',cla_max_size) students, ";
        sql = sql + " case when students >= cla_min_size then ' - Class is on!' else '' end classOn ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, co.cor_id,";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name, ";
        sql = sql + " use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date), ' days') else 'Starts today' end as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration, ";
        sql = sql + " (select count(*) from class_register where cla_id = c.cla_id) students, ";
        sql = sql + " (select coalesce(sum(clr_instructor_value),0) from class_register where cla_id = c.cla_id) clr_instructor_value, ";
        sql = sql + " (select coalesce(sum(coalesce(nullif(clr_discount,''),0)),0) from class_register where cla_id = c.cla_id) clr_discount, ";
        sql = sql + " c.cla_max_size, c.cla_min_size ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
      //  sql = sql + " left join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " where co.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and c.cla_status = 'A' ";
        sql = sql + " and ct.clt_date >= "+time_zone_date+" ";
        sql = sql + " ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.getClassesTaught = function (classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";

        sql = sql + " select *, ";
        sql = sql + " case when sessions > 1 then concat(sessions, ' Sessions') else cla_duration end as sessions, ";
        sql = sql + " concat(students,'/',cla_max_size) students, ";
        sql = sql + " case when students >= cla_min_size then ' - Class is on!' else '' end classOn ";
        sql = sql + " from ( ";
        sql = sql + " select c.cla_id,co.cor_image, co.cor_name, ";
        sql = sql + " CONCAT(coalesce(use_first_name,''),' ',coalesce(use_last_name,'') ) as instructor_name, ";
        sql = sql + " use_image, ";
        sql = sql + " c.cla_cost, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%b %d\") clt_date, ";
        sql = sql + " DATE_FORMAT(ct.clt_date, \"%Y-%m-%d\") clt_date_account, ";
        sql = sql + " DATE_FORMAT(ct.clt_start_time,\"%l:%i %p\") start_time, ";
        sql = sql + " TIME_FORMAT(ADDTIME(CT.clt_start_time, SEC_TO_TIME(c.cla_duration*60)), '%l:%i %p')  AS final_time, ";
        sql = sql + " case when TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date) > 0 then CONCAT('Starts in ' ,TIMESTAMPDIFF(day,"+time_zone_date+",ct.clt_date), ' days') else 'Starts today' end as day_until, ";
        sql = sql + " c.cla_address, ";
        sql = sql + " (select count(*) from class_time where cla_id = c.cla_id) as sessions, c.cla_duration, ";
        sql = sql + " (select count(*) from class_register where cla_id = c.cla_id) students, ";
        sql = sql + " (select coalesce(sum(clr_instructor_value),0) from class_register where cla_id = c.cla_id) clr_instructor_value, ";
        sql = sql + " (select cast((coalesce(Sum(cre_stars) / Count(cre_id),0)) as decimal(18,2)) from class_review  where cor_id = co.cor_id) star_general, ";
        sql = sql + " (select CAST(((count(*)*cla_duration)/60) AS DECIMAL(18,2)) from class_time where cla_id = c.cla_id) as hours_total, ";
        sql = sql + " c.cla_max_size, c.cla_min_size ";
        sql = sql + " from class c ";
        sql = sql + " inner join course co on c.cor_id = co.cor_id ";
        sql = sql + " inner join user u on co.use_id = u.use_id ";
        sql = sql + " inner join user_instructor ui on u.use_id = ui.use_id ";
       // sql = sql + " left join class_register cr on c.cla_id = cr.cla_id ";
        sql = sql + " inner join class_time ct on c.cla_id = ct.cla_id ";
        sql = sql + " inner join city city on c.cit_id = city.cit_id ";
        sql = sql + " where co.use_id = " + classModel.use_id + " ";
        sql = sql + " and ct.clt_firstClass = 'Y' ";
        sql = sql + " and c.cla_status = 'A' ";
        sql = sql + " and ct.clt_date < "+time_zone_date+" ";
        sql = sql + " ) as aux; ";

        connection.query(sql, function (err, classObj) {
            connection.end();
            if (!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });
    };

    ClassBusiness.prototype.cancelClass = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " UPDATE class SET cla_status = 'I' WHERE cla_id = " + classModel.cla_id + ";";

        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    ClassBusiness.prototype.getRoster = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select clr_id, CR.use_id, use_image, concat(coalesce(use_first_name,''),' ', coalesce(use_last_name,'')) use_name, ";
        sql = sql + " date_format(CR.clr_added_date,'%Y-%m-%d') as clr_added_date, CR.clr_cost, ";
        sql = sql + " case ";
        sql = sql + " when CR.clr_transaction_status = 'W' then 'Registered' ";
        sql = sql + " when CR.clr_transaction_status = 'P' then 'Paid' ";
        sql = sql + " when CR.clr_transaction_status = 'C' then 'Cancelled' ";
        sql = sql + " end as status, coalesce(NULLIF(clr_discount_code,''),'N/A') as clr_discount_code ";
        sql = sql + " from class_register CR ";
        sql = sql + " INNER JOIN user U ON CR.use_id = U.use_id ";
        sql = sql + " where cla_id = " + classModel.cla_id + "; ";


        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    ClassBusiness.prototype.getGoal = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        sql = sql + " select clr_course_goal ";
        sql = sql + " from class_register ";
        sql = sql + " where cla_id = " + classModel.cla_id + " and use_id = " + classModel.use_id + " and clr_id = " + classModel.clr_id + ";";

        connection.query(sql,function(err,classObj){
            connection.end();
            if(!err) {

                var collectionClass = classObj;

                callback(collectionClass);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "database error"});
        });


    };

    ClassBusiness.prototype.regAdjust = function(classModel, callback) {

        var connection = factory.getConnection();
        connection.connect();

        var sql = "";
        if(classModel.op == 2) {

            sql = sql + " INSERT INTO class_register (clr_cost, clr_added_date, clr_status, clr_transaction_status, cla_id, use_id, cor_id, clr_cancel_date, clr_instructor_value,clr_course_goal,clr_discount,clr_discount_code) ";
            sql = sql + " VALUES( ";
            sql = sql + "  0 , ";
            sql = sql + "  '" + classModel.clr_added_date + "', ";
            sql = sql + " 'A', "; // A:active, I: Inactive
            sql = sql + " 'P', "; // W:waiting, P:paid, C:cancelled
            sql = sql + " " + classModel.cla_id + ",  ";
            sql = sql + " 9999,  ";
            sql = sql + " " + classModel.cor_id + ",   ";
            sql = sql + " null,   ";
            sql = sql + " 0,   ";
            sql = sql + " '',  ";
            sql = sql + " 0,   ";
            sql = sql + " 'External Registration'   ";
            sql = sql + " ); ";

        }else{
            sql = sql + " DELETE FROM class_register ";
            sql = sql + " WHERE cla_id = " +  classModel.cla_id + " AND use_id = 9999 LIMIT 1;";
        }

        connection.query(sql,function(err,age){
            connection.end();
            if(!err) {

                var collectionAge = age;

                callback(collectionAge);
            }
        });

        connection.on('error', function(err) {
            connection.end();
            callback({"code" : 100, "status" : "Database Error"});
        });
    };


    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
    };

    return new ClassBusiness();
})();

module.exports = ClassBusiness;