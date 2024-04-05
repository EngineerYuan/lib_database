# lib_database

`lib_database` is a portable Javascript IndexedDB API interface published under the public domain license protocol.

✈️ [English](https://github.com/EngineerYuan/lib_database/blob/main/README.md) ✈️[中文](https://github.com/EngineerYuan/lib_database/blob/main/README_ZH-CN.md)

## Using lib_database

``` js
// Creating a database
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
 * Function: Create a database
 * Result: Created successfully! {status: Database.STATUS.SUCCESS, data: IDBOpenDBRequest}
 */
database.database_create(database_name, database_table, database_attribute, tables)
.then((resolve) =>
{
    console.log("Created successfully!", resolve)
})
.catch((resolve) =>
{
    console.log("Created failed", resolve)
});
```

## lib_database Interface

+ Creating the database：database_create(database, table, attribute, structure)
+ Opening the database：database_open(database)
+ Starting transaction：database_transaction(table, mode)
+ Getting all table names：database_tables()
+ Querying the data：database_query(key)
+ Inserting the data：database_insert(index, value)
+ Updating the data：database_update(index, value)
+ Deleting the data：database_delete(index)
+ Closing the database：database_close()

## Description
💌 Hi! My dear friends, I am an engineer from Jiangsu, China, and I am looking forward to finding like-minded friends here. During this year's Qingming Festival holiday, I wrote the `lib_database` library, which will make it more convenient for us to operate the IndexedDB API. If you pay attention, I will gradually improve it in the future.

## License
[public domain license](https://creativecommons.org/public-domain/)
