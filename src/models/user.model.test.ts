import { UserVersionNotFoundError } from "../errors/domain.error";
import {
  UserFactory,
  User,
  UserRole,
  UserAction,
  UserGroup,
} from "./user.model";

describe("User Model with Design Patterns", () => {
  // Test Factory Pattern
  describe("UserFactory", () => {
    it("should create a user with the specified properties", () => {
      const userData = {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin" as UserRole,
      };
      const user = UserFactory.create(userData);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe("1");
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john.doe@example.com");
      expect(user.role).toBe("Admin");
    });

    it("should throw an UserVersionNotFoundError for an unknown user version", () => {
      const userData = {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin" as UserRole,
      };

      expect(() => UserFactory.create(userData, "2.0")).toThrow(
        new UserVersionNotFoundError("2.0")
      );
    });
  });

  // Test Strategy Pattern
  describe("Permission Strategy", () => {
    it("Admin should have all permissions", () => {
      const admin = UserFactory.create({
        id: "1",
        name: "Admin User",
        email: "admin@test.com",
        role: "Admin",
      });
      expect(admin.can("create")).toBe(true);
      expect(admin.can("read")).toBe(true);
      expect(admin.can("update")).toBe(true);
      expect(admin.can("delete")).toBe(true);
      expect(admin.can("manage_users")).toBe(true);
    });

    it("Editor should have create, read, and update permissions", () => {
      const editor = UserFactory.create({
        id: "2",
        name: "Editor User",
        email: "editor@test.com",
        role: "Editor",
      });
      expect(editor.can("create")).toBe(true);
      expect(editor.can("read")).toBe(true);
      expect(editor.can("update")).toBe(true);
      expect(editor.can("delete")).toBe(false);
      expect(editor.can("manage_users")).toBe(false);
    });

    it("Viewer should only have read permission", () => {
      const viewer = UserFactory.create({
        id: "3",
        name: "Viewer User",
        email: "viewer@test.com",
        role: "Viewer",
      });
      expect(viewer.can("create")).toBe(false);
      expect(viewer.can("read")).toBe(true);
      expect(viewer.can("update")).toBe(false);
      expect(viewer.can("delete")).toBe(false);
      expect(viewer.can("manage_users")).toBe(false);
    });
  });

  // Test Composite Pattern
  describe("User Hierarchy (Composite)", () => {
    let manager: User;
    let subordinate1: User;
    let subordinate2: User;
    let group: UserGroup;
    let groupMember: User;

    beforeEach(() => {
      manager = UserFactory.create({
        id: "m1",
        name: "Manager",
        email: "manager@test.com",
        role: "Admin",
      });
      subordinate1 = UserFactory.create({
        id: "s1",
        name: "Subordinate 1",
        email: "sub1@test.com",
        role: "Editor",
      });
      subordinate2 = UserFactory.create({
        id: "s2",
        name: "Subordinate 2",
        email: "sub2@test.com",
        role: "Viewer",
      });
      group = new UserGroup("g1", "Developers");
      groupMember = UserFactory.create({
        id: "gm1",
        name: "Group Member",
        email: "gm1@test.com",
        role: "Editor",
      });
    });

    it("should allow a user to manage subordinates", () => {
      manager.add(subordinate1);
      manager.add(subordinate2);

      const subordinates = manager.getSubordinates();
      expect(subordinates).toHaveLength(2);
      expect(subordinates).toContain(subordinate1);
      expect(subordinates).toContain(subordinate2);

      manager.remove(subordinate1);
      expect(manager.getSubordinates()).toHaveLength(1);
      expect(manager.getSubordinates()).not.toContain(subordinate1);
    });

    it("should allow creating a group of users", () => {
      group.add(groupMember);
      group.add(subordinate1);

      const members = group.getMembers();
      expect(members).toHaveLength(2);
      expect(members).toContain(groupMember);
      expect(members).toContain(subordinate1);

      group.remove(groupMember);
      expect(group.getMembers()).toHaveLength(1);
      expect(group.getMembers()).not.toContain(groupMember);
    });

    it("should allow a user to manage a group as a subordinate", () => {
      group.add(groupMember);
      manager.add(group);
      manager.add(subordinate1);

      const subordinates = manager.getSubordinates();
      expect(subordinates).toHaveLength(2);
      expect(subordinates).toContain(group);
      expect(subordinates).toContain(subordinate1);
    });
  });
});
