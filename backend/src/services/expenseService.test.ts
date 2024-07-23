import { ExpenseService } from "./expenseService";
import { GroupService } from "./groupService";
import { ExpenseRepository } from "../repositories/expenseRepository";
import { Expense, Group } from "../type";

describe("ExpenseService", () => {
  let mockGroupService: Partial<GroupService>;
  let mockExpenseRepository: Partial<ExpenseRepository>;
  let expenseService: ExpenseService;

  const group: Group = { name: "group1", members: ["一郎", "二郎"] };
  const expense: Expense = {
    groupName: "group1",
    expenseName: "ランチ",
    amount: 2000,
    payer: "一郎",
  };

  beforeEach(() => {
    mockGroupService = {
      getGroupByName: jest.fn(),
    };
    mockExpenseRepository = {
      loadExpenses: jest.fn(),
      saveExpense: jest.fn(),
    };
    expenseService = new ExpenseService(
      mockExpenseRepository as ExpenseRepository,
      mockGroupService as GroupService
    );
  });
  describe("addExpense", () => {
    it("支出が登録される", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(group);
      expenseService.addExpense(expense);
      expect(mockExpenseRepository.saveExpense).toHaveBeenCalledWith(expense);
    });

    it("グループが存在しない場合はエラーが発生する", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(null);
      expect(() => {
        expenseService.addExpense(expense);
      }).toThrowError();
    });

    it("支払い者がグループに存在しない場合はエラーが発生する", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(group);
      const nonMemberExpense: Expense = { ...expense, payer: "太郎" };
      expect(() => {
        expenseService.addExpense(nonMemberExpense);
      }).toThrowError();
    });
  });
});
