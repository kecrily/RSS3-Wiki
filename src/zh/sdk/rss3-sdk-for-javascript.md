# RSS3 SDK for JavaScript

## 介绍

[源码](https://github.com/NaturalSelectionLabs/RSS3-SDK-for-JavaScript)

此 SDK 适用于 JavaScript，并与 RSS3 协议保持同步，提供对主要模块的简易访问和自动化签名处理。

此 SDK 与 Node.js 环境和主要的现代浏览器兼容，并有着良好的 TypeScript 支持。

[![RSS3](https://badge.rss3.workers.dev/?version=v0.3.1)](https://github.com/NaturalSelectionLabs/RSS3/blob/main/versions/v0.3.1.md)
[![test](https://github.com/NaturalSelectionLabs/RSS3-SDK-for-JavaScript/actions/workflows/test.yml/badge.svg)](https://github.com/NaturalSelectionLabs/RSS3-SDK-for-JavaScript/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/NaturalSelectionLabs/RSS3-SDK-for-JavaScript/branch/develop/graph/badge.svg?token=361AKFS8AH)](https://codecov.io/gh/NaturalSelectionLabs/RSS3-SDK-for-JavaScript)

## 安装

&nbsp;

通过 npm 或 yarn 安装 `rss3`。

<CodeGroup>
  <CodeGroupItem title="yarn" active>

```bash
yarn add rss3
```

  </CodeGroupItem>

  <CodeGroupItem title="npm">

```bash
npm install rss3 --save
```

  </CodeGroupItem>
</CodeGroup>

然后在你的项目中引用 `rss3`。

```js
import RSS3, { utils as RSS3Utils } from 'rss3';
```

## 开始

使用 SDK 的第一步是初始化

### 初始化

有 4 种初始化 SDK 的方法：

- 创建一个临时账户（推荐在不需要修改文件的情况下使用）
- 使用外部签名方法进行初始化（建议在可能需要修改文件的情况下使用）
- 使用助记符进行初始化
- 用私钥进行初始化

```ts
interface IOptions {
    endpoint: string; // The RSS3 Network endpoint
    agentSign?: boolean;
    agentStorage?: {
        set: (key: string, value: string) => Promise<void>;
        get: (key: string) => Promise<string>;
    };
}

export interface IOptionsMnemonic extends IOptions {
    mnemonic?: string;
    mnemonicPath?: string;
}

export interface IOptionsPrivateKey extends IOptions {
    privateKey: string;
}

export interface IOptionsSign extends IOptions {
    address: string;
    sign: (data: string) => Promise<string>;
}

new RSS3(options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign);
```

**临时账号**

如果应用程序只需要从 RSS3 网络获取信息（如活动摘要或资产）而不需要提交更改，最简单的方法是通过创建临时账户（第一种方法）来初始化，即只需传递端点参数。

```ts
const rss3 = new RSS3({
    endpoint: 'https://prenode.rss3.dev',
});
```

**MetaMask 或其他以太坊兼容钱包**

如果应用程序需要用户对文件进行修改（例如发布一个新项目或添加一个新链接），那么出于安全考虑，除非有特殊需要，我们应该用热钱包或冷钱包所提供的外部签名方法进行初始化（第二种方式）。

<CodeGroup>
<CodeGroupItem title="ethers" active>

```ts
import RSS3 from 'rss3';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const rss3 = new RSS3({
    endpoint: 'https://prenode.rss3.dev',
    address: await signer.getAddress(),
    sign: async (data) => await signer.signMessage(data),
});
```

</CodeGroupItem>

<CodeGroupItem title="web3.js">

```ts
import RSS3 from 'rss3';
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
const address = (await web3.eth.getAccounts())[0];
const rss3 = new RSS3({
    endpoint: 'https://prenode.rss3.dev',
    address,
    sign: async (data) => await web3.eth.personal.sign(data, address),
});
```

</CodeGroupItem>
</CodeGroup>

`agentSign` 是代理签名的一种——[阅读 RSS3协议](https://github.com/NaturalSelectionLabs/RSS3) 了解关于 `agent_id` 和 `agent_signature` 字段的更多信息。当用户用外部签名初始化 SDK，就会生成代理签名并签署后续的修改。代理信息通过 `agentStorage` 参数存储在合适且安全的地方，默认位置是 cookies。

也可以使用助记符或私钥来初始化 SDK，不过不强烈推荐。

**助记词**

```ts
const rss3 = new RSS3({
    endpoint: 'https://prenode.rss3.dev',
    mnemonic: 'xxx',
    mnemonicPath: 'xxx',
});
```

**私钥**

```ts
const rss3 = new RSS3({
    endpoint: 'https://prenode.rss3.dev',
    privateKey: '0xxxx',
});
```

下一节将通过几个使用场景来介绍 SDK 的使用。

### 获取资料细节内容

在支持外部 DID 项目（如 ENS、next.id 和 self.id）的同时，也可以通过 RSS3 网络获取个人资料细节内容，包括头像和昵称。

使用 `rss3.profile.get` 方法获取给定对象的资料。

如果没有给定对象地址，将返回当前初始化对象的资料。

获取对象 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 的账号资料

```ts
const { details } = await rss3.profile.get('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944');
```

### 添加对象的关联账户

可以帮助用户在 RSS3 网络中添加账户。

见 [API#受支持的账号系统](../network/api.md#受支持的账号系统)

账户可以分为两种类型：一种是去中心化的，比如说区块链，另一种则是寄托于中心化平台，包括 Twitter、Misskey 和 Jike。

下面分别列举这两种类型的例子。

我们先来添加当前的 MetaMask 账户。请注意，这个地址不能与 RSS3 实例的主地址重复。

1. 声明账号

```ts
const account = {
    tags: ['test account'], // Optional
    id: RSS3Utils.id.getAccount('EVM+', await signer.getAddress()), // 'EVM+-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'
};
```

2. 计算出签名信息，并使用 MetaMask 签署此信息，以证明此账户的所有权。

```ts
const signMessage = await rss3.profile.accounts.getSigMessage(account);
account.signature = await signer.signMessage(signMessage);
```

3. 将此账号添加到 RSS3 文件中

```ts
await rss3.profile.accounts.post(account);
```

4. 将修改后的文件同步至 RSS3 网络

```ts
await rss3.files.sync();
```

下面添加一个来自中心化平台的账户，如 Twitter。

1. 将主地址或指向主地址的域名（见[API#受支持的域名服务](../network/api.md#受支持的域名服务)）添加到 Twitter 的简介、名称或网址中

2. 声明这个账户
3. 将账户添加到 RSS3 文件
4. 将修改后的文件同步到 RSS3 网络（同上）

```ts
const account = {
    id: RSS3Utils.id.getAccount('Twitter', 'DIYgod'), // 'Twitter-DIYgod'
};
await rss3.profile.accounts.post(account);
await rss3.files.sync();
```

### 获取对象链接列表

RSS3 可以和所有外部社交图谱一起工作，然而如果想直接使用 RSS3 网络上的现有链接，这里将展示该怎么做

该协议规定，每个对象可以有多种类型的链接，以 `following` 为例。这里将 `following` 作为 ID，也可以自定义链接 ID。

接下来，尝试获取角色的关注列表，也就是 ID 为 `following` 的链接列表。

```ts
const list = await rss3.links.getList('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944', 'following');
```

现在有一个包含所有地址的数组，但要一个一个地获取他们的资料并渲染出一个带有头像和名字的漂亮列表十分麻烦，所以 SDK 提供了批量获取资料的方法。

```ts
const profiles = await rss3.profile.getList(list);
```

这返回了包含资料和地址的数组，可以用它来渲染一个漂亮的列表。

这同样适用于追随者列表，只是链接需要替换成反向链接。

```ts
const list = await rss3.backlinks.getList('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944', 'following');
```

注意，追随者列表可能会非常大，在这种情况下，需要分段加载以避免性能问题。

```ts
const page1 = await rss3.profile.getList(list.slice(0, 10));
```

获取下一部分列表

```ts
const page2 = await rss3.profile.getList(list.slice(10, 20));
```

### 获取资产列表

资产分为自动索引的资产和自我声明的资产（WIP），下面有个自动索引资产的示例。

支持的自动资产列表见[API#受支持的自动索引资产](../network/api.md#受支持的自动索引资产)

可以像这样获得给定对象的资产列表

```ts
const assets = (await rss3.assets.auto.getList('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944')).filter((asset) => !asset.includes('Mirror'));
```

会发现只返回了包含资产 ID 的数组，而没有包含细节内容，如图片或名称。这是因为一些资产的细节可能需要长时间来进行索引。所以更好的做法是先渲染列表，给它们一个加载状态，然后获取细节，之后再渲染图片和其他信息。

```ts
const details = await rss3.assets.getDetails({
    assets,
    full: true,
});
```

注意，由于从第三方来源获取细节内容可能会很慢，细节的返回值也可能不会返回所有请求的资产细节，也可能不会按顺序返回。因此，如果有任何遗漏的资产，请在一段时间后重新尝试获取遗漏的资产。

可以写个循环来请求详细信息。

```ts
let details = [];
for (let i = 0; i < 10; i++) {
    details = details.concat(await rss3.assets.getDetails({
        assets: assetsNoDeails,
        full: true,
    }));
    myRender(details);
    const assetsNoDeails = assets.filter((asset) => !details.find((detail) => detail.id === asset));
    if (!assetsNoDeails.length) {
        break;
    } else {
        await new Promise((r) => {setTimeout(r, 3000)})
    }
}
```

### 获取活动 Feed

活动 feed 中的项目被分为由节点自动索引的项目和自行提交带有签名的项目。因此，项目被存储分别在两种类型的文件中，由于自动索引的项目不一定是按时间顺序排序的，而客户端很难准确计算出按时间顺序的列表。所以，节点和 SDK 提供了一种更方便的方式来获得按时间顺序排列的项目。

如果想获取特定对象 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 最新的十个活动项目：

```ts
const page1 = await rss3.items.getList({
    limit: 10,
    persona: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',  
});
```

如果想通过 RSS3 网络中现有的链接（如关注），获取其他对象 `0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944` 的项目列表：

```ts
const page1 = await rss3.items.getList({
    limit: 10,
    persona: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    linkID: 'following',
});
```

如果想获取对某一资产的评论：

```ts
const page1 = await rss3.items.getList({
    limit: 10,
    linkTarget: 'Ethereum.NFT-0xacbe98efe2d4d103e221e04c76d7c55db15c8e89.5',
    linkID: 'comment',
});
```

如果正在使用有关注地址列表的外部社交图谱（如 CyberConnect 或 Mem）：

```ts
const page1 = await rss3.items.getList({
    limit: 10,
    personaList: list,
});
```

如果只想获取特定类型的活动：

```ts
const page1 = await rss3.items.getList({
    limit: 10,
    persona: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    linkID: 'following',
    fieldLike: 'NFT',
});
```

[查看 API#受支持的自动索引项目](../network/api.md#受支持的自动索引项目)获取字段的可能值在

其中一些项目同时包括资产变更，比如得到 NFT，有时还需要使用它们细节来渲染资产的图像和名称，这时又需要使用上面提到的 `rss3.assets.getDetails` 方法。

```ts
const assets = page1.filter((item) => item?.target?.field?.startsWith('assets-')).map((item) => item.target.field.replace(/^assets-/, ''));

// Same as above
let details = [];
for (let i = 0; i < 10; i++) {
    details = details.concat(await rss3.assets.getDetails({
        assets: assetsNoDeails,
        full: true,
    }));
    myRender(details);
    const assetsNoDeails = assets.filter((asset) => !details.find((detail) => detail.id === asset));
    if (!assetsNoDeails.length) {
        break;
    } else {
        await new Promise((r) => {setTimeout(r, 3000)})
    }
}
```

另外，如果想从 RSS3 网络中获取项目列表中对象的资料，例如昵称和头像，我们也可以：

```ts
const profileSet = page1.filter((item) => item?.target?.field?.startsWith('assets-')).map((item) => utils.id.parse(item.id).persona);
let profiles = await rss3.profile.getList(profileSet);
```

当用户查看下一部分项目时，将 page1 的最后一个项目的时间作为 tsp 参数来获得后十个项目。

```ts
const page2 = await rss3.items.getList({
    limit: 10,
    persona: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    linkID: 'following',
    fieldLike: 'NFT',
    tsp: page1[page1.length - 1].date_created,
});
```

### 发表自定义项目

让我们从一个纯文本项目开始

```ts
await rss3.items.custom.post({
    summary: 'I love RSS3',
});
```

有时我们也会想给项目添加个图片或视频，这时我们需要把资源上传到外部存储器，以获得一个链接，然后把它放在内容中。

```ts
await rss3.items.custom.post({
    summary: 'I love RSS3',
    contents: [{
        mime_type: 'image/jpeg',
        address: ['https://picsum.photos/200/300'],
    }, {
        mime_type: 'video/mp4',
        address: ['https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4'],
    }],
});
```

而有的时候还会想发布一个与另一项目有关的项目，如评论或喜欢它。

```ts
// comment
await rss3.items.custom.post({
    summary: 'I love you',
    link: {
        id: 'comment',
        target: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-item-auto-1',
    };
});

// like
const likeItem = await rss3.items.custom.post({
    link: {
        id: 'like',
        target: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-item-auto-1',
    };
});
```

亦或是资产

```ts
// comment
await rss3.items.custom.post({
    summary: 'I love it',
    link: {
        id: 'comment',
        target: 'Ethereum.NFT-0xacbe98efe2d4d103e221e04c76d7c55db15c8e89.5',
    };
});
```

然后，如果想修改这个项目，例如，不喜欢它或修改摘要，只要告诉 sdk 想修改的项目的 id 和修改后的项目内容即可。

```ts
await rss3.items.custom.patch({
    id: likeItem.id,
    summary: 'New summary',
});
```

最后不要忘记同步你的文件。

```ts
await rss3.files.sync();
```

## SDK API

查看完整的 SDK API

### 文件

**files.sync()**

注意只有在 `files.sync()` 被成功执行后，更改才会同步到节点。

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
files.sync(): string[]
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const changedFiles = rss3.files.sync();
```

</CodeGroupItem>
</CodeGroup>

**files.get()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
files.get(fileID: string): Promise<RSS3Content>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const file = await rss3.files.get(rss3.account.address);
```

</CodeGroupItem>
</CodeGroup>

### 账号

**account.mnemonic**

如果用私钥或自定义签名函数进行初始化，那么这个值是未定义的。

```ts
account.mnemonic: string | undefined
```

**account.privateKey**

如果用自定义签名函数进行初始化，那么这个值是未定义的。

```ts
account.privateKey: string | undefined
```

**account.address**

```ts
account.address: string
```

### 资料

**profile.get()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
profile.get(personaID: string = account.address): Promise<RSS3Profile>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const file = await rss3.files.get(rss3.account.address);
```

</CodeGroupItem>
</CodeGroup>

**profile.patch()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
profile.patch(profile: RSS3Profile): Promise<RSS3Profile>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const newProfile = await rss3.profile.patch({
    name: 'RSS3',
    avatar: ['https://cloudflare-ipfs.com/ipfs/QmZWWSspbyFtWpLZtoAK35AjEYK75woNawqLgKC4DRpqxu'],
    bio: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
```

</CodeGroupItem>
</CodeGroup>

**profile.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
profile.getList(personas: string[]): Promise<(RSS3Profile & { persona: string })[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const profiles = rss3.profile.getList([
    '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    '0xee8fEeb6D0c2fC02Ef41879514A75d0E791b5061',
]);
```

</CodeGroupItem>
</CodeGroup>

### Profile.accounts

**profile.accounts.getSigMessage()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
profile.accounts.getSigMessage(account: RSS3Account): Promise<string>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const sigMessage = await rss3.profile.accounts.getSigMessage({
    id: RSS3Utils.id.getAccount('EVM+', '0x1234567890123456789012345678901234567890'),
    tags: ['test'],
});
```

</CodeGroupItem>
</CodeGroup>

**profile.accounts.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
profile.accounts.getList(persona?: string): Promise<RSS3Account[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const list = await rss3.profile.accounts.getList('0x1234567890123456789012345678901234567890');
```

</CodeGroupItem>
</CodeGroup>

**profile.accounts.post()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
profile.accounts.post(account: RSS3Account): Promise<RSS3Account>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const account = {
    id: RSS3Utils.id.getAccount('EVM+', '0x1234567890123456789012345678901234567890'),
    tags: ['test'],
};
const signature = mySignFun(await rss3.profile.accounts.getSigMessage(account));
account.signature = signature;
const account = await rss3.profile.accounts.post(account);
```

</CodeGroupItem>
</CodeGroup>

**profile.accounts.delete()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
profile.accounts.delete(id: string): Promise<string>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const account = await rss3.profile.accounts.delete(
    RSS3Utils.id.getAccount('EVM+', '0x1234567890123456789012345678901234567890'),
);
```

</CodeGroupItem>
</CodeGroup>

### 项目

**items.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.getList(options: {
    limit: number;
    tsp: string;
    persona: string;
    linkID?: string;
    fieldLike?: string;
}): Promise<(RSS3CustomItem | RSS3AutoItem)[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const followingTimeline = await rss3.items.getList({
    persona: '0x1234567890123456789012345678901234567890',
    linkID: 'following',
    limit: 10,
    tsp: '2021-12-06T13:59:57.030Z',
});
const personaTimeline = await rss3.items.getList({
    persona: '0x1234567890123456789012345678901234567890',
    limit: 10,
    tsp: '2021-12-06T13:59:57.030Z',
});
```

</CodeGroupItem>
</CodeGroup>

### Items.auto

**items.auto.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.auto.getListFile(persona: string, index?: number): Promise<RSS3AutoItemsList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const items = await rss3.items.auto.getListFile(rss3.account.address, -1);
```

</CodeGroupItem>
</CodeGroup>

**items.auto.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.auto.getList(persona: string, breakpoint?: (file: RSS3AutoItemsList) => boolean): Promise<RSS3AutoItem[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const autoItems = await rss3.auto.items.getList('0x1234567890123456789012345678901234567890');
```

</CodeGroupItem>
</CodeGroup>

**items.auto.backlinks.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.auto.getListFile(persona: string, index?: number): Promise<RSS3AutoItemsList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const backlinks = await rss3.items.auto.getListFile('0x1234567890123456789012345678901234567890', -1);
```

</CodeGroupItem>
</CodeGroup>

**items.auto.backlinks.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.auto.backlinks.getList(persona: string, breakpoint?: ((file: RSS3AutoItemsList) => boolean) | undefined): Promise<RSS3AutoItem[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const backlinks = await rss3.items.auto.backlinks.getList('0x1234567890123456789012345678901234567890');
```

</CodeGroupItem>
</CodeGroup>

### Items.custom

**items.custom.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.custom.getListFile(persona: string, index?: number): Promise<RSS3CustomItemsList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const items = await rss3.items.custom.getListFile(rss3.account.address, -1);
```

</CodeGroupItem>
</CodeGroup>

**items.custom.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.custom.getList(persona: string, breakpoint?: (file: RSS3AutoItemsList) => boolean): Promise<RSS3AutoItem[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const customItems = await rss3.items.custom.getList('0x1234567890123456789012345678901234567890');
```

</CodeGroupItem>
</CodeGroup>

**item.custom.post()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
item.custom.post(itemIn: Omit<RSS3CustomItem, 'id' | 'date_created' | 'date_updated'>): Promise<RSS3CustomItem>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const item = await rss3.item.custom.post({
    title: 'Hello RSS3',
    summary: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
```

</CodeGroupItem>
</CodeGroup>

**item.custom.patch**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
item.custom.patch(item: Partial<RSS3CustomItem> & {
    id: RSS3CustomItemID;
}): Promise<RSS3CustomItem | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const newItem = await rss3.item.custom.patch({
    id: '0x1234567890123456789012345678901234567890-item-custom-0',
    title: 'Hi RSS3',
});
```

</CodeGroupItem>
</CodeGroup>

**items.custom.backlinks.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.custom.getListFile(persona: string, index?: number): Promise<RSS3CustomItemsList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const backlinks = await rss3.items.custom.getListFile('0x1234567890123456789012345678901234567890', -1);
```

</CodeGroupItem>
</CodeGroup>

**items.custom.backlinks.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
items.custom.backlinks.getList(persona: string, breakpoint?: ((file: RSS3CustomItemsList) => boolean) | undefined): Promise<RSS3CustomItem[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const backlinks = await rss3.items.custom.backlinks.getList('0x1234567890123456789012345678901234567890');
```

</CodeGroupItem>
</CodeGroup>

### 链接

**links.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
links.getListFile(persona: string, id: string, index?: number): Promise<RSS3LinksList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const followers = await rss3.links.getListFile(rss3.account.address, 'following', -1);
```

</CodeGroupItem>
</CodeGroup>

**links.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
links.getList(persona: string, id: string, breakpoint?: ((file: RSS3LinksList) => boolean) | undefined): Promise<string[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const following = await rss3.links.getList(rss3.account.address, 'following');
```

</CodeGroupItem>
</CodeGroup>

**links.postList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
links.postList(links: {
    tags?: string[];
    id: string;
    list?: RSS3ID[];
}): Promise<{
    tags?: string[];
    id: string;
    list?: RSS3ID[];
}>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const following = await rss3.links.postList({
    id: 'following',
    list: ['0xd0B85A7bB6B602f63B020256654cBE73A753DFC4'],
});
```

</CodeGroupItem>
</CodeGroup>

**links.deleteList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
links.deleteList(id: string): Promise<{
    tags?: string[] | undefined;
    id: string;
    list?: string | undefined;
} | undefined>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const following = await rss3.links.deleteList('following');
```

</CodeGroupItem>
</CodeGroup>

**links.patchListTags()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
links.patchListTags(id: string, tags: string[]): Promise<{
    tags?: string[] | undefined;
    id: string;
    list?: string | undefined;
}>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const following = await rss3.links.patchListTags('following', ['test']);
```

</CodeGroupItem>
</CodeGroup>

**links.post()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
links.post(id: string, personaID: string): Promise<RSS3LinksList | undefined>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const following = await rss3.links.post('following', '0xd0B85A7bB6B602f63B020256654cBE73A753DFC4');
```

</CodeGroupItem>
</CodeGroup>

**links.delete()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
links.delete(id: string, personaID: string): Promise<string[] | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const following = await rss3.links.delete('following', '0xd0B85A7bB6B602f63B020256654cBE73A753DFC4');
```

</CodeGroupItem>
</CodeGroup>

### 反链

**backlinks.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
backlinks.getListFile(persona: string, id: string, index?: number): Promise<RSS3BacklinksList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const followers = await rss3.backlinks.getListFile(rss3.account.address, 'following', -1);
```

</CodeGroupItem>
</CodeGroup>

**backlinks.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
backlinks.getList(persona: string, id: string, breakpoint?: ((file: RSS3BacklinksList) => boolean) | undefined): Promise<string[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const followers = await rss3.backlinks.getList(rss3.account.address, 'following');
```

</CodeGroupItem>
</CodeGroup>

### 资产

**assets.getDetails()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
assets.getDetails(options: {
    assets: string[];
    full?: boolean;
}): Promise<AnyObject[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const details = await rss3.assets.getDetails({
    assets: ['xxx', 'xxx'],
    full: true,
});
```

</CodeGroupItem>
</CodeGroup>

### Assets.auto

**assets.auto.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
assets.auto.getListFile(persona: string, index?: number): Promise<RSS3AutoAssetsList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const assets = await rss3.assets.auto.getListFile(rss3.account.address, -1);
```

</CodeGroupItem>
</CodeGroup>

**assets.auto.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
assets.auto.getList(persona: string, breakpoint?: (file: RSS3AutoAssetsList) => boolean): Promise<RSS3AutoAsset[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const autoAssets = await rss3.auto.assets.getList('0x1234567890123456789012345678901234567890');
```

</CodeGroupItem>
</CodeGroup>

### Assets.custom

**assets.custom.getListFile()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
assets.custom.getListFile(persona: string, index?: number): Promise<RSS3AutoAssetsList | null>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const assets = await rss3.assets.custom.getListFile(rss3.account.address, -1);
```

</CodeGroupItem>
</CodeGroup>

**assets.custom.getList()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
assets.custom.getList(persona: string, breakpoint?: (file: RSS3CustomAssetsList) => boolean): Promise<RSS3CustomAsset[]>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const customAssets = await rss3.custom.assets.getList('0x1234567890123456789012345678901234567890');
```

</CodeGroupItem>
</CodeGroup>

**asset.custom.post()**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
asset.custom.post(asset: RSS3CustomAsset): Promise<RSS3CustomAsset>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const asset = await rss3.custom.asset.post('custom-gk-q-10035911');
```

</CodeGroupItem>
</CodeGroup>

**asset.custom.delete**

<CodeGroup>
<CodeGroupItem title="types" active>

```ts
asset.custom.delete(asset: RSS3CustomAsset): Promise<RSS3CustomAsset[] | undefined>
```

</CodeGroupItem>

<CodeGroupItem title="example">

```ts
const otherAsset = await rss3.asset.custom.delete('custom-gk-q-10035911');
```

</CodeGroupItem>
</CodeGroup>

## 开发

```bash
yarn
yarn dev
```

打开 <http://localhost:8080/demo/>

测试

```bash
yarn test
```
