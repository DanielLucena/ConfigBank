import fs from "fs/promises";
import path from "path";
import { Example } from "../schemas/exampleSchema";

const dataFile = path.resolve(__dirname, "../../data/example.json");

export class ExampleRepository {
  async getAll(): Promise<Example[]> {
    const content = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(content) as Example[];
  }

  async save(example: Example[]): Promise<void> {
    await fs.writeFile(dataFile, JSON.stringify(example, null, 2));
  }

  async findById(id: number): Promise<Example | null> {
    const example = await this.getAll();
    return example.find((ex) => ex.id === id) || null;
  }

  async removeById(id: number): Promise<void> {
    const example = await this.getAll();
    const filteredExamples = example.filter((ex) => ex.id !== id);
    await this.save(filteredExamples);
  }

  async updateById(id: number, updatedExample: Example): Promise<void> {
    const examples = await this.getAll();
    const index = examples.findIndex((ex) => ex.id === id);

    if (index !== -1) {
      examples[index] = { ...examples[index], ...updatedExample };
      await this.save(examples);
    } else {
      throw new Error("Example not found");
    }
  }

  async clear(): Promise<void> {
    await this.save([]);
  }
}
