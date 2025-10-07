const validators = require("../validators");

describe("validators", () => {
  // =====================================================
  // 🔸 validateEmail
  // =====================================================
  describe("validateEmail", () => {
    it("retourne valide pour un email correct", () => {
      const result = validators.validateEmail("test@example.com");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("retourne une erreur si l'email est vide", () => {
      const result = validators.validateEmail("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("L'email est requis");
    });

    it("retourne une erreur si le format est invalide", () => {
      const result = validators.validateEmail("invalid@");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Le format de l'email est invalide");
    });
  });

  // =====================================================
  // 🔸 validatePassword
  // =====================================================
  describe("validatePassword", () => {
    it("retourne valide pour un mot de passe fort correct", () => {
      const result = validators.validatePassword("Azerty1@", {
        minLength: 6,
        requireStrong: true,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("retourne une erreur si trop court", () => {
      const result = validators.validatePassword("Ab1@", { minLength: 6 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/au moins 6 caractères/);
    });

    it("retourne une erreur si trop long", () => {
      const longPwd = "a".repeat(25);
      const result = validators.validatePassword(longPwd, { maxLength: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/ne doit pas contenir plus de 20 caractères/);
    });

    it("retourne plusieurs erreurs pour un mot de passe faible", () => {
      const result = validators.validatePassword("aaaaaa", { requireStrong: true });
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "Le mot de passe doit contenir au moins une majuscule",
          "Le mot de passe doit contenir au moins un chiffre",
          "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)",
        ])
      );
    });
  });

  // =====================================================
  // 🔸 validateName
  // =====================================================
  describe("validateName", () => {
    it("retourne valide pour un prénom correct", () => {
      const result = validators.validateName("Jean", { type: "firstname" });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("retourne une erreur si vide et requis", () => {
      const result = validators.validateName("", { type: "lastname", required: true });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/Le lastname est requis/);
    });

    it("retourne une erreur si trop court", () => {
      const result = validators.validateName("J", { minLength: 2, type: "firstname" });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/au moins 2 caractères/);
    });

    it("retourne une erreur si trop long", () => {
      const longName = "A".repeat(40);
      const result = validators.validateName(longName, { maxLength: 30, type: "lastname" });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/ne peut pas dépasser 30 caractères/);
    });

    it("retourne une erreur si contient des caractères non autorisés", () => {
      const result = validators.validateName("Jean123", { type: "firstname" });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/ne peut contenir que des lettres/);
    });
  });

  // =====================================================
  // 🔸 validatePhone
  // =====================================================
  describe("validatePhone", () => {
    it("retourne valide pour un numéro correct", () => {
      const result = validators.validatePhone("+33 6 12 34 56 78");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("retourne une erreur si vide", () => {
      const result = validators.validatePhone("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Le numéro de téléphone est requis");
    });

    it("retourne une erreur si trop court", () => {
      const result = validators.validatePhone("12345", { minLength: 10 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/au moins 10 caractères/);
    });

    it("retourne une erreur si trop long", () => {
      const result = validators.validatePhone("0".repeat(25), { maxLength: 20 });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/plus de 20 caractères/);
    });

    it("retourne une erreur si format invalide", () => {
      const result = validators.validatePhone("123456789abc");
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/ne peut contenir que des chiffres/);
    });
  });
});
