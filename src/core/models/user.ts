import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { UserAttributes } from "../interfaces/user";
import sequelize from '../config/dbConnect'

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<
        User,
        { omit: 'id' | 'isVerified' | 'isAdmin' | 'balance' }
    >
> implements UserAttributes {
    declare id: CreationOptional<number>;
    declare fullName: string;
    declare email: string;
    declare phone: number;
    declare balance: number;
    declare image?: string;
    declare password: string;
    declare isVerified: boolean;
    declare isAdmin: boolean;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        balance: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
    },
    {
        sequelize,
        tableName: 'users'
    }
)