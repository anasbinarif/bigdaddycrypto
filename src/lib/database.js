import mysql from 'mysql2/promise';

const connection = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'bigdaddycrypto',
    password: 'BYrMM3UwBf26GnPiaD8T',
    database: 'bigdaddycrypto'
});

export default connection;