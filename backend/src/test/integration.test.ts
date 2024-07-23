import express from "express";
import request from "supertest";
import fs from "fs";
import { createApp } from "../app";
import { Expense, Group } from "../type";

const GROUP_FILE_PATH = "../data/integration/groups.json";
const EXPENSE_FILE_PATH = "../data/integration/expenses.json";

const testGroups: Group[] = [
  {
    name: "group1",
    members: ["一郎", "二郎", "三郎"],
  },
  {
    name: "group2",
    members: ["太郎", "花子"],
  },
];
const testExpenses: Expense[] = [
  {
    groupName: "group1",
    expenseName: "ランチ",
    payer: "一郎",
    amount: 1000,
  },
];

describe("integration test", () => {
  let app: express.Express;
  beforeEach(() => {
    fs.writeFileSync(GROUP_FILE_PATH, JSON.stringify(testGroups));
    fs.writeFileSync(EXPENSE_FILE_PATH, JSON.stringify(testExpenses));

    app = createApp(GROUP_FILE_PATH, EXPENSE_FILE_PATH);
  });

  describe("GET /groups", () => {
    it("すべてのグループが取得できる", async () => {
      const response = await request(app).get("/groups");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testGroups);
    });
  });

  describe("POST /groups", () => {
    it("グループが追加できる", async () => {
      const group: Group = { name: "group3", members: ["Ken", "Bob"] };
      const response = await request(app).post("/groups").send(group);
      expect(response.status).toBe(200);
      expect(response.text).toBe("グループの作成が成功しました");
    });
  });
});
