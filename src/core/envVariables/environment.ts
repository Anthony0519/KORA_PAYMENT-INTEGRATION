import dotenv from 'dotenv'
dotenv.config()

const variable = {
    PORT:parseInt(process.env.PORT as string),
    USERNAME:process.env.MYSQL_USERNAME as string,
    DB:process.env.MYSQL_DB as string,
    PASSWORD:process.env.MYSQL_PASSWORD as string,
    DB_PORT:parseInt(process.env.MYSQL_PORT as string),
    SECRETE:process.env.SECRETE_KEY as string,
    CLOUD_NAME: process.env.cloudName as string, 
    CLOUD_KEY: process.env.cloudKey as string, 
    CLOUD_SECRETE: process.env.cloudSecrete as string,
    API_KEY: process.env.KORAPAY_KEY as string
}

export default variable