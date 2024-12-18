module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
};
