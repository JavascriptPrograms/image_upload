import mysql from "mysql2";

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "atulya",
    database: "image_upload_curd"
});

export default conn