# lib_database

`lib_database` 是一款便携的 Javascript IndexedDB API 接口，遵从 public domain license 协议。

✈️ [English](https://github.com/EngineerYuan/lib_database/blob/main/README.md) ✈️[中文](https://github.com/EngineerYuan/lib_database/blob/main/README_ZH-CN.md)

## 使用 lib_database

``` js
// 创建数据库
let database = new Database();
let database_name = "database_example";
let database_table = "table_example";
let database_attribute = {path: "__path__", increment: false};
let tables = [
    { name: "id", path: database_attribute.path, unique: false, multi_entry: false },
    { name: "age", path: database_attribute.path, unique: false, multi_entry: false },
    { name: "address", path: database_attribute.path, unique: false, multi_entry: false }
];
/**
 * 功能：创建数据库
 * 结果：创建成功! {status: Database.STATUS.SUCCESS, data: IDBOpenDBRequest}
 */
database.database_create(database_name, database_table, database_attribute, tables)
.then((resolve) =>
{
    console.log("创建成功!", resolve)
})
.catch((resolve) =>
{
    console.log("创建失败", resolve)
});
```
![创建数据库](https://xxxxxxxx.xxxxx)

## lib_database 接口

+ 创建数据库：database_create(database, table, attribute, structure)
+ 打开数据库：database_open(database)
+ 开始事务：database_transaction(table, mode)
+ 获取所有表名：database_tables()
+ 查找数据：database_query(key)
+ 插入数据：database_insert(index, value)
+ 更改数据：database_update(index, value)
+ 删除数据：database_delete(index)
+ 关闭数据库：database_close()

## 说明
💌 嗨！我亲爱的朋友们，我来自中国江苏的工程师，非常期待能在这里找到志同道合的朋友。今年的清明节休假期间，我编写了 `lib_database` 库，它会更方便的帮我们操作 IndexedDB API，大家的关注，我会在今后逐步完善它。

## License
[public domain license](https://creativecommons.org/public-domain/)
