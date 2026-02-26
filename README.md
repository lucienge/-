# Deals Preview (B 方案：GitHub Pages)

本專案已附上可直接部署到 GitHub Pages 的預覽頁：`docs/index.html`。

## 一次設定（GitHub）
1. 進入 repository → **Settings** → **Pages**。
2. 在 **Build and deployment** 選擇 **GitHub Actions**。
3. push 到 `main`（或 `master`）後，workflow `Deploy GitHub Pages Preview` 會自動部署。

## 預覽網址格式
部署完成後可在以下網址看到：

`https://<你的 GitHub 帳號>.github.io/<repo 名稱>/`

## 本地預覽
```bash
cd docs
python3 -m http.server 4173
# 開 http://127.0.0.1:4173
```
