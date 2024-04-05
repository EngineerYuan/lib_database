class Abstract_Database
{
    static STATUS = {SUCCESS: 0x00, FAILURE: ~0x00, UPGRADE: 0xFF};

    static TRANSACTION_BUFFER = {READONLY: "readonly", READWRITE: "readwrite"};

    static EVENTS_BUFFER = {UPGRADE: "upgradeneeded", FAILURE: "error", SUCCESS: "success"};

    constructor()
    {
        this.handle = {request: null, database: null, activated: {transaction: null, table: null}};
    }

    success(data)
    {
        this.status = Database.STATUS.SUCCESS;

        this.data = data;
    }

    failure(data)
    {
        this.status = Database.STATUS.FAILURE;

        this.data = data;
    }

    type_error()
    {
        return this.failure(TypeError.name);
    }

    async event_callback(wrapper, event)
    {
        let callback = (resolve, reject) =>
            {
                let failure = ()=> event.call(this, resolve, reject, Database.STATUS.FAILURE, wrapper);

                wrapper.request.addEventListener(Database.EVENTS_BUFFER.FAILURE, failure);

                let upgrade = ()=> event.call(this, resolve, reject, Database.STATUS.UPGRADE, wrapper);

                wrapper.request.addEventListener(Database.EVENTS_BUFFER.UPGRADE, upgrade);

                let success = ()=> event.call(this, resolve, reject, Database.STATUS.SUCCESS, wrapper);

                wrapper.request.addEventListener(Database.EVENTS_BUFFER.SUCCESS, success);
            }

        return new Promise(callback);
    }

    event_create(resolve, reject, status, wrapper)
    {
        if (wrapper.request.result.constructor.name === IDBDatabase.name)
        {
            switch (status)
            {
                case Database.STATUS.UPGRADE:
                {
                    let store_option = Object.create(null);

                    store_option.keyPath = wrapper.attribute.path;

                    store_option.autoIncrement = wrapper.attribute.increment;

                    let store_object = wrapper.request.result.createObjectStore(wrapper.table, store_option);

                    let callback = (row) =>
                    {
                        store_option.unique = row.unique;

                        store_option.multiEntry = row.multiEntry;

                        store_object.createIndex(row.name, row.path, store_option);
                    }

                    wrapper.structure.forEach(callback);

                    this.success(wrapper.request);

                    resolve({status: this.status, data: this.data});
                }
                break;

                case Database.STATUS.SUCCESS:
                {
                    this.event_open(resolve, reject, status, wrapper);
                }
                break;

                case Database.STATUS.FAILURE:
                {
                    this.failure(wrapper.request);

                    reject({status: this.status, data: null});
                }
                break;

                default:
                {}
                break;
            }
        }
        else
        {
            reject(this.type_error())
        }
    }

    event_open(resolve, reject, status, wrapper)
    {
        if (wrapper.request.result.constructor.name === IDBDatabase.name)
        {
            switch (status)
            {
                case Database.STATUS.SUCCESS:
                {
                    this.handle.request = wrapper.request;

                    this.handle.database = this.handle.request.result;

                    this.success(this.handle.database);

                    resolve({status: this.status, data: this.data});
                }
                break;

                case Database.STATUS.FAILURE:
                {
                    open.status = Database.STATUS.FAILURE;

                    reject({status: this.status, data: null});
                }
                break;

                default:
                {}
                break;
            }
        }
        else
        {
            reject(this.type_error());
        }
    }

    event_query(resolve, reject, status, wrapper)
    {
        if (typeof wrapper.request.result === typeof {})
        {
            switch (status)
            {
                case Database.STATUS.SUCCESS:
                {
                    let result = wrapper.request.result;

                    let data = Object.create(null);

                    let attributes = {configurable: false, enumerable: false, writable: false};

                    let path = Object.assign({value: wrapper.request.source.keyPath}, attributes);

                    Object.defineProperty(data, "__path__", path);

                    let index = Object.assign({value: result[data["__path__"]]}, attributes);

                    Object.defineProperty(data, "__index__", index);

                    delete result[data["__path__"]];

                    for (const property in result)
                    {
                        Object.defineProperty(data, property, Object.assign({value: result[property]}, attributes));
                    }

                    this.success(data);

                    resolve({status: this.status, data: this.data});
                }
                break;

                case Database.STATUS.FAILURE:
                {
                    query.status = Database.STATUS.FAILURE;

                    reject({status: this.status, data: null});
                }
                break;

                default:
                {}
                break;
            }
        }
        else
        {
            reject(this.type_error());
        }
    }

    event_change(resolve, reject, status, wrapper)
    {
        if (wrapper.request.constructor.name === IDBRequest.name)
        {
            switch (status)
            {
                case Database.STATUS.SUCCESS:
                {
                    this.success(wrapper.request.result);

                    resolve({status: this.status, data: this.data});
                }
                break;

                case Database.STATUS.FAILURE:
                {
                    this.failure(wrapper.request.error.message);

                    reject({status: this.status, data: null});
                }
                break;

                default:
                {}
                break;
            }
        }
        else
        {
            reject(this.type_error());
        }
    }
}

class Database extends Abstract_Database
{
    constructor()
    {
        super();
    }

    async database_create(database, table, attribute, structure)
    {
        let validate_database = typeof database === typeof String();

        let validate_attribute = typeof attribute === typeof {};

        let validate_structure = Array.isArray(structure) === true;

        if (validate_database && validate_attribute && validate_structure)
        {
            let wrapper = Object.create(null);

            wrapper.request = window.indexedDB.open(database);

            wrapper.table = table;

            wrapper.attribute = attribute;

            wrapper.structure = structure;

            return this.event_callback(wrapper, this.event_create);
        }
        else
        {
            return new Promise((resolve, reject) => reject(this.type_error()));
        }
    }

    async database_open(database)
    {
        if (typeof database === typeof String())
        {
            let wrapper = Object.create(null);

            wrapper.request = window.indexedDB.open(database);

            return this.event_callback(wrapper, this.event_open);
        }
        else
        {
            return new Promise((resolve, reject) => reject(this.type_error()));
        }
    }

    database_transaction(table, mode)
    {
        if (typeof table === typeof String() && typeof mode === typeof String())
        {
            try
            {
                let transaction = this.handle.database.transaction(table, mode);

                this.handle.activated.transaction = transaction;

                let store = transaction.objectStore(table);

                this.handle.activated.table = store;

                return Database.STATUS.SUCCESS;
            }
            catch (error)
            {
                this.handle.activated.transaction = null;

                this.handle.activated.table = null;

                throw error;
            }
        }
        else
        {
            return Database.STATUS.FAILURE;
        }
    }

    database_tables()
    {
        if (this.handle.database !== null)
        {
            let tables = new Array();

            for (const table of this.handle.database.objectStoreNames)
            {
                tables.push(table);
            }

            return tables;
        }
        else
        {
            return new Array();
        }
    }

    async database_query(key)
    {
        if (typeof key === typeof String())
        {
            let wrapper = Object.create(null);

            wrapper.request = this.handle.activated.table.get(key);

            return this.event_callback(wrapper, this.event_query);
        }
        else
        {
            return new Promise((resolve, reject) => reject(this.type_error()));
        }
    }

    async database_insert(index, value)
    {
        if (typeof index === typeof String() && typeof value === typeof {})
        {
            let data = value;

            data[this.handle.activated.table.keyPath] = index;

            let wrapper = Object.create(null);

            wrapper.request = this.handle.activated.table.add(data);

            return this.event_callback(wrapper, this.event_change);
        }
        else
        {
            return new Promise((resolve, reject) => reject(this.type_error()));
        }
    }

    async database_update(index, value)
    {
        if (typeof index === typeof String() && typeof value === typeof {})
        {
            let data = value;

            data[this.handle.activated.table.keyPath] = index;

            let wrapper = Object.create(null);

            wrapper.request = this.handle.activated.table.put(data);

            return this.event_callback(wrapper, this.event_change);
        }
        else
        {
            return new Promise((resolve, reject) => reject(this.type_error()));
        }
    }

    async database_delete(index)
    {
        if (typeof index === typeof String())
        {
            let wrapper = Object.create(null);

            wrapper.request = this.handle.activated.table.delete(index);
            
            return this.event_callback(wrapper, this.event_change);
        }
        else
        {
            return new Promise((resolve, reject) => reject(this.type_error()));
        }
    }

    database_close()
    {
        this.handle.database.close();
    }
}
