import { Request, Response } from "express";
import { ExampleService } from "../services/exampleService";

export class ExampleController {
  private exampleService: ExampleService;

  constructor() {
    this.exampleService = new ExampleService();
  }

  async getExampleById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const example = await this.exampleService.getExampleById(id);

    if (example) {
      res.status(200).json(example);
    } else {
      res.status(404).json({ message: "Example not found" });
    }
  }

  async createExample(req: Request, res: Response): Promise<void> {
    try {
      const exampleData = req.body;
      const newExample = await this.exampleService.createExample(exampleData);
      res.status(201).json(newExample);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllExamples(req: Request, res: Response): Promise<void> {
    try {
      const examples = await this.exampleService.getAllExamples();
      res.status(200).json(examples);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async deleteExampleById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const example = await this.exampleService.getExampleById(id);

    if (example) {
      await this.exampleService.deleteExampleById(id);
      res.status(200).json({ message: "Example deleted successfully" });
    } else {
      res.status(404).json({ message: "Example not found" });
    }
  }
  
  async updateExampleById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const updatedExampleData = req.body;

    try {
      await this.exampleService.updateExampleById(id, updatedExampleData);
      res.status(200).json({ message: "Example updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  }
}