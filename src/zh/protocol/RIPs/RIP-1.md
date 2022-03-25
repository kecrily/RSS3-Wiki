# RIP-1：可用账户平台

## 摘要

RIP-1 用于描述并限定 RSS3 中适用的账号（account）。

## 动机

RSS3 协议未对适用的平台账号进行限制，这使得实现和使用时存在不确定性。

## 基于密码学的去中心化平台

基于密码学的去中心化平台不需要使用中心化服务器，它们通过公开的签名算法进行身份认证。

这些平台的账户可以用作主账户和关联账户。

## 中心化平台

中心化平台需要通过中心化服务器进行验证。用户必须将主账户的地址或名称（参考 [RIP-2：注册名称服务](./RIP-2.md)）放到平台账户资料的某个位置，以验证所有权。

这些平台的账号指南作为关联账号。

## 支持的平台列表

| ID | 名称 | 标志 | 网站 | 基于密码学 | 示例 | 生成和验证 |
| -- | -- | -- | -- | -- | -- | -- |
| 1 | Ethereum | ethereum | <https://ethereum.org> | Yes | 0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944@ethereum | <https://ethereum.org/en/developers/docs/accounts/> |
| 2 | Solana | solana | <https://solana.com> | Yes | 42jYG1DjDeGq8VgKtah1yR45MXU1uxThFxXukb6QBKMY@solana | <https://docs.solana.com/terminology#account> |
| 3 | Flow | flow | <https://www.onflow.org/> | Yes | 0xff2da663c7033313@flow | <https://docs.onflow.org/cadence/language/crypto/> |
| 4 | Arweave | arweave | <https://www.arweave.org/> | Yes | DMMgLkfQ4faV_igfexJn4aOJY7Drc8PkJBk_K5T3rsM@arweave | <https://docs.arweave.org/developers/server/http-api#key-format> |
| 5 | RSS | rss | <https://validator.w3.org/feed/docs/rss2.html> | No | https%3A%2F%2Fdiygod.me%2Fatom.xml@rss | title, description, generator, webMaster |
| 6 | Twitter | twitter | <https://twitter.com> | No | rss3_@twitter | Username, Name, Bio, Website, Pinned tweet |
| 7 | Misskey | misskey | <https://misskey-hub.net/> | No | Candinya@nya.one@misskey | Name, Bio, Labels, Pinned notes |
| 8 | 即刻 | jike | <https://web.okjike.com/> | No | 3EE02BC9-C5B3-4209-8750-4ED1EE0F67BB@jike | 昵称, 签名 |
| 9 | PlayStation | playstation | <https://www.playstation.com/> | No | DIYgod_@playstation | Online ID, Name, About |
| 10 | GitHub | github | <https://github.com/> | No | DIYgod@github | Name, Bio, Company, Website |
