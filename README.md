#Storage.js

JavaScript Library for Cross Browser Persistence using WebStorage (LocalStorage, SessionStorage, WebSQL and IndexedDB) for all browsers.

Basically it allows us to use any of the storage technologies in a standard way.

##Usage

Note: All objects are expected to have a unique ID in a property called ```id```.

###Get the instance
The simplest way to get an instance is to call the function 

```
storage(readyCallback [, type])
```

* <b>readyCallback</b> - Callback that is called when the storage is ready. The passed function receives the instance of the common API and should be used to retrieve it. <code>function(SJS sjs){}</code>
* <b>type</b> - This is an optional parameter that specifies which implementation of WebStorage you wish to use. I not specified the library will try to use IndexedDB falling back to WebSQL and LocalStorage if none of the previous two are available. Valid values are:
    * <code>'LocalStorage'</code>
    * <code>'SessionStorage'</code>
    * <code>'WebSQL'</code>
    * <code>'IndexedDB'</code>

###The SJS object
The SJS object is the central part of the library. This is the object that exposes, in a common way, the storage and retrieval operations.

The possible operations are <i>set, setAll, get, getAll, remove, removeAll and close</i>.

####set
Stores an object of a given entity. If an object with the same id exists it updates the stored object.

```
set(entity, value, callback)
```

* <b>entity</b> - Name of the entity to which this object should be associated.
* <b>value</b> - The Object to be stored.
* <b>callback</b> - Function called when the operation is complete. This function does not pass parameters.

####setAll
Stores all objects of a given entity. If objects with the same ids exist it updates the stored objects.

```
setAll(entity, values, callback)
```

* <b>entity</b> - Name of the entity to which these objects should be associated.
* <b>value</b> - The Objects to be stored, in an array.
* <b>callback</b> - Function called when the operation is complete. This function does not pass parameters.

####get
Retrieves a specified object of a given entity. This function has no return. The results are passed through the callback.

```
get(entity, id, callback)
```

* <b>entity</b> - Name of the entity from which you want to retrieve the object.
* <b>id</b> - The id of the object to be retrieved.
* <b>callback</b> - Function called when the operation is complete. The callback should be ```callback(sv){...}``` where sv is the retrieved object.

####getAll
Retrieves all objects of a given entity. This function has no return. The results are passed through the callback.

```
getAll(entity, callback)
```

* <b>entity</b> - Name of the entity from which you wish to retrieve all entries.
* <b>id</b> - The id of the object to be retrieved.
* <b>callback</b> - Function called when the operation is complete. The callback should be ```callback(svs){...}``` where svs is an array of the retrieved objects.

####remove

Removes a specific entry for a given entity.

```
remove(entity, id, callback)
```

* <b>entity</b> - Name of the entity from which you wish to remove the identified entry.
* <b>id</b> - The id of the object to be removed.
* <b>callback</b> - Function called when the operation is complete. This function does not pass parameters.

####removeAll
Removes all the extries for a given entity.

```
removeAll(entity, callback)
```

* <b>entity</b> - Name of the entity from which you wish to remove all entries.
* <b>id</b> - The id of the object to be retrieved.
* <b>callback</b> - Function called when the operation is complete. This function does not pass parameters.

####close
Closes the database connection. While this is not important for all implementations, it is good practice to close it if you no longer need it.

```
close()
```

##Practical examples
For practical example consult the unit tests. The unit tests can be run <a href="https://lcavadas.github.com/Storage.js/">here</a>. The source code for the tests can be viewed <a href="https://github.com/lcavadas/Storage.js/blob/master/qunit/storage.test.js">here</a>.

##Known Limitations
If IndexedDB is used only one connection can be established at a given time as external upgrades are not yet implemented.

##Next Version
* Implement the capability of external upgrades under IndexedDB.
* Allow the indexing of fields other than the object's id.
* Ability to query by something more than the object's id.

##Version History
<b>ver 0.1.0</b>:
<p>First working version of the API that is able to run the four implementations of WebStorage.</p>
