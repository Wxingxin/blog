# react

下面给你一份「React 的 `useState` 使用大全 + 知识点大全」，覆盖：基础语法、惰性初始化、函数式更新、对象/数组更新、批处理、受控组件、性能与常见坑、以及和 `useEffect/useReducer` 的对比与最佳实践。

---

## 1) `useState` 是什么

* `useState` 是 React Hook，用来在**函数组件**里保存“状态”（state）。
* 调用后返回 **[state, setState]**：

  * `state`：当前状态值
  * `setState`：更新状态的函数（触发重新渲染）

```js
const [count, setCount] = useState(0);
```

---

## 2) 基础用法与语法要点

### 2.1 基本更新

```js
setCount(10);       // 直接设新值
setCount(count + 1) // 常见但有坑（见后文“函数式更新”）
```

### 2.2 初始值只在首渲染使用

```js
const [x, setX] = useState(props.initialX);
// props.initialX 后续变了，不会自动同步到 x
```

如果你需要 props 变化时同步，通常用 `useEffect` 去响应（但要谨慎，这往往意味着“派生状态”问题）。

---

## 3) setState 的核心规则（必背）

### 3.1 更新是“替换”，不是合并

类组件 `this.setState({a:1})` 会浅合并；但 `useState` 的更新是**整体替换**：

```js
const [user, setUser] = useState({ name: "a", age: 1 });

// ❌ 错：会把 user 替换成只有 age 的对象，name 丢了
setUser({ age: 2 });

// ✅ 对：自己做浅拷贝合并
setUser(prev => ({ ...prev, age: 2 }));
```

### 3.2 状态更新是异步“调度”的（你不能立刻读到新值）

```js
setCount(count + 1);
console.log(count); // 这里通常还是旧值
```

### 3.3 React 会批处理（batching）

同一个事件/同一次更新周期里，多次 `setX` 可能合并处理，减少渲染次数。
因此“依赖旧值”时要用 **函数式更新**（下一节）。

---

## 4) 函数式更新（Function Updater）——最重要的用法

### 4.1 为什么需要它

当你基于“旧值”计算新值时，直接用 `setCount(count + 1)` 可能踩到**闭包旧值 / 批处理**的问题。

### 4.2 正确写法

```js
setCount(prev => prev + 1);
```

### 4.3 连续加 3（经典面试题）

```js
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1);
// ✅ 最终 +3
```

---

## 5) 惰性初始化（Lazy Initialization）——性能关键点

如果初始值计算很重（比如从 localStorage 解析、复杂计算），别直接写在 `useState(heavyFn())`，因为虽然 React 只用一次初始值，但你写的 `heavyFn()` 在每次渲染都会执行（只是结果被丢掉）。

✅ 用“传函数”的方式惰性初始化：

```js
const [data, setData] = useState(() => {
  const raw = localStorage.getItem("key");
  return raw ? JSON.parse(raw) : [];
});
```

---

## 6) 更新对象 / 数组的正确姿势（不可变更新）

### 6.1 数组：增删改

```js
// 添加
setList(prev => [...prev, newItem]);

// 删除（按 id）
setList(prev => prev.filter(x => x.id !== id));

// 修改（按 id）
setList(prev => prev.map(x => x.id === id ? { ...x, done: true } : x));
```

### 6.2 深层对象：层层拷贝

```js
setState(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    address: {
      ...prev.profile.address,
      city: "Shanghai"
    }
  }
}));
```

> 深层更新太多、很痛苦时：考虑拆分 state，或用 `useReducer`，或引入 immer（如果项目允许）。

---

## 7) “相等则不重渲染”与引用类型坑

React 会用 `Object.is(newState, oldState)` 判断是否需要重新渲染：

* 如果你 `setState(oldState)`（同一个引用/同一个值），不会触发重渲染。
* 对象/数组如果你“原地修改”再 set 同一个引用，React 以为没变。

```js
// ❌ 原地改
list.push(1);
setList(list); // 可能不渲染（引用没变）

// ✅ 不可变改
setList(prev => [...prev, 1]);
```

---

## 8) 受控组件（表单）useState 常用范式

### 8.1 单输入框

```js
const [value, setValue] = useState("");

<input value={value} onChange={e => setValue(e.target.value)} />
```

### 8.2 多字段表单（对象 state）

```js
const [form, setForm] = useState({ email: "", pwd: "" });

const onChange = e => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};

<input name="email" value={form.email} onChange={onChange} />
<input name="pwd" value={form.pwd} onChange={onChange} />
```

---

## 9) 与 `useEffect` 的配合：同步外部副作用，而不是同步 state

典型：把 state 写入 localStorage

```js
useEffect(() => {
  localStorage.setItem("count", String(count));
}, [count]);
```

不要滥用：`useEffect(() => setX(props.x), [props.x])` 往往是“派生状态”，容易制造双源真相。

---

## 10) 常见坑总结（高频）

1. **依赖旧值不用函数式更新**
   ✅ `setCount(prev => prev + 1)`

2. **以为会合并对象**（不会）
   ✅ `setObj(prev => ({...prev, a:1}))`

3. **原地修改数组/对象**
   ✅ 用展开、`map/filter` 等不可变更新

4. **初始值依赖 props，但 props 变了 state 不变**
   ✅ 重新设计数据流或谨慎用 effect

5. **把多个互不相关的字段塞进一个大对象 state**
   ✅ 拆分成多个 `useState`，或用 `useReducer`

6. **把“能由现有数据算出来的值”也存 state**（派生状态）
   ✅ 直接计算或 `useMemo`

---

## 11) 什么时候用 useState，什么时候用 useReducer

* 用 `useState`：简单值、少量字段、更新逻辑很直观。
* 用 `useReducer`：

  * 状态字段多、更新规则复杂
  * 多处触发同一种更新
  * 希望把更新逻辑集中管理（类似 Redux 思路）

---

## 12) 实战小抄（你可以直接复制）

### 12.1 toggle

```js
setOpen(prev => !prev);
```

### 12.2 基于旧对象改一个字段

```js
setUser(prev => ({ ...prev, age: prev.age + 1 }));
```

### 12.3 追加到数组

```js
setItems(prev => [...prev, item]);
```

### 12.4 删除数组元素

```js
setItems(prev => prev.filter(x => x !== target));
```

### 12.5 更新数组内某个对象

```js
setItems(prev => prev.map(x => x.id === id ? { ...x, name: "new" } : x));
```

---

如果你愿意，我也可以按你的水平/场景再给你一份“`useState` 面试题清单（含答案）”或者“从 0 到 1 的表单/列表 CRUD 实战示例（一个组件里把 useState 用透）”。
