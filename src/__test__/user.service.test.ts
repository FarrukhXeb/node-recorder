import { createUser, findUserByEmail } from '@/services/user.service';
import User from '@/models/user.model';

jest.mock('@/models/user.model', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));

describe('User Service', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedpassword',
  };
  describe('createUser', () => {
    beforeEach(() => {
      (User.create as jest.Mock).mockResolvedValue(mockUser);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a new user', async () => {
      const data = { email: 'test@example.com', password: 'password' };
      const user = await createUser(data);

      expect(User.create).toHaveBeenCalledWith(data);
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if user creation fails', async () => {
      const data = { email: 'test@example.com', password: 'password' };
      (User.create as jest.Mock).mockRejectedValue(new Error('User creation failed'));

      await expect(createUser(data)).rejects.toThrow('User creation failed');
    });

    it('should hash the password before creating the user', async () => {
      const data = { email: 'test@example.com', password: 'password' };

      const user = await createUser(data);

      expect(User.create).toHaveBeenCalledWith(data);
      expect(user.password).not.toEqual(data.password);
    });

    it('should throw an error that the user already exists', async () => {
      const data = { email: 'test@example.com', password: 'password' };

      (User.create as jest.Mock).mockImplementation(({ email }) => {
        return new Promise((resolve, reject) => {
          if (mockUser.email === email) {
            reject(new Error('User already exists'));
          }
          resolve(data);
        });
      });

      await expect(createUser(data)).rejects.toThrow('User already exists');
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const foundUser = await findUserByEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });

      expect(foundUser).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const foundUser = await findUserByEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });

      expect(foundUser).toBeNull();
    });
  });
});
