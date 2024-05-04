import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'bigdaddycrypto',
    password: 'BYrMM3UwBf26GnPiaD8T',
    database: 'bigdaddycrypto'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

export default connection;