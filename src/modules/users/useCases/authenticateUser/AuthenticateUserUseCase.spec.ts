import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUseUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUseUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should not be able to authenticate user if user doesn't exist", () => {
    expect(async () => {
      await authenticateUseUseCase.execute({
        email: "test@test.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate user if password doesn't match", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "test@test.com",
        password: await hash("1234", 8),
        name: "test",
      });

      await authenticateUseUseCase.execute({
        email: user.email,
        password: "12345",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to authenticate user", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      password: await hash("1234", 8),
      name: "test",
    });

    const userAuthenticated = await authenticateUseUseCase.execute({
      email: user.email,
      password: "1234",
    });

    expect(userAuthenticated.user).toHaveProperty("id");
    expect(userAuthenticated).toHaveProperty("token");
  });
});
