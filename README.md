# @chukyo-umebo/web_parser

中京大学の各種システム（Albo, Cubics, Manabo）のHTMLを解析し、構造化されたデータとして抽出するためのTypeScriptライブラリです。

## 特徴

- **型安全性**: Zodを使用して解析結果を検証し、TypeScriptの型定義を提供します。
- **軽量**: `htmlparser2` と `css-select` を使用した高速な解析。
- **モジュール化**: システムごとにパーサーが分かれています。

## インストール

```bash
bun add @chukyo-umebo/web_parser
# または
npm install @chukyo-umebo/web_parser
```

## 使い方

```typescript
import { parseManaboNews } from "@chukyo-umebo/web_parser";

const html = `...`; // 取得したHTML文字列
const result = parseManaboNews(html);

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

## 対応システム

- **Albo**: お知らせ情報など
- **Cubics**: 履修登録、時間割など
- **Manabo**: ポータルサイト（お知らせ、課題、メールなど）

## 開発

このプロジェクトは [Bun](https://bun.sh) を使用しています。

```bash
# 依存関係のインストール
bun install

# ビルド
bun run build

# テスト
bun test

# リント
bun run lint
```
