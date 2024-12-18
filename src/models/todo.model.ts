import { DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '@/lib/sequelize';
import User from './user.model';

type TodoStatus = 'pendiong' | 'in-progress' | 'completed';

interface TodoAttributes {
  id: string;
  title: string;
  status: TodoStatus;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoCreationAttributes
  extends Optional<TodoAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: TodoStatus;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate() {
    Todo.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

Todo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      field: 'user_id',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'Todo',
    tableName: 'todos',
  }
);

export default Todo;
