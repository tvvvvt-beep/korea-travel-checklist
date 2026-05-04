# ✈️ DEPARTURES - ソウル旅行前チェックリスト

**航空・空港の出発ボードをテーマにした、2026年5月13日〜18日のソウル旅行準備用チェックリストアプリ**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.4.4-00DC82?logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5.33-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

![DEPARTURES App](https://img.shields.io/badge/Theme-Aviation%2FAirport%20Departure%20Board-002045)

## 🎯 特徴

- **✈️ 航空テーマデザイン**: 空港の出発ボードをイメージしたUIデザイン
- **📋 韓国渡航特化**: e-Arrival Card、K-ETA免除、電源アダプター等、韓国旅行特有の項目をプリセット
- **🔄 クラウド同期**: Firebaseによる複数デバイス間同期
- **📤 エクスポート機能**: PDF、テキスト、CSV形式でチェックリストを出力
- **🔗 共有機能**: フライトプランを他の人と共有
- **📱 PWA対応**: オフライン動作、プッシュ通知、モバイルインストール可能
- **🎨 Material Design 3**: 最新のデザインシステムを採用

## 🛠️ 技術スタック

- **フレームワーク**: Nuxt 4.4.4 (Vue 3.5.33)
- **言語**: TypeScript 6.0.3
- **スタイリング**: Tailwind CSS
- **状態管理**: Pinia 2.3.1
- **バックエンド**: Firebase (Authentication, Firestore)
- **PWA**: @nuxtjs/pwa 3.3.5
- **テスト**: Vitest 2.1.9
- **PDF生成**: jsPDF 4.2.1

## 📦 インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd korea-travel-checklist

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルにFirebase設定を入力
```

## 🚀 開発

```bash
# 開発サーバーの起動 (http://localhost:3000)
npm run dev

# 型チェック
npm run type-check

# リント
npm run lint

# フォーマット
npm run format

# テスト
npm run test

# カバレッジ
npm run test:coverage
```

## 🏗️ ビルド

```bash
# プロダクションビルド
npm run build

# プレビュー
npm run preview

# 静的サイト生成
npm run generate
```

## 🌐 デプロイ

### Vercel (推奨)

```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

**または**: GitHubリポジトリをVercelに連携するだけで自動デプロイが設定されます。

### その他のプラットフォーム

- **Netlify**: `netlify deploy --prod`
- **Cloudflare Pages**: `wrangler pages publish .output/public`
- **AWS Amplify**: Amplify ConsoleでGitHubリポジトリを連携

## 🎨 デザインシステム

### カラーパレット

```css
/* メインカラー */
--primary: #002045;              /* デパーチャー・ブルー */
--primary-container: #1A365D;   /* ボーディング・ブルー */
--secondary-container: #FCD400; /* アクション・イエロー */
--surface: #F7F9FB;             /* ターミナル・ホワイト */
```

### タイポグラフィ

- **見出し**: Space Grotesk (700, 600, 500)
- **本文**: Plus Jakarta Sans (600, 500, 400)
- **アイコン**: Material Symbols Outlined

### コンポーネント

- **ボーディングパス**: タスクカードは搭乗券風デザイン
- **フライトパス**: 進捗状況はフライト経路で表示
- **FAB**: フローティングアクションボタンで項目追加
- **ボトムナビ**: モバイル向けボトムナビゲーション

## 📂 プロジェクト構成

```
korea-travel-checklist/
├── assets/
│   └── css/
│       └── main.css           # メインスタイルシート
├── components/
│   ├── checklist/             # チェックリスト関連コンポーネント
│   │   ├── ChecklistItem.vue
│   │   ├── ChecklistList.vue
│   │   ├── CategoryTabs.vue
│   │   ├── AddItemModal.vue
│   │   └── EditItemModal.vue
│   ├── ui/                    # 汎用UIコンポーネント
│   ├── AuthModal.vue          # 認証モーダル
│   ├── SettingsModal.vue      # 設定モーダル
│   ├── ShareModal.vue         # 共有モーダル
│   └── ExportModal.vue        # エクスポートモーダル
├── composables/               # Vue Composables
│   ├── useAuth.ts            # 認証ロジック
│   ├── useChecklist.ts       # チェックリスト操作
│   ├── useSync.ts            # クラウド同期
│   └── useReminders.ts       # リマインダー
├── data/
│   ├── korea-templates.ts    # 韓国旅行プリセット
│   └── categories.ts         # カテゴリ定義
├── pages/
│   ├── index.vue             # メインページ
│   └── share/
│       └── [id].vue          # 共有ページ
├── stores/                   # Piniaストア
│   ├── checklist.ts
│   ├── auth.ts
│   └── sync.ts
├── types/                    # TypeScript型定義
│   └── checklist.ts
├── utils/                    # ユーティリティ
│   ├── storage.ts           # IndexedDBラッパー
│   ├── export.ts            # エクスポート機能
│   ├── sharing.ts           # 共有機能
│   └── firebase.ts          # Firebase初期化
├── public/                   # 静的アセット
├── .env.example              # 環境変数テンプレート
├── nuxt.config.ts           # Nuxt設定
├── tailwind.config.js       # Tailwind設定
├── vercel.json              # Vercel設定
└── package.json
```

## 🔐 Firebase設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. **Authentication** を有効化
   - Googleサインイン
   - メール/パスワード
3. **Firestore Database** を作成
4. **プロジェクト設定**から設定をコピーして`.env`ファイルに貼り付け

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📝 韓国渡航プリセット項目

### 必需品
- パスポート（有効期限6ヶ月以上）
- e-Arrival Card（到着3日前まで）
- 航空券
- 海外旅行保険証券
- ホテル予約

### 電子機器
- ユニバーサル変換アダプター（タイプC/F）
- 電圧コンバーター（220V対応）
- 充電器、モバイルバッテリー
- カメラ

### 服装・小物
- 着替え（5日分）
- 洗面用具
- 常備薬
- 筆記用具

### 韓国で役立つ
- T-moneyカード（交通）
- Naver Mapアプリ
- 韓国語フレーズ集
- 緊急連絡先メモ

## 🧪 テスト

```bash
# 単体テスト実行
npm run test

# UIモードでテスト実行
npm run test:ui

# カバレッジレポート
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

## 📄 ライセンス

[MIT](LICENSE)

## 👥 貢献

1. Forkする
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'feat: Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを開く

## 📮 問題の報告

バグや機能リクエストは[Issues](https://github.com/yourusername/korea-travel-checklist/issues)にて報告してください。

---

**Made with ❤️ for Seoul 2026 Trip**

✈️ **DEPARTURES** - あなたの旅の始まりをサポート
