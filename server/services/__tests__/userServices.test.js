require("dotenv").config();
const userService = require("../userServices");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validators = require("../../utils/validators");
const {
  ValidationError,
  ConflictError,
  NotFoundError,
  AuthError,
} = require("../../utils/errors");

// 🔹 Mock de toutes les dépendances
jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../utils/validators");

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // 🔸 validateUserData
  // =====================================================
  describe("validateUserData", () => {
    it("valide correctement un email et un mot de passe valides", () => {
      validators.validateEmail.mockReturnValue({ isValid: true, errors: [] });
      validators.validatePassword.mockReturnValue({ isValid: true, errors: [] });

      expect(() =>
        userService.validateUserData({ email: "test@example.com", password: "Strong123!" })
      ).not.toThrow();
    });

    it("lance ValidationError si email invalide", () => {
      validators.validateEmail.mockReturnValue({
        isValid: false,
        errors: ["Email invalide"],
      });
      validators.validatePassword.mockReturnValue({ isValid: true, errors: [] });

      expect(() =>
        userService.validateUserData({ email: "bad", password: "Strong123!" })
      ).toThrow(ValidationError);
    });

    it("lance ValidationError si mot de passe faible", () => {
      validators.validateEmail.mockReturnValue({ isValid: true, errors: [] });
      validators.validatePassword.mockReturnValue({
        isValid: false,
        errors: ["Mot de passe trop faible"],
      });

      expect(() =>
        userService.validateUserData({ email: "a@a.com", password: "123" })
      ).toThrow(ValidationError);
    });
  });

  // =====================================================
  // 🔸 createUser
  // =====================================================
  describe("createUser", () => {
    it("crée un utilisateur avec un mot de passe hashé", async () => {
      const fakeUserData = { email: "user@test.com", password: "Strong123!" };
      const fakeSavedUser = {
        toObject: () => ({
          _id: "u1",
          email: "user@test.com",
          createdAt: new Date(),
        }),
      };

      // Mock : aucun utilisateur existant
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(fakeSavedUser),
      }));

      const result = await userService.createUser(fakeUserData);

      expect(User.findOne).toHaveBeenCalledWith({ email: "user@test.com" });
      expect(bcrypt.hash).toHaveBeenCalledWith("Strong123!", 12);
      expect(result).toMatchObject({ _id: "u1", email: "user@test.com" });
    });

    it("lance ConflictError si un utilisateur existe déjà", async () => {
      User.findOne.mockResolvedValue({ _id: "existingUser" });

      await expect(
        userService.createUser({ email: "already@test.com", password: "Strong123!" })
      ).rejects.toThrow(ConflictError);
    });
  });

  // =====================================================
  // 🔸 authenticateUser
  // =====================================================
  describe("authenticateUser", () => {
    it("authentifie un utilisateur valide", async () => {
      const fakeUser = {
        password: "hashedPassword",
        toObject: () => ({ _id: "u1", email: "user@test.com" }),
      };

      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userService.authenticateUser({
        email: "user@test.com",
        password: "Strong123!",
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: "user@test.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("Strong123!", "hashedPassword");
      expect(result).toMatchObject({ _id: "u1", email: "user@test.com" });
    });

    it("lance NotFoundError si aucun utilisateur trouvé", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        userService.authenticateUser({ email: "nope@test.com", password: "pass" })
      ).rejects.toThrow(NotFoundError);
    });

    it("lance AuthError si mot de passe incorrect", async () => {
      User.findOne.mockResolvedValue({ password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.authenticateUser({ email: "user@test.com", password: "wrongpass" })
      ).rejects.toThrow(AuthError);
    });
  });

  // =====================================================
  // 🔸 generateJwtToken
  // =====================================================
  describe("generateJwtToken", () => {
    it("génère un token JWT valide", async () => {
      process.env.JWT_SECRET = "test_secret";
      jwt.sign.mockReturnValue("fake.jwt.token");

      const fakeUser = { _id: "u123", email: "user@test.com" };

      const token = await userService.generateJwtToken(fakeUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "u123", email: "user@test.com" },
        "test_secret",
        { expiresIn: "2h" }
      );
      expect(token).toBe("fake.jwt.token");
    });
  });
});
