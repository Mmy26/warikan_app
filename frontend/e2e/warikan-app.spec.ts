import { test, expect } from "@playwright/test";
import axios from "axios";

test.describe("割り勘アプリ", () => {
  test.beforeEach(async ({ page }) => {
    await axios.get("http://localhost:3000/init/");
    await page.goto("http://localhost:3001");
  });

  test.describe("グループ作成", () => {
    test("グループが作成され支出登録ページに遷移する", async ({ page }) => {
      const groupNameInput = page.getByLabel("グループ名");
      await groupNameInput.fill("group1");
      const memberListInput = page.getByLabel("メンバー");
      await memberListInput.fill("太郎, 花子");

      const submitButton = page.getByRole("button");
      await submitButton.click();

      await expect(page).toHaveURL(/.+\/group\/group1/);
    });

    test("バリデーションエラーが存在しない場合グループが作成されない、ページ遷移しない", async ({
      page,
    }) => {
      const groupNameInput = page.getByLabel("グループ名");
      await groupNameInput.fill("");

      const submitButton = page.getByRole("button");
      await submitButton.click();

      await expect(page.getByText("グループ名は必須です")).toBeVisible();
      await expect(page.getByText("メンバーは2人以上必要です")).toBeVisible();
      await expect(page).not.toHaveURL(/.+\/group\/group1/);
    });
  });
});
