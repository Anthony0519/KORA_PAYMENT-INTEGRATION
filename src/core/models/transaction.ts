import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { TransactionAttributes } from "../interfaces/transaction";
import sequelize from '../config/dbConnect'

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<
    Transaction,
    { omit: 'id' | 'sender' | 'receipient' | 'receipient_account' | 'receipient_bank' | 'type' | 'currency' }
  >
> implements TransactionAttributes {
  declare id: CreationOptional<number>
  declare userId: number;
  declare amount: number;
  declare status: string;
  declare currency: string;
  declare transaction_reference: string;
  declare DateTime: string;
  declare type: string;
  declare sender: string;
  declare receipient: string;
  declare receipient_bank: string;
  declare receipient_account: string;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    transaction_reference: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    DateTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receipient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receipient_bank: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receipient_account: {
      type: DataTypes.STRING,
      allowNull: true
    },

  },
  {
    sequelize,
    tableName: 'Transactions',
    timestamps: true,
  }
)