# アナログ時計 Webページ - Statement of Work (SOW)

## プロジェクト概要
OBSでURL参照して表示するためのアナログ時計Webページを作成する。

## 要件

### 機能要件
- リアルタイムで動作するアナログ時計を表示
  - 時針、分針、秒針が現在時刻に基づいて動作
  - 文字盤に12時間表記の数字を配置
- 時計のサイズは画面いっぱいに表示

### 非機能要件
- 背景は完全透過（OBSでの合成を想定）
- ブラウザで表示可能なWebページ
- パブリックページにデプロイ可能
- レスポンシブ対応（様々な画面サイズで動作）

## 技術スタック
digital-pomodoro-browserの技術スタックを参考に選定：
- Vite (ビルドツール)
- TypeScript
- HTML5 Canvas または SVG（時計の描画）
- CSS3（透過背景の実装）
- 静的サイトホスティング（GitHub Pages, Vercel, Netlify等）

## 実装内容

### ファイル構成
```
analog-clock-browser/
├── index.html
├── src/
│   ├── main.ts
│   ├── clock.ts
│   └── style.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 実装詳細

#### Phase 1: プロジェクトセットアップ

**手順:**
1. Viteプロジェクトの初期化
   ```bash
   npm create vite@latest . -- --template vanilla-ts
   ```

2. 依存関係のインストール
   ```bash
   npm install
   ```

3. package.jsonのscriptsセクション確認
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview"
     }
   }
   ```

4. vite.config.tsの作成（ビルド出力先を `/docs` に設定）
   ```typescript
   import { defineConfig } from 'vite'

   export default defineConfig({
     build: {
       outDir: 'docs'
     }
   })
   ```

5. tsconfig.jsonの確認（デフォルトのVite設定を使用）

6. 開発サーバーの起動
   ```bash
   npm run dev
   ```

- **確認**: 開発サーバーが起動し、初期画面が表示されることを確認

#### Phase 2: 基本的な時計の枠組み

**手順:**
1. index.htmlにcanvas要素を追加
   ```html
   <canvas id="clock"></canvas>
   ```

2. src/style.cssで基本スタイルを設定
   ```css
   body {
     margin: 0;
     padding: 0;
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100vh;
     background: transparent;
   }

   #clock {
     border: 1px solid #000; /* 確認用 */
   }
   ```

3. src/clock.tsを作成し、基本的な描画処理を実装
   ```typescript
   export class Clock {
     private canvas: HTMLCanvasElement;
     private ctx: CanvasRenderingContext2D;
     private radius: number;

     constructor(canvasId: string) {
       this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
       this.ctx = this.canvas.getContext('2d')!;
       this.setCanvasSize();
       this.radius = this.canvas.width / 2;
     }

     private setCanvasSize() {
       const size = Math.min(window.innerWidth, window.innerHeight);
       this.canvas.width = size;
       this.canvas.height = size;
     }

     public draw() {
       this.drawFace();
     }

     private drawFace() {
       this.ctx.beginPath();
       this.ctx.arc(this.radius, this.radius, this.radius * 0.9, 0, 2 * Math.PI);
       this.ctx.fillStyle = 'white';
       this.ctx.fill();
       this.ctx.strokeStyle = '#000';
       this.ctx.lineWidth = this.radius * 0.05;
       this.ctx.stroke();
     }
   }
   ```

4. src/main.tsで時計を初期化
   ```typescript
   import { Clock } from './clock';
   import './style.css';

   const clock = new Clock('clock');
   clock.draw();
   ```

- **確認**: ブラウザに円が表示されることを確認

#### Phase 3: 数字と目盛りの追加

**手順:**
1. src/clock.tsにdrawNumbers()メソッドを追加
   ```typescript
   private drawNumbers() {
     this.ctx.font = `${this.radius * 0.15}px Arial`;
     this.ctx.textBaseline = 'middle';
     this.ctx.textAlign = 'center';
     this.ctx.fillStyle = '#000';

     for (let num = 1; num <= 12; num++) {
       const ang = (num * Math.PI) / 6;
       const x = this.radius + Math.sin(ang) * this.radius * 0.75;
       const y = this.radius - Math.cos(ang) * this.radius * 0.75;
       this.ctx.fillText(num.toString(), x, y);
     }
   }
   ```

2. draw()メソッドでdrawNumbers()を呼び出す
   ```typescript
   public draw() {
     this.drawFace();
     this.drawNumbers();
   }
   ```

- **確認**: 文字盤に数字が正しく配置されていることを確認

#### Phase 4: 針の実装

**手順:**
1. src/clock.tsに時刻を取得するメソッドを追加
   ```typescript
   private drawTime() {
     const now = new Date();
     const hour = now.getHours() % 12;
     const minute = now.getMinutes();
     const second = now.getSeconds();

     // 時針
     this.drawHand(
       (hour * Math.PI) / 6 + (minute * Math.PI) / (6 * 60),
       this.radius * 0.5,
       this.radius * 0.07
     );

     // 分針
     this.drawHand(
       (minute * Math.PI) / 30,
       this.radius * 0.7,
       this.radius * 0.05
     );

     // 秒針
     this.drawHand(
       (second * Math.PI) / 30,
       this.radius * 0.8,
       this.radius * 0.02
     );

     // 中心の円
     this.ctx.beginPath();
     this.ctx.arc(this.radius, this.radius, this.radius * 0.05, 0, 2 * Math.PI);
     this.ctx.fillStyle = '#000';
     this.ctx.fill();
   }

   private drawHand(angle: number, length: number, width: number) {
     this.ctx.beginPath();
     this.ctx.lineWidth = width;
     this.ctx.lineCap = 'round';
     this.ctx.moveTo(this.radius, this.radius);
     this.ctx.lineTo(
       this.radius + Math.sin(angle) * length,
       this.radius - Math.cos(angle) * length
     );
     this.ctx.stroke();
   }
   ```

2. draw()メソッドでdrawTime()を呼び出す
   ```typescript
   public draw() {
     this.drawFace();
     this.drawNumbers();
     this.drawTime();
   }
   ```

- **確認**: 針が現在時刻を指していることを確認

#### Phase 5: アニメーション実装

**手順:**
1. src/clock.tsにstart()メソッドを追加
   ```typescript
   public start() {
     this.animate();
   }

   private animate() {
     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
     this.draw();
     requestAnimationFrame(() => this.animate());
   }
   ```

2. src/main.tsでstart()を呼び出す
   ```typescript
   import { Clock } from './clock';
   import './style.css';

   const clock = new Clock('clock');
   clock.start();  // draw()の代わりにstart()を呼ぶ
   ```

- **確認**: 時計が実際に動作し、リアルタイムで時刻を表示することを確認

#### Phase 6: スタイリング調整

**手順:**
1. src/style.cssを最終調整
   ```css
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   html, body {
     width: 100%;
     height: 100%;
     overflow: hidden;
   }

   body {
     display: flex;
     justify-content: center;
     align-items: center;
     background: transparent;
   }

   #clock {
     /* 確認用のボーダーは削除 */
   }
   ```

2. index.htmlを調整（不要なデフォルトコンテンツを削除）

3. src/clock.tsでCanvasサイズを画面いっぱいに調整
   ```typescript
   private setCanvasSize() {
     const size = Math.min(window.innerWidth, window.innerHeight) * 0.95;
     this.canvas.width = size;
     this.canvas.height = size;
   }
   ```

4. ウィンドウリサイズ対応を追加（オプション）
   ```typescript
   constructor(canvasId: string) {
     this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
     this.ctx = this.canvas.getContext('2d')!;
     this.setCanvasSize();
     this.radius = this.canvas.width / 2;

     window.addEventListener('resize', () => {
       this.setCanvasSize();
       this.radius = this.canvas.width / 2;
     });
   }
   ```

- **確認**: 背景が透過され、時計が画面いっぱいに表示されることを確認

#### Phase 7: ビルド設定

**手順:**
1. vite.config.tsが正しく設定されていることを確認（Phase 1で設定済み）
   ```typescript
   import { defineConfig } from 'vite'

   export default defineConfig({
     build: {
       outDir: 'docs'
     }
   })
   ```

2. .gitignoreに `/docs` を追加しないよう確認（GitHub Pagesで使用するため）

3. ビルドを実行
   ```bash
   npm run build
   ```

4. ビルド結果を確認
   ```bash
   ls -la docs/
   ```
   以下のファイルが生成されることを確認：
   - index.html
   - assets/*.js
   - assets/*.css

5. プレビューで動作確認
   ```bash
   npm run preview
   ```

- **確認**: `/docs` ディレクトリに静的ファイルが生成され、プレビューで正常に動作することを確認

## デリバリー
- 動作するWebページ（ローカル環境）
- ソースコード
- README.md（セットアップ手順、開発サーバー起動方法、ビルド方法を記載）

## 成功基準
- アナログ時計が正確に現在時刻を表示
- 背景が完全に透過されている
- 時計が画面いっぱいに表示される
- ローカル環境で正常に動作する
- ビルドコマンド実行時に静的成果物が `/docs` ディレクトリに出力される
- 将来的にOBSでURLを参照して表示可能な形式になっている

## 参考リポジトリ
https://github.com/nishina555/digital-pomodoro-browser
