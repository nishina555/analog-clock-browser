# Analog Clock Browser

OBSでURL参照して表示するためのアナログ時計Webアプリケーションです。背景が透過されており、画面いっぱいに時計が表示されます。

## 特徴

- リアルタイムで動作するアナログ時計
- 背景が完全透過（OBSでの合成に最適）
- レスポンシブ対応（ウィンドウサイズに自動調整）
- 画面いっぱいに時計を表示
- シンプルで読みやすいデザイン

## 技術スタック

- **Vite** - ビルドツール
- **TypeScript** - 型安全な開発
- **HTML5 Canvas** - 時計の描画
- **CSS3** - 透過背景とレイアウト

## セットアップ

### 前提条件

- Node.js (推奨: v18以上)
- npm

### インストール

```bash
# 依存関係のインストール
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173/ にアクセスすると、開発中の時計が表示されます。

### ビルド

```bash
npm run build
```

ビルド成果物は `/docs` ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

ビルドした成果物をプレビューできます。

## デプロイ (GitHub Pages)

このプロジェクトはGitHub Pagesでのデプロイを想定しています。

1. `/docs` ディレクトリをGitにコミット
   ```bash
   git add docs/
   git commit -m "Build for production"
   git push
   ```

2. GitHubリポジトリの設定
   - Settings > Pages に移動
   - Source を「Deploy from a branch」に設定
   - Branch を `main` (または `master`)、フォルダを `/docs` に設定
   - Save

3. デプロイが完了すると、URLが表示されます

## OBSでの使用方法

1. OBSで「ブラウザ」ソースを追加
2. URLにデプロイしたページのURLを入力
3. 幅と高さを設定（例: 1920x1080）
4. 「ページが読み込まれたときにブラウザソースを再読み込みする」をON推奨

## ファイル構成

```
analog-clock-browser/
├── docs/              # ビルド成果物（GitHub Pages用）
├── src/
│   ├── main.ts       # エントリーポイント
│   ├── clock.ts      # 時計の描画ロジック
│   └── style.css     # スタイル
├── index.html        # HTMLテンプレート
├── vite.config.ts    # Vite設定
├── tsconfig.json     # TypeScript設定
└── package.json      # プロジェクト設定

```

## ライセンス

MIT
