# web_parser

## プロジェクト概要
- 中京大学のポータル画面から取得した HTML や JSON を解析し、構造化済みの DTO を返す TypeScript 製ライブラリです。
- Zod でスキーマ検証を行い、想定外の入力には例外を投げることで安全性を確保しています。
- Bun の実行環境を前提としており、`bun:test` を使ったフィクスチャベースのテストを備えています。

## 必要要件
- Bun (最新安定版を推奨)
- Node.js 18 以降 (型チェックやエディタ補完用)

## セットアップ
```bash
bun install
```

TypeScript の型チェックを行う場合は次を実行します。
```bash
npx tsc --noEmit
```

## パーサーの利用例
```typescript
import { parseManaboNews } from "web_parser";

const html = await fetch("https://example.com/manabo_news.html").then((res) => res.text());
const news = parseManaboNews(html);

console.log(news.items[0].title);
```

各パーサーは `src/index.ts` からエクスポートされており、対応する DTO 型も同時に提供されます。入力の検証に失敗した場合は例外が投げられます。

## テスト
フィクスチャと期待値に基づく回帰テストを実行するには次を利用します。
```bash
bun test
```

## 期待値フィクスチャの更新
HTML/JSON フィクスチャから期待値 JSON を生成し直す場合は、次のスクリプトを実行します。
```bash
bun run scripts/generate-expected.ts
```

生成されたファイルは `test/expected` 配下に保存されます。変更内容を確認し、テストが通ることを確かめてからコミットしてください。

## ディレクトリ構成
- `src/parsers` 各サービス向けパーサーの実装
- `src/schemas` DTO と Zod スキーマ定義
- `test/fixtures/html` テスト用入力フィクスチャ
- `test/expected` 期待値スナップショット
- `scripts/generate-expected.ts` 期待値の再生成スクリプト

## コントリビュートの指針
- 新しいパーサーを追加する際はスキーマとテストを必ず用意してください。
- 既存の期待値を変更した場合は、変更の理由をコミットメッセージや PR 説明に明記してください。
