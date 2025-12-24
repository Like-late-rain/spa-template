/**
 * E2E 测试：钱包登录和个人资料编辑流程
 *
 * 运行前提：
 * 1. 安装 Playwright: npm install -D @playwright/test
 * 2. 安装 MetaMask 扩展: npx playwright install
 * 3. 启动本地开发服务器: yarn client:server
 * 4. 启动后端服务器: cd ../koa-mpa && yarn dev
 *
 * 运行测试:
 * npx playwright test tests/e2e/wallet-login.spec.ts
 */

import { test, expect, chromium, BrowserContext } from '@playwright/test';
import path from 'path';

// 注意：这个测试需要 MetaMask 扩展
// 实际 E2E 测试中，你需要配置 MetaMask 扩展或使用 Synpress 库
// 这里提供基础的测试框架

test.describe('钱包登录流程 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问应用首页
    await page.goto('http://localhost:8081');
  });

  test('应该显示连接钱包按钮', async ({ page }) => {
    // 查找连接钱包按钮
    const connectButton = page.locator('button:has-text("连接钱包")');
    await expect(connectButton).toBeVisible();
  });

  test('应该在未连接钱包时隐藏个人中心', async ({ page }) => {
    // 个人中心应该不可见或显示未连接状态
    const profile = page.locator('text=个人中心');

    // 如果个人中心存在，应该显示未连接提示
    if (await profile.isVisible()) {
      await expect(page.locator('text=请先连接钱包')).toBeVisible();
    }
  });

  // 以下测试需要 MetaMask 扩展支持
  // 实际项目中建议使用 @synthetixio/synpress 来测试 MetaMask 交互

  test.skip('完整流程：连接钱包 -> 登录 -> 编辑资料', async ({ page }) => {
    // 步骤 1: 点击连接钱包
    await page.click('button:has-text("连接钱包")');

    // 步骤 2: 等待 MetaMask 弹窗并确认连接
    // 注意：这需要 MetaMask 扩展和特殊配置
    // await metamask.acceptAccess();

    // 步骤 3: 验证连接成功
    await expect(page.locator('text=/0x[a-fA-F0-9]{4}.*[a-fA-F0-9]{4}/')).toBeVisible();

    // 步骤 4: 导航到个人中心
    await page.click('a:has-text("个人中心")');
    await page.waitForURL('**/profile');

    // 步骤 5: 验证用户信息显示
    await expect(page.locator('text=ETH')).toBeVisible();
    await expect(page.locator('text=YCT')).toBeVisible();

    // 步骤 6: 点击编辑按钮
    await page.click('button:has-text("编辑")');

    // 步骤 7: 修改昵称
    const nameInput = page.locator('input[placeholder*="昵称"]');
    await nameInput.fill('E2E Test User');

    // 步骤 8: 保存修改
    await page.click('button:has-text("保存")');

    // 步骤 9: 等待签名弹窗并确认
    // await metamask.confirmSignature();

    // 步骤 10: 验证保存成功
    await expect(page.locator('text=E2E Test User')).toBeVisible();
  });
});

test.describe('课程功能 E2E 测试', () => {
  test.skip('应该正确显示我创建的课程', async ({ page }) => {
    // 假设已经连接钱包
    await page.goto('http://localhost:8081/profile');

    // 点击"我创建的课程"标签
    await page.click('text=我创建的课程');

    // 等待课程列表加载
    await page.waitForSelector('.course-card', { timeout: 5000 });

    // 验证课程卡片显示
    const courseCards = page.locator('.course-card');
    await expect(courseCards.first()).toBeVisible();
  });

  test.skip('应该正确显示我购买的课程', async ({ page }) => {
    await page.goto('http://localhost:8081/profile');

    // 点击"我购买的课程"标签
    await page.click('text=我购买的课程');

    // 等待课程列表加载
    await page.waitForSelector('.course-card', { timeout: 5000 });

    // 验证课程卡片显示
    const courseCards = page.locator('.course-card');
    const count = await courseCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('API 集成测试', () => {
  test('后端 API 应该正常响应', async ({ request }) => {
    // 测试钱包登录接口
    const response = await request.post('http://localhost:3000/users/wallet-login', {
      data: {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('id');
    expect(data.data).toHaveProperty('walletAddress');
  });

  test('获取用户详情接口应该正常工作', async ({ request }) => {
    // 先创建一个测试用户
    const loginResponse = await request.post('http://localhost:3000/users/wallet-login', {
      data: {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      },
    });

    const loginData = await loginResponse.json();
    const userId = loginData.data.id;

    // 获取用户详情
    const response = await request.get(`http://localhost:3000/users/${userId}`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBe(userId);
  });
});

/**
 * 使用 Synpress 进行 MetaMask 测试的示例配置：
 *
 * 1. 安装依赖:
 *    npm install -D @synthetixio/synpress
 *
 * 2. 配置 synpress.config.ts:
 *    import { defineConfig } from '@synthetixio/synpress'
 *    export default defineConfig({
 *      metamask: {
 *        seed: 'your test seed phrase here',
 *        network: 'sepolia'
 *      }
 *    })
 *
 * 3. 在测试中使用:
 *    import { metamask } from '@synthetixio/synpress'
 *
 *    test('connect wallet', async ({ page }) => {
 *      await page.click('button:has-text("连接钱包")')
 *      await metamask.acceptAccess()
 *      await expect(page.locator('text=/0x/')).toBeVisible()
 *    })
 */
