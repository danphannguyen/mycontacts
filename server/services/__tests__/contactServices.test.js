const contactService = require("../contactServices");
const validators = require("../../utils/validators");
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} = require("../../utils/errors");
const Contact = require("../../models/Contact");

// 🔹 Mock des dépendances
jest.mock("../../utils/validators");
jest.mock("../../models/Contact");

describe("contactService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================================
  // 🔸 validateContactData
  // =====================================================
  describe("validateContactData", () => {
    it("doit lancer une erreur si tous les champs sont vides", () => {
      expect(() => contactService.validateContactData({})).toThrow(ValidationError);
    });

    it("doit valider correctement un prénom valide", () => {
      validators.validateName.mockReturnValue({ isValid: true, errors: [] });
      contactService.validateContactData({ firstname: "Jean" });
      expect(validators.validateName).toHaveBeenCalledWith("Jean", { type: "firstname" });
    });

    it("doit lancer une ValidationError si le téléphone est invalide", () => {
      validators.validatePhone.mockReturnValue({
        isValid: false,
        errors: ["Numéro invalide"],
      });

      expect(() =>
        contactService.validateContactData({ phone: "123abc" })
      ).toThrow(ValidationError);
    });
  });

  // =====================================================
  // 🔸 createContact
  // =====================================================
  describe("createContact", () => {
    it("doit créer et sauvegarder un contact correctement", async () => {
      const fakeContactData = { firstname: "Jean", lastname: "Dupont", phone: "0600000000" };
      const fakeUserData = { id: "user123", email: "user@test.com" };

      const mockSavedContact = {
        toObject: () => ({
          _id: "contact1",
          firstname: "Jean",
          lastname: "Dupont",
          phone: "0600000000",
          userId: "user123",
          createdAt: new Date(),
        }),
      };

      Contact.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedContact),
      }));

      const result = await contactService.createContact(fakeContactData, fakeUserData);

      expect(result).toMatchObject({
        _id: "contact1",
        firstname: "Jean",
        lastname: "Dupont",
        userId: "user123",
      });
    });
  });

  // =====================================================
  // 🔸 readContact
  // =====================================================
  describe("readContact", () => {
    it("doit renvoyer la liste des contacts", async () => {
      const fakeUser = { id: "user123" };
      const mockContacts = [{ _id: "c1" }, { _id: "c2" }];

      Contact.find.mockResolvedValue(mockContacts);

      const result = await contactService.readContact(fakeUser);
      expect(Contact.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(result).toEqual(mockContacts);
    });

    it("doit lancer NotFoundError si aucun contact trouvé", async () => {
      Contact.find.mockResolvedValue(null);

      await expect(contactService.readContact({ id: "u1" })).rejects.toThrow(NotFoundError);
    });
  });

  // =====================================================
  // 🔸 updateContact
  // =====================================================
  describe("updateContact", () => {
    it("doit mettre à jour un contact si autorisé", async () => {
      const fakeContact = {
        _id: "c1",
        userId: "u1",
        save: jest.fn().mockResolvedValue(true),
      };

      Contact.findById.mockResolvedValue(fakeContact);

      const result = await contactService.updateContact(
        { firstname: "Paul" },
        { id: "u1" },
        { id: "c1" }
      );

      expect(fakeContact.firstname).toBe("Paul");
      expect(fakeContact.save).toHaveBeenCalled();
      expect(result).toBe(fakeContact);
    });

    it("doit lancer ForbiddenError si le contact appartient à un autre utilisateur", async () => {
      const fakeContact = { userId: "autreUser" };
      Contact.findById.mockResolvedValue(fakeContact);

      await expect(
        contactService.updateContact({}, { id: "u1" }, { id: "c1" })
      ).rejects.toThrow(ForbiddenError);
    });

    it("doit lancer NotFoundError si le contact n’existe pas", async () => {
      Contact.findById.mockResolvedValue(null);

      await expect(
        contactService.updateContact({}, { id: "u1" }, { id: "c1" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  // =====================================================
  // 🔸 deleteContact
  // =====================================================
  describe("deleteContact", () => {
    it("doit supprimer un contact appartenant à l'utilisateur", async () => {
      const fakeContact = { _id: "c1", userId: "u1" };
      Contact.findById.mockResolvedValue(fakeContact);
      Contact.findByIdAndDelete.mockResolvedValue(fakeContact);

      const result = await contactService.deleteContact({ id: "u1" }, { id: "c1" });

      expect(Contact.findById).toHaveBeenCalledWith("c1");
      expect(Contact.findByIdAndDelete).toHaveBeenCalledWith("c1");
      expect(result).toEqual(fakeContact);
    });

    it("doit lancer ForbiddenError si l’utilisateur n’est pas propriétaire", async () => {
      Contact.findById.mockResolvedValue({ userId: "autreUser" });

      await expect(
        contactService.deleteContact({ id: "u1" }, { id: "c1" })
      ).rejects.toThrow(ForbiddenError);
    });

    it("doit lancer NotFoundError si le contact n’existe pas", async () => {
      Contact.findById.mockResolvedValue(null);

      await expect(
        contactService.deleteContact({ id: "u1" }, { id: "c1" })
      ).rejects.toThrow(NotFoundError);
    });
  });
});
