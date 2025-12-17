# other

学习 **JavaScript 文件上传**，最有效的路线是：先把「前端选文件 → 预览/校验 → 发到后端」跑通，再补进阶（进度条、取消、断点续传、直传云等）。下面给你一条能一步步练出来的学习路径 + 最小可运行示例。

---

## 1）先掌握最小闭环：`<input type="file">` + `FormData` + `fetch`

### 前端（HTML + JS）

```html
<input id="file" type="file" />
<button id="btn">上传</button>

<script>
  const fileInput = document.getElementById("file");
  const btn = document.getElementById("btn");

  btn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) return alert("先选一个文件");

    // 1) 组装 multipart/form-data
    const fd = new FormData();
    fd.append("file", file); // 字段名叫 file
    fd.append("note", "hello"); // 也可以带其他字段

    // 2) 发请求
    const res = await fetch("/upload", {
      method: "POST",
      body: fd, // 注意：不要手动设置 Content-Type，浏览器会自动加 boundary
    });

    if (!res.ok) return alert("上传失败");
    const data = await res.json();
    console.log("上传成功：", data);
    alert("上传成功");
  });
</script>
```

> 这一段你必须吃透：`files[0]`、`FormData.append()`、`fetch` POST。

---

## 2）后端随便用一个：Node/Express（最常见）

如果你用 Node.js，最简单就是 Express + multer：

### 后端（Node.js + Express）

```js
import express from "express";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  // req.file 就是上传的文件信息
  res.json({
    ok: true,
    filename: req.file.filename,
    original: req.file.originalname,
  });
});

app.listen(3000, () => console.log("http://localhost:3000"));
```

你能把这套跑起来，就完成了 60% 的“文件上传”技能。

---

## 3）第二阶段：做“真实产品必备”的校验与体验

### 常见前端校验（上传前）

- 文件大小：`file.size`
- 类型：`file.type`（但别完全信它，后端也要校验）
- 扩展名：`file.name.endsWith(".png")`
- 预览图片：`URL.createObjectURL(file)`

示例（大小限制 10MB）：

```js
if (file.size > 10 * 1024 * 1024) {
  alert("文件太大（>10MB）");
  return;
}
```

---

## 4）第三阶段：进度条、取消上传（需要 XHR）

`fetch` 目前在浏览器里做上传进度不如 `XMLHttpRequest` 直接（有 `upload.onprogress`）。

### 进度条（XHR）

```js
const xhr = new XMLHttpRequest();
xhr.open("POST", "/upload");

xhr.upload.onprogress = (e) => {
  if (e.lengthComputable) {
    const percent = Math.round((e.loaded / e.total) * 100);
    console.log("进度：", percent, "%");
  }
};

xhr.onload = () => console.log("完成", xhr.responseText);
xhr.onerror = () => console.log("失败");

const fd = new FormData();
fd.append("file", file);
xhr.send(fd);

// 取消：xhr.abort()
```

---

## 5）第四阶段：大文件与云直传（选学但很重要）

你后面会遇到这些：

- **分片上传**（把文件切成 chunk：`file.slice(start,end)`）
- **断点续传**（记录已上传分片）
- **秒传**（hash 去重）
- **直传到 S3/OSS/COS**（后端签名，前端直传，压力小）

---

## 推荐你按这个顺序练（不绕路）

1. 能选文件并拿到 `File` 对象
2. 用 `FormData + fetch` 上传成功
3. 后端接收并保存文件（知道字段名必须一致）
4. 加大小/类型校验 + 预览
5. 用 XHR 做进度条 + 取消
6. 再做分片/断点续传/云直传

---

如果你告诉我你现在用的是 **纯前端想练（无后端）**、还是 **Node / Java / Python 后端**，我可以给你一套更贴合的“可直接运行项目模板”（含目录结构和命令）。
