# Whitelist URL Blocker

Firefox 用のシンプルなアドオンです。ユーザーが定義したホワイトリストにマッチしない URL へのアクセスをすべてブロックし、ブロック時に専用のページ上で元の URL とドメインを表示します。

## 主な機能
- ホワイトリストに登録された URL パターンのみアクセス許可
- ホワイトリストは拡張機能のポップアップから追加・削除、複数行一括登録が可能
- ブロック時には「アクセスがブロックされました」専用画面にリダイレクトし、元 URL とドメインを表示

## ファイル構成
```
whitelist-blocker/
├─ manifest.json      拡張機能の設定と必要パーミッション
├─ background.js      リクエスト監視・ホワイトリスト判定・リダイレクト処理
├─ popup.html         ホワイトリスト管理用ポップアップの HTML
├─ popup.js           ポップアップのリスト描画・追加・削除・一括登録ロジック
├─ blocked.html       ブロック画面の HTML
├─ blocked.js         ブロック画面で元 URL・ドメインを表示するスクリプト
```

## インストール・テスト（開発用／一時読み込み）
1. Firefox で `about:debugging#/runtime/this-firefox` を開く
2. 「一時的なアドオンを読み込む」をクリックし、`whitelist-blocker/manifest.json` を選択
3. ツールバーに表示されたアイコンをクリックしてポップアップを開き、パターンを追加
4. ホワイトリスト外の URL へアクセスすると、専用の「アクセスがブロックされました」画面が表示される

## パッケージ化（リリース用）
XPI 形式で配布する場合:
```bash
cd whitelist-blocker
zip -r ../whitelist-url-blocker.xpi *
```
生成された `whitelist-url-blocker.xpi` を Firefox の `about:addons` → 「ファイルからアドオンをインストール」で読み込めば完了です。

## パターンの書き方
- ワイルドカード `*` を利用してホスト・パスを柔軟にマッチ可能
- 例: `*://example.com/*`, `https://*.mozilla.org/path/*`

## ライセンス
MIT ライセンス（詳細は LICENSE ファイルを参照）