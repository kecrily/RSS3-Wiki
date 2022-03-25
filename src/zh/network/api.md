# API

## 介绍

[源码](https://github.com/NaturalSelectionLabs/RSS3-Pre-Node)

[![RSS3](https://badge.rss3.workers.dev/?version=v0.3.1)](https://github.com/NaturalSelectionLabs/RSS3/blob/main/versions/v0.3.1.md)

在我们实现最终目标——完全去中心化的节点前，你可以通过临时性的中心化节点 https://prenode.rss3.dev 进行访问。

## 受支持的域名服务

类似 [Web3 Name Service](https://github.com/NaturalSelectionLabs/Web3-Name-Service)

- ENS: *.eth
- DAS: *.bit
- RNS: *.rss3

## 受支持的账号系统

- EVM+
- Twitter
- Misskey
- Jike

## 受支持的自动索引资产

- Gitcoin.Donation
- xDai.POAP
- BSC.NFT
- Ethereum.NFT
- Polygon.NFT
- Mirror.XYZ (to be removed)

## 受支持的自动索引项目

- Gitcoin.Donation
- xDai.POAP
- BSC.NFT
- Ethereum.NFT
- Polygon.NFT
- Mirror.XYZ
- Twitter
- Misskey
- Jike

## API

- GET `/:fid` - 获取文件

示例：

获取 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 索引文件

<https://prenode.rss3.dev/0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944>

- PUT `/` - 更改文件

Body 参数

| 名称     | 可选 | 描述              |
| -------- | -------- | ------------------------ |
| files    | false    | 由文件内容组成的数组 |

- GET `/assets/details`

获取资产细节

Query 参数

| 名称     | 可选 | 描述              |
| -------- | -------- | ------------------------ |
| assets   | false    | 需要的资产 id，用 `,` 分割 |
| full     | true    | 是否返回详细信息 |

示例：

获取 `EVM+-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-Ethereum.NFT-0xacbe98efe2d4d103e221e04c76d7c55db15c8e89.5` 和 `EVM+-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-Polygon.NFT-0x548cee4ee43ecd2fb4716c490d3da315069d8114.3` 两个资产的细节

<https://prenode.rss3.dev/assets/details?assets=EVM%2B-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-Ethereum.NFT-0xacbe98efe2d4d103e221e04c76d7c55db15c8e89.5,EVM%2B-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-Polygon.NFT-0x548cee4ee43ecd2fb4716c490d3da315069d8114.3&full=1>

- GET `/items/list`

获取聚合的自动索引项目和自行提交项目，并按时间排序

Query 参数

| 名称     | 可选 | 描述              |
| -------- | -------- | ------------------------ |
| limit   | true    | 列表最多能返回的项目数量 |
| tsp     | true    | RFC 3339 格式的时间，返回在此时间前的项目 |
| persona     | false    |  |
| linkID     | true    |  |
| fieldLike     | true    | 根据 `target.field` 进行过滤，用 `,` 分割 |

示例：

获取 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 的聚合项目

<https://prenode.rss3.dev/items/list?limit=5&persona=0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944>

获取 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 关注的对象的聚合项目

<https://prenode.rss3.dev/items/list?limit=5&persona=0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944&linkID=following>

获取 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 与 NFT 和 Gitcoin 相关的聚合项目

<https://prenode.rss3.dev/items/list?limit=5&persona=0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944&fieldLike=NFT,Gitcoin>

- GET `/profile/list`

获取给定对象的资料

Query 参数

| 名称     | 可选 | 描述              |
| -------- | -------- | ------------------------ |
| personas    | false | 由文件内容组成的数组 |

示例：

获取 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 和 `0xee8fEeb6D0c2fC02Ef41879514A75d0E791b5061` 的资料

<https://prenode.rss3.dev/profile/list?personas=0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944,0xee8fEeb6D0c2fC02Ef41879514A75d0E791b5061>
