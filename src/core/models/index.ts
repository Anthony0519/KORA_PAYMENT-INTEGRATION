import { User } from './user';
import { Transaction } from './transaction';

// Define associations here
User.hasMany(Transaction);
Transaction.belongsTo(User);

// Export the models for use in other parts of your application
export { User, Transaction };