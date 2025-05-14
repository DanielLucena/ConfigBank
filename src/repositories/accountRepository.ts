import fs from "fs/promises";
import path from "path";
import { Account } from "../schemas/accountSchema";

const dataFile = path.resolve(__dirname, "../../data/accounts.json");

export class AccountRepository {
  async getAll(): Promise<Account[]> {
    const content = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(content) as Account[];
  }

  async save(accounts: Account[]): Promise<void> {
    await fs.writeFile(dataFile, JSON.stringify(accounts, null, 2));
  }

  async findByNumber(number: number): Promise<Account | null> {
    const accounts = await this.getAll();
    return accounts.find(acc => acc.number === number) || null;
  }
}