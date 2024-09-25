import {Sequelize} from "sequelize"
import variable from '../envVariables/environment'

const sequelize = new Sequelize({
    username:variable.USERNAME,
    password:variable.PASSWORD,
    database:variable.DB,
    host:'127.0.0.1',
    dialect:'mysql'
})

export default sequelize