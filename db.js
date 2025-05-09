const mongoose = require("mongoose")
main().catch((err) => console.log(err))
require('dotenv').config();

async function main() {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    console.log("Database เชื่อมได้แล้วครับอ้าย")

}
