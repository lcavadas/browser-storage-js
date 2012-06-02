/*!
 * Storage.js JavaScript Library v0.1.0
 * https://github.com/lcavadas/Storage.js
 *
 * Copyright 2012, Luís Serralheiro
 */

var storage = function (readyCallback, type) {

    var commons = {
        multipleActionCallbackWrapper:function (times, callback) {
            var values = [];

            return {
                countDown:function (value) {
                    values.push(value);
                    if (values.length === (times)) {
                        callback(values);
                    }
                }
            };
        }
    };

    var invokeReadyCallBack = function (database) {
        if (!database) {
            readyCallback();
        } else {
            readyCallback({
                set:function (entity, value, callback) {
                    window.console.log("Setting " + entity, value);
                    database.set(entity, value, callback);
                },
                setAll:function (entity, values, callback) {
                    window.console.log("Setting all " + entity, values);
                    database.setAll(entity, values, callback);
                },
                get:function (entity, id, callback) {
                    database.get(entity, id, callback);
                },
                getAll:function (entity, callback) {
                    database.getAll(entity, callback);
                },
                remove:function (entity, id, callback) {
                    database.remove(entity, id, callback);
                },
                removeAll:function (entity, callback) {
                    window.console.log("Removing all " + entity);
                    database.removeAll(entity, callback);
                },
                ready:function (callback) {
                    database.ready(callback);
                }
            });
        }
    };

    switch (type) {
        case 'LocalStorage':
            storage.KeyValue(invokeReadyCallBack, commons);
            break;
        case 'SessionStorage':
            storage.KeyValue(invokeReadyCallBack, commons, true);
            break;
        case 'WebSQL':
            storage.WebSQL(invokeReadyCallBack, commons);
            break;
//          Still in draft, will implement later
//        case 'IndexedDB':
//            storage.IndexedDB(invokeReadyCallBack, commons);
//            break;
        default :
            //WebSQL
            if (window.openDatabase) {
                window.console.log("Using WebSQL");
                storage.WebSQL(invokeReadyCallBack, commons);
//          IndexedDB Still in draft, will implement later
//            } else if (window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB) {
//                storage.IndexedDB(invokeReadyCallBack, commons);
            } else {
                window.console.log("Using LocalStorage");
                //Fallback to localStorage
                storage.KeyValue(invokeReadyCallBack, commons);
            }
            break;
    }
};

// localStorage and sessionStorage wrapper
//      useSession: Indicates if sessionStorage is to be used (default is localStorage)
storage.KeyValue = function (ready, commons, useSession) {

    try {
        var storage = useSession ? sessionStorage : localStorage;
    } catch (e) {
        ready();
        return;
    }

    var _get = function (entity, id, callback) {
        var stored = JSON.parse(storage.getItem(entity));
        var length = stored.length;

        for (var i = 0; i < length; i++) {
            if (stored[i].id === id) {
                callback(stored[i]);
                return;
            }
        }
        callback();
    };

    var _set = function (entity, value, callback) {
        var stored = JSON.parse(storage.getItem(entity)) || [];
        var updated = false;
        var length = stored.length;

        for (var i = 0; i < length; i++) {
            if (stored[i].id === value.id) {
                updated = true;
                stored[i] = value;
            }
        }
        if (!updated) stored.push(value);

        storage.setItem(entity, JSON.stringify(stored));

        callback();
    };

    var _clear = function (key) {
        storage.setItem(key, undefined);
    };

    var _remove = function (entity, id) {
        var stored = JSON.parse(storage.getItem(entity));
        var length = stored.length;

        for (var i = 0; i < length; i++) {
            if (stored[i].id === id) {
                stored.splice(i, 1);
                storage.setItem(entity, JSON.stringify(stored));
                return;
            }
        }
    };

    ready({
        set:_set,
        setAll:function (entity, values, callback) {
            var responseCallback = commons.multipleActionCallbackWrapper(values.length, callback);
            values.forEach(function (value) {
                _set(entity, value, responseCallback.countDown);
            });
        },
        get:_get,
        getAll:function (entity, callback) {
            var value = storage.getItem(entity);
            callback(value ? JSON.parse(value) : []);
        },
        remove:function (entity, id, callback) {
            _remove(entity, id);
            callback();
        },
        removeAll:function (entity, callback) {
            storage.removeItem(entity);
            callback();
        }
    });
};

storage.WebSQL = function (ready, commons) {
    var db;

    var _createTable = function (name, callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql(
                    'CREATE TABLE if not exists ' + name + '(id TEXT NOT NULL, value TEXT, PRIMARY KEY(id));',
                    [],
                    callback,
                    function (transaction, error) {
                        window.console.log('Oops.  Error was ' + error.message + ' (Code ' + error.code + ')', error);
                    }
                );
            }
        );
    };

    var _set = function (entity, value, callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql(
                    'INSERT OR REPLACE into ' + entity + '(id, value) VALUES ( ?, ? );',
                    [value.id, JSON.stringify(value)],
                    function () {
                        callback();
                    },
                    function (transaction, error) {
                        //No such table
                        if (error.code === 5) {
                            window.console.log("WebSQL: going to create table " + entity);
                            //create the table and try again
                            _createTable(entity, function () {
                                window.console.log("WebSQL: created table " + entity);
                                _set(entity, value, callback);
                            });
                        } else {
                            window.console.log('WebSQL Error: ' + error.message + ' (Code ' + error.code + ')', error);
                            callback();
                        }
                    }
                );
            });
    };

    var _get = function (entity, id, callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "select value from " + entity + " where id=?;",
                    [ id ],
                    function (transaction, results) {
                        callback(results.rows.length > 0 ? JSON.parse(results.rows.item(0).value) : undefined);
                    },
                    function (transaction, error) {
                        //No such table
                        if (error.code === 5) {
                            callback();
                        } else {
                            window.console.log('WebSQL Error: ' + error.message + ' (Code ' + error.code + ')', error);
                            callback();
                        }
                    }
                );
            }
        );
    };

    var _getAll = function (entity, callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "select value from " + entity,
                    [  ],
                    function (transaction, results) {
                        var objectArray = [];
                        var length = results.rows.length;
                        for (var i = 0; i < length; i++) {
                            objectArray.push(JSON.parse(results.rows.item(i).value));
                        }
                        callback(objectArray);
                    },
                    function (transaction, error) {
                        //No such table
                        if (error.code === 5) {
                            callback([]);
                        } else {
                            window.console.log('WebSQL Error: ' + error.message + ' (Code ' + error.code + ')', error);
                            callback();
                        }
                    }
                );
            }
        );
    };

    var _remove = function (entity, id, callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "delete from " + entity + " where id=?",
                    [ id ],
                    callback,
                    function (transaction, error) {
                        window.console.log('WebSQL Error: ' + error.message + ' (Code ' + error.code + ')', error);
                        callback();
                    }
                );
            }
        );
    };

    var _removeAll = function (entity, callback) {
        db.transaction(
            function (transaction) {
                transaction.executeSql(
                    "drop table " + entity + "",
                    [  ],
                    callback,
                    //table doesnt exist
                    callback
                );
            }
        );
    };

    var _init = (function () {
        try {
            if (!window.openDatabase) {
                window.console.log('SQL Database not supported');
                ready();
            } else {
                var shortName = 'storage.js';
                var version = '1.0';
                var displayName = 'storage.js database';
                var maxSize = 65536; // in bytes
                db = openDatabase(shortName, version, displayName, maxSize);

                ready({
                    set:_set,
                    setAll:function (entity, values, callback) {
                        var responseCallback = commons.multipleActionCallbackWrapper(values.length, callback);
                        values.forEach(function (value) {
                            _set(entity, value, responseCallback.countDown);
                        });
                    },
                    get:_get,
                    getAll:_getAll,
                    remove:_remove,
                    removeAll:_removeAll
                });
            }
        } catch (e) {
            // Error handling code goes here.
            if (e === 2) {
                // Version number mismatch.
                window.console.log("Invalid database version.");
            } else {
                window.console.log("Unknown error " + e + ".");
            }
        }
    })();
};

storage.IndexedDB = function (ready, commons) {
    //Still in draft, will implement later
};