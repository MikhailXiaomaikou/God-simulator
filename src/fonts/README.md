# 字体

本作用三种开源中文书法字体。每种字体只保留作品里实际出现的字，压成 WOFF2 后随作品一起分发，因此离线打开也能正常显示。

| 文件 | 字体 | 用途 | 许可 |
| --- | --- | --- | --- |
| `zhimangxing.woff2` | 志莽行书 Zhi Mang Xing | 神的话语、标题「七日」、终幕「安息」 | SIL OFL 1.1（`OFL-ZhiMangXing.txt`） |
| `mashanzheng.woff2` | 马善政毛笔楷书 Ma Shan Zheng | 由粒子聚成的万物之名、七日之印、生灵之名 | SIL OFL 1.1（`OFL-MaShanZheng.txt`） |
| `wenkai.woff2` | 霞鹜文楷 LXGW WenKai | 经文、提示、说明、创世日志 | SIL OFL 1.1（`OFL-LXGWWenKai.txt`） |

子集的字表是从 `src/js/`、`src/js/book/`、`src/index.html` 和 `src/css/` 的字符串里提取的（旧约新约全书约 2500 字，三种字体都含全部字表，合计约 2.4MB）。志莽行书和马善政里没有的几个僻字（如「氾」「洑」「跐」），由霞鹜文楷补上。如果以后新增了字表之外的汉字，这些字会退回系统字体显示。要补上它们，需要用原始字体重新生成子集，例如使用 [subset-font](https://www.npmjs.com/package/subset-font)。
