import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be able to create user if email already exists", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        email: "test@test.com",
        name: "test",
        password: "1234",
      });

      await createUserUseCase.execute({
        email: "test@test.com",
        name: "test231",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com",
      name: "test",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });
});
