exports.list = function (req, res) {
    req.getConnection(function (err, connection) {
        connection.query("select * from tbtimecheck limit 100", function (err, rows) {
            if (err) { return console.log("Error Selecting : %s ", err) };

            res.send(rows);
        })
    })
}