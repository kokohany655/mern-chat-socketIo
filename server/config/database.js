const mongoose = require("mongoose");

exports.dbConnections = () => {
  mongoose
    .connect(`${process.env.DATABASE_URI}`)
    .then((conn) => {
      console.log("Database Connected " + conn.connection.host);
    })
    .catch((err) => {
      console.log("Database not connected " + err);
    });
};
