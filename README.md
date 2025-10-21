# Web Parser

大学の学習管理システムや学生ポータルサイトのHTMLをパースし、構造化されたデータ（JSON）に変換するTypeScriptライブラリです。

## 概要

このライブラリは、以下の3つの主要なシステムからHTMLを解析するパーサーを提供します：

- **ALBO** - Cubics Plusのニュース機能
- **CUBICS** - Cubics Active Scheduleの時間割機能
- **manabo** - manaboの各種機能（授業、メール、ニュース、時間割など）

各パーサーは、HTMLを受け取り、型安全なDTOオブジェクトに変換します。Zodスキーマによる厳密なバリデーションを実装しており、信頼性の高いデータ変換を保証します。

## インストール

```bash
npm install @chukyo-passpal/web_parser
```

または

```bash
bun add @chukyo-passpal/web_parser
```

## 主な機能

### 1. ALBO

ALBOのニュースページをパースします。

```typescript
import { parseCubicsPtNews } from '@chukyo-passpal/web_parser';

const html = '...'; // ALBOニュースページのHTML
const result = parseCubicsPtNews(html);

if (result.success) {
  console.log(result.data.tabs); // ニュースタブの配列
  console.log(result.data.selectedTabId); // 選択中のタブID
}
```

**パース対象：**
- ニュースタブ情報
- 各ニュースエントリ（カテゴリ、ステータス、タイトル、リンク）

### 2. CUBICS

Cubicsの時間割ページをパースします。

```typescript
import { parseCubicsAsTimetable } from '@chukyo-passpal/web_parser';

const html = '...'; // Cubics時間割ページのHTML
const result = parseCubicsAsTimetable(html);

if (result.success) {
  console.log(result.data.student); // 学生情報
  console.log(result.data.periods); // 時間割の各コマ情報
}
```

**パース対象：**
- 学生情報（学籍番号、氏名、学部、学科など）
- 期間情報
- 曜日と日付
- 各時限の授業情報（教室、科目、詳細URL、授業コードなど）

### 3. manabo

manaboの様々な機能をパースする複数のパーサーを提供します。

#### 授業関連

```typescript
import {
  parseManaboClassDirectory,      // 授業のディレクトリ一覧
  parseManaboClassContent,         // 授業コンテンツ一覧
  parseManaboClassNotAttendContent,// 未受講コンテンツ
  parseManaboClassEntry,           // 授業への入室情報
  parseManaboClassNews,            // 授業ニュース
  parseManaboClassSyllabus,        // シラバス
  parseManaboClassQuizResult,      // 小テスト結果
} from '@chukyo-passpal/web_parser';
```

**パース対象：**
- 授業ディレクトリ（フォルダ構造）
- 授業コンテンツ（資料、課題、小テストなど）
- 出欠情報
- 授業内ニュース
- シラバス（評価方法、教科書、参考文献、授業計画など）
- 小テスト結果

#### 出欠管理

```typescript
import {
  parseManaboEntryForm,      // 出欠フォーム情報
  parseManaboEntryResponse,  // 出欠送信レスポンス
} from '@chukyo-passpal/web_parser';
```

**パース対象：**
- 出欠登録フォームの情報
- 出欠登録のレスポンス

#### メール機能

```typescript
import {
  parseManaboReceivedMail,   // 受信メール一覧
  parseManaboSentMail,       // 送信メール一覧
  parseManaboMailView,       // メール詳細
  parseManaboMailSend,       // メール送信フォーム
  parseManaboMailMember,     // メール宛先メンバー
} from '@chukyo-passpal/web_parser';
```

**パース対象：**
- 受信メール一覧（ページネーション付き）
- 送信メール一覧（ページネーション付き）
- メール詳細（件名、送信者、受信者、本文など）
- メール送信フォーム情報
- 宛先メンバー情報

#### その他の機能

```typescript
import {
  parseManaboNews,       // ポータルニュース
  parseManaboTimetable,  // 時間割
} from '@chukyo-passpal/web_parser';
```

**パース対象：**
- ポータルニュース
- 週間時間割（曜日、時限、授業名、教員名など）

## 技術スタック

- **TypeScript** - 型安全な実装
- **htmlparser2** - 高速なHTMLパーサー
- **css-select** - CSSセレクターによる要素選択
- **Zod** - スキーマバリデーション

## 開発

### ビルド

```bash
# CommonJS + ES Module両方をビルド
bun run build

# CommonJSのみ
bun run build:cjs

# ES Moduleのみ
bun run build:esm
```

### リント

```bash
bun run lint
```

### 公開

```bash
bun run publish
```

### テスト

```bash
bun run test
```

## パッケージ構成

```
dist/
  ├── cjs/           # CommonJS形式
  └── esm/           # ES Module形式
src/
  ├── albo/          # Cubics Plusニュースパーサー
  ├── cubics/        # Cubics時間割パーサー
  ├── manabo/        # manaboパーサー群
  └── common/        # 共通ユーティリティ（DOM操作、文字列処理）
```

## 注意事項

- このライブラリは特定の大学システムのHTMLをパースするために設計されています
- HTML構造の変更により、パーサーが正常に動作しなくなる可能性があります
- 各パーサーは`ZodSafeParseResult`を返すため、必ず`success`プロパティを確認してからデータを使用してください

## 型定義

すべてのパーサーは型安全なDTOと、対応するZodスキーマを提供しています。TypeScriptプロジェクトでは、自動補完と型チェックの恩恵を受けられます。

```typescript
import type {
  CubicsPtNewsDTO,
  CubicsAsTimetableDTO,
  ManaboClassContentDTO,
  // ... その他の型
} from '@chukyo-passpal/web_parser';
```
