import User from '@/models/user.model';

export const createUser = async (data: { email: string; password: string }) => {
  const user = await User.create(data);

  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  return user;
};
