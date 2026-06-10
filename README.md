# イワテトリス - デプロイ手順

## Vercelへの公開手順

### 1. GitHubにアップロード

1. [github.com](https://github.com) でアカウント作成（無料）
2. 「New repository」→ リポジトリ名: `iwate-tetris`
3. このフォルダの中身を全部アップロード

### 2. Vercelと連携

1. [vercel.com](https://vercel.com) でアカウント作成（GitHubアカウントでOK）
2. 「New Project」→ GitHubの `iwate-tetris` を選択
3. 設定はそのままで「Deploy」ボタンを押す

### 3. 公開完了

- URLが発行されます（例: `iwate-tetris.vercel.app`）
- スマホ・PCどちらでもアクセス可能

---

## 更新方法

ファイルを編集してGitHubにアップロードすると**自動で再デプロイ**されます。

---

## 非公開にしたいとき

Vercelのダッシュボードから「Unpublish」または「Delete Project」

---

## 管理画面へのアクセス

URLに `#admin` を追加するだけ:
```
https://iwate-tetris.vercel.app/#admin
```

---

## フォルダ構成

```
iwate-tetris/
├── index.html          # エントリーポイント
├── package.json        # 依存関係
├── vite.config.js      # ビルド設定
└── src/
    ├── main.jsx        # Reactのルート
    ├── App.jsx         # 画面ルーター
    ├── assets/
    │   ├── logo.webp   # イワテトリスロゴ
    │   ├── frame.webp  # 岩手の枠イラスト
    │   └── ramen.jpg   # 冷麺画像
    ├── components/
    │   ├── GalaxyBg.jsx    # 銀河背景
    │   ├── GalaxyTrain.jsx # 銀河鉄道
    │   └── WankoSVG.jsx    # わんこそばブロック
    ├── hooks/
    │   ├── useTetris.js    # ゲームロジック
    │   ├── useBGM.js       # BGM管理
    │   └── useConfig.js    # 設定管理
    └── screens/
        ├── TitleScreen.jsx # タイトル画面
        ├── GameScreen.jsx  # ゲーム画面
        └── AdminScreen.jsx # 管理画面
```
