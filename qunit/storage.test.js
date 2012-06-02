/*globals storage:false, module:false, test:false, asyncTest:false, start:false, expect:false, ok:false, equal:false, notEqual:false, notEqual:false, cob:false */

$(document).ready(function() {

    module("LocalStorage");
    asyncTest("set unexistant adds new", function() {
        storage(function(storage) {
            _cleanup(storage,unexistantAddsNew);
        }, 'LocalStorage');
    });
    asyncTest("set existant updates", function() {
        storage(function(storage) {
            _cleanup(storage,existantUpdates);
        }, 'LocalStorage');
    });
    asyncTest("setAll adds/updates all values", function() {
        storage(function(storage) {
            _cleanup(storage,setAllAddsAndUpdatesAllValues);
        }, 'LocalStorage');
    });
    asyncTest("remove", function() {
        storage(function(storage) {
            _cleanup(storage,remove);
        }, 'LocalStorage');
    });
    asyncTest("getAll", function() {
        storage(function(storage) {
            _cleanup(storage,getAll);
        }, 'LocalStorage');
    });
    asyncTest("removeAll", function() {
        storage(function(storage) {
            _cleanup(storage,removeAll);
        }, 'LocalStorage');
    });

    module("SessionStorage");
    asyncTest("set unexistant adds new", function() {
        storage(function(storage) {
            _cleanup(storage,unexistantAddsNew);
        }, 'SessionStorage');
    });
    asyncTest("set existant updates", function() {
        storage(function(storage) {
            _cleanup(storage,existantUpdates);
        }, 'SessionStorage');
    });
    asyncTest("setAll adds/updates all values", function() {
        storage(function(storage) {
            _cleanup(storage,setAllAddsAndUpdatesAllValues);
        }, 'SessionStorage');
    });
    asyncTest("remove", function() {
        storage(function(storage) {
            _cleanup(storage,remove);
        }, 'SessionStorage');
    });
    asyncTest("getAll", function() {
        storage(function(storage) {
            _cleanup(storage,getAll);
        }, 'SessionStorage');
    });
    asyncTest("removeAll", function() {
        storage(function(storage) {
            _cleanup(storage,removeAll);
        }, 'SessionStorage');
    });

    module("WebSQL");
    asyncTest("set unexistant adds new", function() {
        storage(function(storage) {
            _cleanup(storage,unexistantAddsNew);
        }, 'WebSQL');
    });
    asyncTest("set existant updates", function() {
        storage(function(storage) {
            _cleanup(storage,existantUpdates);
        }, 'WebSQL');
    });
    asyncTest("setAll adds/updates all values", function() {
        storage(function(storage) {
            _cleanup(storage,setAllAddsAndUpdatesAllValues);
        }, 'WebSQL');
    });
    asyncTest("remove", function() {
        storage(function(storage) {
            _cleanup(storage,remove);
        }, 'WebSQL');
    });
    asyncTest("getAll", function() {
        storage(function(storage) {
            _cleanup(storage,getAll);
        }, 'WebSQL');
    });
    asyncTest("removeAll", function() {
        storage(function(storage) {
            _cleanup(storage,removeAll);
        }, 'WebSQL');
    });

var _cleanup = function(storage, test) {
        if(!storage){
            ok(true,"Database is not supported, Skipping test");
            start();
            return;
        }
        storage.removeAll("unexistantAddsNew", function() {
            storage.removeAll("existantUpdates", function() {
                storage.removeAll("setAllAddsAndUpdatesAllValues", function() {
                    storage.removeAll("getAll", function() {
                        storage.removeAll("remove", function() {
                            storage.removeAll("removeAll", function() {
                                test(storage);
                            });
                        });
                    });
                });
            });
        });
    };

    var unexistantAddsNew = function(storage) {
        var testValue = {id: 1, name: "sample 1"};
        storage.set("unexistantAddsNew", testValue, function() {
            storage.get("unexistantAddsNew", 1, function(value) {
                equal(value.id, testValue.id, "retrieved value matches sent value id");
                equal(value.name, testValue.name, "retrieved value matches sent value name");
                start();
            });
        });
    };

    var existantUpdates = function(storage) {
        var testValue = {id: 1, name: "sample 1"};

        storage.set("existantUpdates", testValue, function() {
            storage.get("existantUpdates", 1, function(value) {
                equal(value.id, testValue.id, "original retrieved value matches sent value id");
                equal(value.name, testValue.name, "original retrieved value matches sent value name");
                storage.set("existantUpdates", {id: 1, name: "ahaha"}, function() {
                    storage.get("existantUpdates", 1, function(value) {
                        equal(value.id, testValue.id, "set retrieved value matches sent value id");
                        equal(value.name, "ahaha", "set retrieved value matches new value name");
                        start();
                    });
                });
            });
        });
    };

    var setAllAddsAndUpdatesAllValues = function(storage) {
        var testValue = {id: 1, name: "sample 1"};
        var otherValue = {id: 2, name: "sample 2"};

        storage.set("setAllAddsAndUpdatesAllValues", testValue, function() {
            storage.get("setAllAddsAndUpdatesAllValues", 1, function(value) {
                equal(value.id, testValue.id, "retrieved value matches sent value id");
                equal(value.name, testValue.name, "retrieved value matches sent value name");
                storage.setAll("setAllAddsAndUpdatesAllValues", [
                    {id: 1, name: "ahaha"},
                    otherValue
                ], function() {
                    storage.getAll("setAllAddsAndUpdatesAllValues", function(values) {
                        equal(values[0].id, testValue.id, "retrieved value matches sent value id");
                        equal(values[0].name, "ahaha", "retrieved value matches new value name");
                        equal(values[1].id, otherValue.id, "retrieved value matches sent value id");
                        equal(values[1].name, otherValue.name, "retrieved value matches new value name");
                        start();
                    });
                });
            });
        });
    };

    var getAll = function(storage) {
        var testValue = {id: 1, name: "sample 1"};
        var otherValue = {id: 2, name: "sample 2"};
        storage.setAll("getAll", [testValue, otherValue], function() {
            storage.getAll("getAll", function(values) {
                equal(values.length, 2, "has two results");
                equal(values[0].id, 1, "id of first element");
                equal(values[0].name, "sample 1", "name of first element");
                equal(values[1].id, 2, "id of second element");
                equal(values[1].name, "sample 2", "name of second element");
                start();
            });
        });
    };

    var remove = function(storage) {
        var testValue = {id: 1, name: "sample 1"};
        var otherValue = {id: 2, name: "sample 2"};
        storage.setAll("remove", [testValue, otherValue], function() {
            storage.remove("remove", 1, function() {
                storage.getAll("remove", function(values) {
                    equal(values.length, 1, "has one result");
                    equal(values[0].id, 2, "id of element");
                    equal(values[0].name, "sample 2", "name of element");
                    start();
                });
            });
        });
    };

    var removeAll = function(storage) {
        var testValue = {id: 1, name: "sample 1"};
        var otherValue = {id: 2, name: "sample 2"};
        storage.setAll("removeAll", [testValue, otherValue], function() {
            storage.removeAll("removeAll", function() {
                storage.getAll("removeAll", function(values) {
                    equal(values.length, 0, "has no results");
                    start();
                });
            });
        });
    };

});
