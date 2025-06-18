import { AccountService } from '../src/services/accountService';
import { AccountRepository } from '../src/repositories/accountRepository';
import { Account } from '../src/schemas/accountSchema';

import { jest } from '@jest/globals';

jest.mock('../src/repositories/accountRepository');

const MockedRepo = AccountRepository as jest.MockedClass<typeof AccountRepository>;

describe('AccountService', () => {
  let service: AccountService;
  let repo: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    repo = new MockedRepo() as jest.Mocked<AccountRepository>;
    service = new AccountService(repo);
  });

  describe('createAccount', () => {
  });

  describe('getAccount', () => {
    it('should return normal account', async () => {
      const account: Account = { number: 1, type: 'normal', balance: 1000 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.getAccount(1);

      expect(result).toEqual(account);
    });

    it('should return bonus account', async () => {
      const account: Account = { number: 1, type: 'bonus', balance: 1000 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.getAccount(1);

      expect(result).toEqual(account);
    });

    it('should return savings account', async () => {
      const account: Account = { number: 1, type: 'savings', balance: 1000 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(account);
        return Promise.resolve(null);
      });

      repo.getAll.mockResolvedValue([account]);
      repo.save.mockResolvedValue();

      const result = await service.getAccount(1);

      expect(result).toEqual(account);
    });

    it('should throw if account does not exist', async () => {
      repo.findByNumber.mockResolvedValue(null);
      await expect(service.getAccount(8)).rejects.toThrow(
        "There is no account with number 8"
      );
    });
  });

  describe('getBalance', () => {
  });

  describe('debitFromAccount', () => {
  });

  describe('creditToAccount', () => {
  });

  describe('transferBetweenAccounts', () => {
    it('should transfer funds between normal accounts', async () => {
      const sender: Account = { number: 1, type: 'normal', balance: 1000 };
      const receiver: Account = { number: 2, type: 'normal', balance: 500 };
      const amount = 200;

      const debitedSender = { ...sender, balance: 800 };
      const creditedReceiver = { ...receiver, balance: 700 };

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(debitedSender);
        if (num === 2) return Promise.resolve(creditedReceiver);
        return Promise.resolve(null);
      });

      service.debitFromAccount = jest.fn(async () => debitedSender) as AccountService['debitFromAccount'];
      service.creditToAccount = jest.fn(async () => creditedReceiver) as AccountService['creditToAccount'];

      repo.getAll.mockResolvedValue([debitedSender, creditedReceiver]);
      repo.save.mockResolvedValue();

      const result = await service.transferBetweenAccounts(1, 2, amount);

      expect(service.debitFromAccount).toHaveBeenCalledWith(1, amount);
      expect(service.creditToAccount).toHaveBeenCalledWith(2, amount, true);
      expect(result).toEqual({ from: debitedSender, to: creditedReceiver });
    });

    it('should apply bonus points if receiver is bonus account', async () => {
      const sender: Account = { number: 1, type: 'normal', balance: 1000 };
      const receiver: Account = { number: 2, type: 'bonus', balance: 100, points: 10 };
      const amount = 300;

      const debitedSender = { ...sender, balance: 700 };
      const creditedReceiver = { ...receiver, balance: 400, points: 10 }; // antes do bônus

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(debitedSender);
        if (num === 2) return Promise.resolve(creditedReceiver);
        return Promise.resolve(null);
      });

      service.debitFromAccount = jest.fn(async () => debitedSender) as AccountService['debitFromAccount'];
      service.creditToAccount = jest.fn(async () => creditedReceiver) as AccountService['creditToAccount'];

      repo.getAll.mockResolvedValue([debitedSender, creditedReceiver]);
      repo.save.mockResolvedValue();

      const finalReceiver = { ...creditedReceiver, points: 12 }; // 300 / 150 = 2 bônus
      repo.findByNumber.mockResolvedValue(finalReceiver);

      const result = await service.transferBetweenAccounts(1, 2, amount);

      expect(repo.save).toHaveBeenCalledWith([
        { number: 1, type: 'normal', balance: 700 },
        { number: 2, type: 'bonus', balance: 400, points: 12 },
      ]);

      expect(result).toEqual({ from: debitedSender, to: finalReceiver });
    });

    it('should throw if transfer amount is negative or zero', async () => {
      await expect(service.transferBetweenAccounts(1, 2, -100)).rejects.toThrow(
        "Transfer amount must be greater than zero"
      );
      await expect(service.transferBetweenAccounts(1, 2, 0)).rejects.toThrow(
        "Transfer amount must be greater than zero"
      );
    });

    it('should throw if sender balance would exceed negative limit for normal and bonus accounts', async () => {
      const sender: Account = { number: 1, type: 'normal', balance: -900 };
      const receiver: Account = { number: 2, type: 'normal', balance: 500 };
      const amount = 200;

      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(sender);
        if (num === 2) return Promise.resolve(receiver);
        return Promise.resolve(null);
      });

      await expect(service.transferBetweenAccounts(1, 2, amount)).rejects.toThrow(
        "This operation would exceed the negative balance limit of R$ -1.000,00"
      );
    });

    it('should throw if sender balance is insufficient for savings account', async () => {
      const sender: Account = { number: 1, type: 'savings', balance: 100 };
      const receiver: Account = { number: 2, type: 'normal', balance: 500 };
      const amount = 200;
      
      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(sender);
        if (num === 2) return Promise.resolve(receiver);
        return Promise.resolve(null);
      });
      await expect(service.transferBetweenAccounts(1, 2, amount)).rejects.toThrow(
        "Insufficient funds"
      );
    });

    it('should throw if sender does not exist', async () => {
      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve(null); // sender não existe
        return Promise.resolve({ number: 2, type: 'normal', balance: 100 });
      });

      await expect(service.transferBetweenAccounts(1, 2, 50)).rejects.toThrow(
        'There is no account with number 1'
      );
    });

    it('should throw if receiver does not exist', async () => {
      repo.findByNumber.mockImplementation((num: number) => {
        if (num === 1) return Promise.resolve({ number: 1, type: 'normal', balance: 1000 });
        return Promise.resolve(null); // receiver não existe
      });

      await expect(service.transferBetweenAccounts(1, 2, 50)).rejects.toThrow(
        'There is no account with number 1'
      );
    });
  });

  describe('earnInterest', () => {
  });
});