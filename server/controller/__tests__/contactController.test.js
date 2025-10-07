const contactController = require("../contactController");
const contactService = require("../../services/contactServices");

// 🔹 Mock du service complet
jest.mock("../../services/contactServices.js");

describe("contactController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: "user123", email: "user@test.com" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // =====================================================
  // 🔸 createContact
  // =====================================================
  describe("createContact", () => {
    it("doit créer un contact avec succès", async () => {
      const fakeContact = { id: "c1", firstname: "Jean" };
      req.body = { firstname: "Jean" };

      contactService.validateContactData.mockReturnValue();
      contactService.createContact.mockResolvedValue(fakeContact);

      await contactController.createContact(req, res, next);

      expect(contactService.validateContactData).toHaveBeenCalledWith(req.body);
      expect(contactService.createContact).toHaveBeenCalledWith(req.body, req.user);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Contact créé avec succès",
        data: { contact: fakeContact },
      });
    });

    it("doit appeler next(error) en cas d’erreur", async () => {
      const fakeError = new Error("Erreur création");
      contactService.createContact.mockRejectedValue(fakeError);

      await contactController.createContact(req, res, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });

  // =====================================================
  // 🔸 getContact
  // =====================================================
  describe("getContact", () => {
    it("doit retourner la liste des contacts", async () => {
      const fakeContacts = [{ id: "c1" }, { id: "c2" }];
      contactService.readContact.mockResolvedValue(fakeContacts);

      await contactController.getContact(req, res, next);

      expect(contactService.readContact).toHaveBeenCalledWith(req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Liste des contacts récupérée avec succès",
        data: fakeContacts,
      });
    });

    it("doit appeler next(error) en cas d’erreur", async () => {
      const fakeError = new Error("Erreur récupération");
      contactService.readContact.mockRejectedValue(fakeError);

      await contactController.getContact(req, res, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });

  // =====================================================
  // 🔸 updateContact
  // =====================================================
  describe("updateContact", () => {
    it("doit mettre à jour un contact", async () => {
      const fakeUpdatedContact = { id: "c1", firstname: "Paul" };
      req.body = { firstname: "Paul" };
      req.params = { id: "c1" };

      contactService.validateContactData.mockReturnValue();
      contactService.updateContact.mockResolvedValue(fakeUpdatedContact);

      await contactController.updateContact(req, res, next);

      expect(contactService.validateContactData).toHaveBeenCalledWith(req.body);
      expect(contactService.updateContact).toHaveBeenCalledWith(
        req.body,
        req.user,
        req.params
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Liste des contacts récupérée avec succès",
        data: fakeUpdatedContact,
      });
    });

    it("doit appeler next(error) si le service échoue", async () => {
      const fakeError = new Error("Erreur mise à jour");
      contactService.updateContact.mockRejectedValue(fakeError);

      await contactController.updateContact(req, res, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });

  // =====================================================
  // 🔸 deleteContact
  // =====================================================
  describe("deleteContact", () => {
    it("doit supprimer un contact avec succès", async () => {
      const fakeDeleted = { id: "c1" };
      req.params = { id: "c1" };

      contactService.deleteContact.mockResolvedValue(fakeDeleted);

      await contactController.deleteContact(req, res, next);

      expect(contactService.deleteContact).toHaveBeenCalledWith(req.user, req.params);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Contact supprimé avec succès",
        data: fakeDeleted,
      });
    });

    it("doit appeler next(error) en cas d’échec", async () => {
      const fakeError = new Error("Erreur suppression");
      contactService.deleteContact.mockRejectedValue(fakeError);

      await contactController.deleteContact(req, res, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });
});
