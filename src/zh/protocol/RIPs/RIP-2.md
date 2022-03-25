# RIP-2：可用域名服务

## 摘要

RIP-2 用于描述并限定 RSS3 关联账户适用的域名服务。

## 动机

RSS3 协议未对适用的域名进行限制，这使得实现和使用时存在不确定性。

## 依赖

- [RFC 1035 - Domain names - implementation and specification](https://datatracker.ietf.org/doc/html/rfc1035)
- [RFC 1464 - Using the Domain Name System To Store Arbitrary String Attributes](https://datatracker.ietf.org/doc/html/rfc1464)

## 域名服务列表

| 注册商 | 顶级域名 | 网站 |
| -- | -- | -- |
| Domain Name System (DNS) | <https://data.iana.org/TLD/tlds-alpha-by-domain.txt> | <https://www.iana.org/> |
| Ethereum Name Service (ENS) | .eth | <https://ens.domains/> |
| Decentralized Account Systems (DAS) | .bit | <https://da.systems/> |
| Flowns | .fn | <https://www.flowns.org/> |

### 使用 DNS 记录验证 RSS3 账号

TXT 记录是 Domain name system (DNS) 资料记录的一种，通过任意文本与主机或其他域名进行关联，如人类可读的服务器、网络、数据中心或其他会计信息。（[TXT record - Wikipedia](https://en.wikipedia.org/wiki/TXT_record)）

该提案规定使用 DNS 的 TXT 记录来验证账户，其记录值应符合 RFC 1464 标准。

TXT 记录名：

```text
_rns
```

TXT 记录值：

```xsl
<account_platform>=<identity>[; <account_platform>=<identity>; ...]
```

示例：

```text
ethereum=0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944; solana=42jYG1DjDeGq8VgKtah1yR45MXU1uxThFxXukb6QBKMY
```
