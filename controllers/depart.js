exports.list = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    req.getConnection(function (err, connection) {
        var sql = "select * from depart where (code like ? or name like ?)";
        var params = "%" + req.query.term + "%"

        connection.query(sql, [params, params], function (err, results) {
            if (err) return next(err);
            res.send(results);
        });
    });
}

exports.save = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    var id = parseInt(req.body.id);
    var post = {
        code: req.body.code,
        name: req.body.name,
        faculty_id: req.body.faculty_id
    }

    req.getConnection(function (err, connection) {
        connection.query("select id, code from depart where code=?", [post.code], function (err, results) {
            if (err) return next(err);

            //ตรจสอบก่อนว่ารหัสซ้ำมั้ย
            //ส่งต่อว่าจะ new or update
            if (results.length > 0) {
                if (results[0].id !== id) {
                    res.send({ status: 421, message: 'code duplicated' })
                } else {
                    //update
                    connection.query("update depart set ? where id=?", [post, id], function (err, results) {
                        if (err) return next(err);
                        res.send({ status: 200, results })
                    })
                }
            } else {
                //insert
                connection.query("insert into depart set ? ", post, function (err, results) {
                    if (err) return next(err);
                    res.send({ status: 200, results });
                })
            }
        });
    })
}

exports.delete = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    var id = parseInt(req.params.id);
    req.getConnection(function (err, connection) {
        connection.query("delete from depart where id=?", id, function (err, results) {
            if (err) return next(err);
            res.send({ status: 200, results });
        })
    })
}

exports.detail = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    var id = parseInt(req.params.id);
    req.getConnection(function (err, connection) {
        connection.query("select * from depart where id=?", id, function (err, results) {
            if (err) return next(err);
            res.send(results);
        })
    })
}