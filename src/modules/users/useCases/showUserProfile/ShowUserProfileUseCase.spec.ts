import { v4 as uuidv4 } from "uuid";

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should not be able to show user profile", async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute(uuidv4());
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to show user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "test@test.com",
      name: "test",
      password: "1234",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile).toHaveProperty("id");
  });
});
