import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferBalanceError {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class UserToTransferNotFound extends AppError {
    constructor() {
      super("User to transfer not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 400);
    }
  }

  export class InsufficientTransferAmount extends AppError {
    constructor() {
      super("Insufficient transfer amount", 400);
    }
  }
}
