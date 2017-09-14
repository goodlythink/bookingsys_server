exports.list = function (req, res, next) {
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