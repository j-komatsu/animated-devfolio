# Animated DevFolio

ITエンジニア・Webデベロッパー向けの技術力アピール用アニメーションコレクションです。現代的で印象的なWebアニメーションを通じて、あなたの技術スキルとクリエイティブな発想力を効果的にアピールできます。

🌐 **Live Demo**: https://j-komatsu.github.io/animated-devfolio/

## 概要

このリポジトリは、ポートフォリオサイトや企業サイトで使用できる高品質なWebアニメーションを5つ収録しています。Three.js、GSAP、Chart.jsなどの最新Web技術を駆使して作成されており、技術面接やクライアントプレゼンテーションで強いインパクトを与えることができます。

### 対象者
- フロントエンドエンジニア
- Webデザイナー
- フルスタックデベロッパー
- 技術力をアピールしたい学生・転職希望者
- モダンなWebサイトを構築したい企業

## 特徴

- ✨ **5種類の高品質アニメーション** - 用途に応じて選択可能
- 🎨 **モダンで洗練されたUI/UX** - 最新のデザイントレンドに対応
- 📱 **完全レスポンシブ対応** - デスクトップからモバイルまで
- 🚀 **最新Web技術の活用** - Three.js、GSAP、Chart.jsなど
- 🔧 **カスタマイズ容易** - 色やテキストの変更が簡単
- ⚡ **軽量・高速** - パフォーマンスを重視した実装

## 収録アニメーション

### 1. 3D ロゴ回転アニメーション
- **技術**: Three.js + WebGL
- **用途**: 企業ロゴ、ブランディング
- **特徴**: 3Dオブジェクトが美しく回転し、プロフェッショナルな印象を演出

### 2. リアルタイムコードタイピング
- **技術**: JavaScript + GSAP
- **用途**: プログラミングスキルのアピール
- **特徴**: 実際のコードがタイピングされる様子をリアルに再現

### 3. 動的データ可視化チャート
- **技術**: Chart.js + GSAP
- **用途**: データ分析力、ビジネススキルのアピール
- **特徴**: 売上データが美しいアニメーションで成長していく様子を表現

### 4. インタラクティブ3D地球儀
- **技術**: Three.js + WebGL
- **用途**: グローバル展開、地理的データの可視化
- **特徴**: マウス操作で回転可能な美しい3D地球儀

### 5. モダンログインUIアニメーション
- **技術**: GSAP + CSS3
- **用途**: UI/UXデザインスキルのアピール
- **特徴**: 4つのデザインパターンから選択できる洗練されたログイン画面

## 技術仕様

### 使用技術
- **HTML5**: セマンティックなマークアップ
- **CSS3**: フレックスボックス、グリッド、アニメーション
- **JavaScript (ES6+)**: モジュール、アロー関数、Promise
- **Three.js**: 3Dグラフィックス、WebGL
- **GSAP**: 高性能アニメーションライブラリ
- **Chart.js**: データ可視化

### ブラウザサポート
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## セットアップ・使用方法

### 1. リポジトリのクローン
```bash
git clone https://github.com/j-komatsu/animated-devfolio.git
cd animated-devfolio
```

### 2. ローカルサーバーの起動
```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server

# Live Serverを使用する場合（VS Code拡張機能）
# index.htmlを右クリック → "Open with Live Server"
```

### 3. ブラウザでアクセス
```
http://localhost:8000
```

## カスタマイズ方法

各アニメーションは独立したディレクトリ構成になっており、簡単にカスタマイズできます：

```
animations/
├── animation1/     # 3Dロゴ回転
├── animation2/     # コードタイピング
├── animation3/     # データ可視化
├── animation4/     # 3D地球儀
└── animation5/     # ログインUI
```

### 色の変更
CSSの`--primary-color`、`--secondary-color`変数を変更することで、全体のカラーテーマを統一できます。

### テキストの変更
各HTMLファイルのテキスト部分を編集することで、内容をカスタマイズできます。

## ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルをご確認ください。

## 貢献・フィードバック

バグ報告、機能要望、プルリクエストを歓迎します。
- Issues: [GitHub Issues](https://github.com/j-komatsu/animated-devfolio/issues)
- Pull Requests: [GitHub Pull Requests](https://github.com/j-komatsu/animated-devfolio/pulls)

## 作者

[@j-komatsu](https://github.com/j-komatsu)

---

⭐ このプロジェクトが役に立った場合は、ぜひスターをお願いします！
