import { IUser } from "@/types";

export class User implements IUser {
  constructor(
    public id: string,
    public email: string,
    public wallets: Wallet[],
    public verifiedCredentials: VerifiedCredential[],
    public worldIdVerified: boolean,
    public alias: string,
    public firstName: string,
    public lastName: string,
    public username: string | null,
    public metadata: Record<string, unknown>,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromDynamic(dynamicUser: any): User {
    return new User(
      dynamicUser.id,
      dynamicUser.email,
      dynamicUser.wallets.map(Wallet.fromDynamic),
      dynamicUser.verifiedCredentials.map(VerifiedCredential.fromDynamic),
      dynamicUser.worldIdVerified || false,
      dynamicUser.alias,
      dynamicUser.firstName,
      dynamicUser.lastName,
      dynamicUser.username,
      dynamicUser.metadata,
      new Date(dynamicUser.createdAt),
      new Date(dynamicUser.updatedAt)
    );
  }

  toDatabase(): any {
    return {
      id: this.id,
      email: this.email,
      wallets: this.wallets.map((w) => w.toDatabase()),
      verified_credentials: this.verifiedCredentials.map((vc) =>
        vc.toDatabase()
      ),
      world_id_verified: this.worldIdVerified,
      alias: this.alias,
      first_name: this.firstName,
      last_name: this.lastName,
      username: this.username,
      metadata: this.metadata,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  static fromDatabase(data: any): User {
    return new User(
      data.id,
      data.email,
      data.wallets.map(Wallet.fromDatabase),
      data.verified_credentials.map(VerifiedCredential.fromDatabase),
      data.world_id_verified,
      data.alias,
      data.first_name,
      data.last_name,
      data.username,
      data.metadata,
      data.created_at,
      data.updated_at
    );
  }
}

export class Wallet {
  constructor(
    public id: string,
    public name: string,
    public chain: string,
    public publicKey: string,
    public provider: string
  ) {}

  static fromDynamic(dynamicWallet: any): Wallet {
    return new Wallet(
      dynamicWallet.id,
      dynamicWallet.name,
      dynamicWallet.chain,
      dynamicWallet.publicKey,
      dynamicWallet.provider
    );
  }

  toDatabase(): any {
    return {
      id: this.id,
      name: this.name,
      chain: this.chain,
      public_key: this.publicKey,
      provider: this.provider,
    };
  }

  static fromDatabase(data: any): Wallet {
    return new Wallet(
      data.id,
      data.name,
      data.chain,
      data.public_key,
      data.provider
    );
  }
}

export class VerifiedCredential {
  constructor(
    public id: string,
    public address: string,
    public chain: string,
    public format: string,
    public publicIdentifier: string
  ) {}

  static fromDynamic(dynamicVC: any): VerifiedCredential {
    return new VerifiedCredential(
      dynamicVC.id,
      dynamicVC.address,
      dynamicVC.chain,
      dynamicVC.format,
      dynamicVC.public_identifier
    );
  }

  toDatabase(): any {
    return {
      id: this.id,
      address: this.address,
      chain: this.chain,
      format: this.format,
      public_identifier: this.publicIdentifier,
    };
  }

  static fromDatabase(data: any): VerifiedCredential {
    return new VerifiedCredential(
      data.id,
      data.address,
      data.chain,
      data.format,
      data.public_identifier
    );
  }
}
