module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "jest-transform-stub"
  },
  moduleFileExtensions: ['js', 'jsx'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy"
  },
  moduleDirectories: ["node_modules", "src"],
};
