import { UserVersionNotFoundError } from "../errors/domain.error";

// --- Enums and Types ---
export type UserRole = "Admin" | "Editor" | "Viewer";
export type UserAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "manage_users";

// --- Strategy Pattern (Permissions) ---

export interface PermissionStrategy {
  canPerform(action: UserAction): boolean;
}

class AdminPermissionStrategy implements PermissionStrategy {
  canPerform(action: UserAction): boolean {
    return true; // Admin can do everything
  }
}

class EditorPermissionStrategy implements PermissionStrategy {
  canPerform(action: UserAction): boolean {
    const allowedActions: UserAction[] = ["create", "read", "update"];
    return allowedActions.includes(action);
  }
}

class ViewerPermissionStrategy implements PermissionStrategy {
  canPerform(action: UserAction): boolean {
    return action === "read";
  }
}

// --- Composite Pattern (User Hierarchy) ---

export interface UserComponent {
  id: string;
  name: string;
  display(): void;
}

// --- User Model ---

export class User implements UserComponent {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  private permissionStrategy: PermissionStrategy;
  private subordinates: UserComponent[] = [];

  constructor(props: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
    this.createdAt = props.createdAt || new Date();
    this.permissionStrategy = this.setPermissionStrategy(props.role);
  }

  private setPermissionStrategy(role: UserRole): PermissionStrategy {
    switch (role) {
      case "Admin":
        return new AdminPermissionStrategy();
      case "Editor":
        return new EditorPermissionStrategy();
      case "Viewer":
        return new ViewerPermissionStrategy();
      default:
        return new ViewerPermissionStrategy();
    }
  }

  can(action: UserAction): boolean {
    return this.permissionStrategy.canPerform(action);
  }

  // Composite methods
  add(component: UserComponent): void {
    this.subordinates.push(component);
  }

  remove(component: UserComponent): void {
    const index = this.subordinates.findIndex((c) => c.id === component.id);
    if (index !== -1) {
      this.subordinates.splice(index, 1);
    }
  }

  display(): void {
    console.log(`User: ${this.name} (${this.role})`);
    this.subordinates.forEach((subordinate) => subordinate.display());
  }

  getSubordinates(): UserComponent[] {
    return this.subordinates;
  }
}

// --- Factory Pattern (User Creation) ---

export class UserFactory {
  private static userVersions: { [version: string]: any } = {
    "1.0": User,
  };

  static create(
    props: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    },
    version: string = "1.0"
  ): User {
    const UserClass = this.userVersions[version];
    if (!UserClass) {
      throw new UserVersionNotFoundError(version);
    }
    return new UserClass(props);
  }
}

// I can also add a UserGroup for the composite pattern to be more complete.

export class UserGroup implements UserComponent {
  id: string;
  name: string;
  private members: UserComponent[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  add(component: UserComponent): void {
    this.members.push(component);
  }

  remove(component: UserComponent): void {
    const index = this.members.findIndex((c) => c.id === component.id);
    if (index !== -1) {
      this.members.splice(index, 1);
    }
  }

  display(): void {
    console.log(`Group: ${this.name}`);
    this.members.forEach((member) => member.display());
  }

  getMembers(): UserComponent[] {
    return this.members;
  }
}
