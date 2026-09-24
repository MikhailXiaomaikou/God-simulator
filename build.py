#!/usr/bin/env python3
"""把 src/ 打包成根目录的单文件 index.html（唯一的入口）。

根目录的 index.html 不依赖任何旁边的文件：只拿到这一个文件（预览窗、下载、转发）也能直接打开。
源码全在 src/：src/index.html 是开发用的舞台，引用 src/css、src/js、src/fonts。
改完源码运行 `python3 build.py` 重新生成根目录的 index.html。
"""
import base64, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')

def read(p):
    with open(os.path.join(SRC, p), encoding='utf-8') as f:
        return f.read()

def font_uri(m):
    path = os.path.normpath(os.path.join('css', m.group(1)))
    with open(os.path.join(SRC, path), 'rb') as f:
        data = base64.b64encode(f.read()).decode('ascii')
    return "url('data:font/woff2;base64,%s')" % data

def css(m):
    s = re.sub(r"url\('([^']+\.woff2)'\)", font_uri, read(m.group(1)))
    return '<style>\n%s\n</style>' % s.replace('</style', '<\\/style')

def js(m):
    s = read(m.group(1)).replace('</script', '<\\/script')
    return '<script>\n/* %s */\n%s\n</script>' % (m.group(1), s)

html = read('index.html')
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', js, html)
html = html.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- 由 build.py 从 src/ 生成，请勿直接修改；源码见 src/ -->', 1)
with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html)
print('index.html', len(html.encode('utf-8')), 'bytes')
