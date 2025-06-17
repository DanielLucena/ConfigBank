import { ExampleService } from "../src/services/exampleService";
import { ExampleRepository } from "../src/repositories/exampleRepository";

describe("Testing example service", () => {
  beforeEach(() => {
    // Reset any necessary state or mocks before each test
    const exampleRepository = new ExampleRepository();
    exampleRepository.clear();
  });
  test("should create a new example", async () => {
    const exampleService = new ExampleService();
    const exampleData = { id: 1, name: "Test Example" };

    const createdExample = await exampleService.createExample(exampleData);
    expect(createdExample).toEqual(exampleData);
  });

  test("should not allow creating an example with an existing ID", async () => {
    const exampleService = new ExampleService();
    const exampleData = { id: 1, name: "Test Example" };
    await exampleService.createExample(exampleData);
    await expect(exampleService.createExample(exampleData)).rejects.toThrow(
      "Example with this ID already exists"
    );
  });

  test("should retrieve an example by ID", async () => {
    const exampleService = new ExampleService();
    const exampleData = { id: 2, name: "Another Example" };

    await exampleService.createExample(exampleData);
    const retrievedExample = await exampleService.getExampleById(2);

    expect(retrievedExample).toEqual(exampleData);
  });

  test("should return null for a non-existing example ID", async () => {
    const exampleService = new ExampleService();
    const retrievedExample = await exampleService.getExampleById(999);

    expect(retrievedExample).toBeNull();
  });

  test("should update an existing example by ID", async () => {
    const exampleService = new ExampleService();
    const exampleData = { id: 3, name: "Old Example" };
    await exampleService.createExample(exampleData);

    const updatedData = { id: 3, name: "Updated Example" };
    await exampleService.updateExampleById(3, updatedData);

    const updatedExample = await exampleService.getExampleById(3);
    expect(updatedExample).toEqual({ id: 3, name: "Updated Example" });
  });

  test("should delete an example by ID", async () => {
    const exampleService = new ExampleService();
    const exampleData = { id: 4, name: "Example to Delete" };
    await exampleService.createExample(exampleData);

    await exampleService.deleteExampleById(4);
    const deletedExample = await exampleService.getExampleById(4);

    expect(deletedExample).toBeNull();
  });

  afterEach(() => {
    // Reset any necessary state or mocks after each test
    const exampleRepository = new ExampleRepository();
    exampleRepository.clear();
  });
});
