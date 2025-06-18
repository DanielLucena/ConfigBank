import { ExampleRepository } from "../repositories/exampleRepository";
import { exampleSchema, Example } from "../schemas/exampleSchema";

export class ExampleService {
  private exampleRepository: ExampleRepository;

  constructor() {
    this.exampleRepository = new ExampleRepository();
  }

  async getExampleById(id: number): Promise<Example | null> {
    const example = await this.exampleRepository.findById(id);
    return example;
  }

  async createExample(exampleData: Example): Promise<Example> {
    const parsedData = exampleSchema.parse(exampleData);

    const existingExample = await this.exampleRepository.findById(
      parsedData.id
    );
    if (existingExample) {
      throw new Error("Example with this ID already exists");
    }

    const allExamples = await this.exampleRepository.getAll();
    allExamples.push(parsedData);

    await this.exampleRepository.save(allExamples);
    return parsedData;
  }

  async getAllExamples(): Promise<Example[]> {
    return await this.exampleRepository.getAll();
  }

  async deleteExampleById(id: number): Promise<void> {
    await this.exampleRepository.removeById(id);
  }

  async updateExampleById(id: number, updatedExample: Example): Promise<void> {
    const parsedData = exampleSchema.parse(updatedExample);
    await this.exampleRepository.updateById(id, parsedData);
  }
}
