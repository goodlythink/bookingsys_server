exports.list = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    req.getConnection(function (err, connection) {
        var sql = "select * from faculty where (code like ?) or (name like ?)";
        var params = "%" + req.query.term + "%";

        connection.query(sql, [params, params], function (err, results) {
            //if (err) { return console.log("Error Selecting : %s ", err) };
            //if (err) throw new Error(err);
            if (err) return next(err);
            //setTimeout(() => {
            res.send(results);
            //}, 5000)

        })
    });
}

exports.save = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    var id = req.body.id;
    var post = {
        code: req.body.code,
        name: req.body.name
    }

    req.getConnection(function (err, connection) {
        connection.query("select id, code from faculty where code=?", [post.code], function (err, results) {
            if (err) {
                res.send({ status: 422, message: err });
                //return console.log("Error  : %s ", err)
                return next(err);
            }

            //ตรจสอบก่อนว่ารหัสซ้ำมั้ย
            //ส่งต่อว่าจะ new or update
            if (results.length > 0) {
                if (results[0].id !== parseInt(id)) {
                    res.send({ status: 421, message: 'code duplicated' })
                } else {
                    //update
                    connection.query("update faculty set ? where id=?", [post, parseInt(id)], function (err, results) {
                        if (err) {
                            res.send({ status: 422, message: err });
                            return console.log("Error  : %s ", err)
                        }

                        res.send({ status: 200, results });
                    });
                }
            } else {
                //insert
                connection.query("insert into faculty set ? ", post, function (err, results) {
                    if (err) {
                        res.send({ status: 422, message: err });
                        return console.log("Error  : %s ", err)
                    }


                    res.send({ status: 200, results });
                });
            }

        });

    });
}

exports.delete = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    var id = req.params.id;
    req.getConnection(function (err, connection) {
        connection.query('DELETE FROM faculty WHERE id = ? ', [parseInt(id)], function (err, results) {
            if (err) {
                res.send({ status: 422, message: err });
                return console.log("Error : %s ", err)
            }

            res.send({ status: 200, results });
        });
    });
}

exports.detail = function (req, res, next) {
    if (req.user.invalidToken) return next(res.send({ invalidToken: true }));

    var id = req.params.id;
    req.getConnection(function (err, connection) {
        connection.query('select * from faculty where id = ?', [parseInt(id)], function (err, results) {
            if (err) {
                res.send({ status: 422, message: err });
                return console.log("Error : %s ", err)
            }

            res.send(results);
        })
    })
}