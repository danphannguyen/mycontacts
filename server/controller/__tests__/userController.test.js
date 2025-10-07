const userController = require("../userController");
const userService = require("../../services/userServices");

// 🔹 Mock complet du service
jest.mock("../../services/userServices");

describe("userController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // =====================================================
  // 🔸 register
  // =====================================================
  describe("register", () => {
    it("doit enregistrer un utilisateur avec succès", async () => {
      const fakeUser = { id: "u1", email: "test@example.com" };
      req.body = { email: "test@example.com", password: "123456" };

      userService.validateUserData.mockReturnValue();
      userService.createUser.mockResolvedValue(fakeUser);

      await userController.register(req, res, next);

      expect(userService.validateUserData).toHaveBeenCalledWith(req.body);
      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur créé avec succès",
        data: { user: fakeUser },
      });
    });

    it("doit appeler next(error) si le service échoue", async () => {
      const fakeError = new Error("Erreur création utilisateur");
      userService.createUser.mockRejectedValue(fakeError);

      await userController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });

  // =====================================================
  // 🔸 login
  // =====================================================
  describe("login", () => {
    it("doit authentifier un utilisateur et retourner un token", async () => {
      const fakeUser = { id: "u1", email: "user@example.com" };
      const fakeToken = "jwt_token_123";
      req.body = { email: "user@example.com", password: "secret" };

      userService.validateUserData.mockReturnValue();
      userService.authenticateUser.mockResolvedValue(fakeUser);
      userService.generateJwtToken.mockResolvedValue(fakeToken);

      await userController.login(req, res, next);

      expect(userService.validateUserData).toHaveBeenCalledWith(req.body);
      expect(userService.authenticateUser).toHaveBeenCalledWith(req.body);
      expect(userService.generateJwtToken).toHaveBeenCalledWith(fakeUser);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Utilisateur authentifié avec succès",
        jwtToken: fakeToken,
        data: { user: fakeUser },
      });
    });

    it("doit appeler next(error) si l’authentification échoue", async () => {
      const fakeError = new Error("Erreur authentification");
      userService.authenticateUser.mockRejectedValue(fakeError);

      await userController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });

    it("doit appeler next(error) si la génération du token échoue", async () => {
      const fakeUser = { id: "u1", email: "user@example.com" };
      const fakeError = new Error("Erreur token");
      req.body = { email: "user@example.com", password: "secret" };

      userService.validateUserData.mockReturnValue();
      userService.authenticateUser.mockResolvedValue(fakeUser);
      userService.generateJwtToken.mockRejectedValue(fakeError);

      await userController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });
});
