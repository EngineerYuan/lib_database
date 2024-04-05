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

/**
 * Opening the database
 * {status: Database.STATUS.SUCCESS, database: IDBDatabase}
 */
database.database_open(database_name).then((resolve, reject) => {
    /**
     * Starting transaction
     * Database.STATUS.SUCCESS
     */
    console.log(database.database_transaction(database_table, Database.TRANSACTION_BUFFER.READWRITE));

    /**
     * Getting all table names
     * ['table_example']
     */
    console.log(database.database_tables());

    let index = "Alex", id = 10010, age = 28, address = "中国"
    /**
     * Inserting the data
     * OK {status: Database.STATUS.SUCCESS, name: 'done', message: 'Adler'}
     */
    database.database_insert(index, {id: id, age: age, address: address}).then(resolve => console.log(resolve)).catch(resolve => console.log(resolve));

    /**
     * Querying the data
     * {status: Database.STATUS.SUCCESS, data: {…}}
     */
    database.database_query(index).then(resolve => console.log(resolve)).catch(resolve => console.log(resolve));
    
    /**
     * Updating the data
     * {status: Database.STATUS.SUCCESS, name: 'done', message: 'Adler'}
     */
    // database.database_update(index, {id: 20066, age: 10220, address: "Canada"}).then(resolve => console.log(resolve))

    /**
     * Querying the data
     * {status: Database.STATUS.SUCCESS, data: {…}}
     */
    // database.database_query(index).then(resolve => console.log(resolve)).catch(resolve => console.log(resolve));
    
    /**
     * Deleting the data
     */
    // database.database_delete(index).then(resolve => console.log(resolve)).catch(resolve => console.log(resolve));
})
