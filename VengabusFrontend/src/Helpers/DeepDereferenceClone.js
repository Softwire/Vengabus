function deepDereferenceClone(obj) {

    //primitives or functions
    function isNonRecursive(obj) {
        return Object(obj) !== obj || typeof obj === 'function';
    }

    if (isNonRecursive(obj)) {
        return obj;
    }

    let ret = Array.isArray(obj) ? [] : {};

    function dfsCopy(sourceNode, cloneNode) {
        //current sourceNode is an array
        if (Array.isArray(sourceNode)) {
            for (let i = 0; i < sourceNode.length; i++) {
                let currentNode = sourceNode[i];
                if (isNonRecursive(currentNode)) {
                    cloneNode.push(currentNode);
                    continue;
                }
                cloneNode.push(Array.isArray(currentNode) ? [] : {});
                dfsCopy(currentNode, cloneNode[i]);
            }
        }
        //current sourceNode is an object
        else {
            let keys = Object.keys(sourceNode);
            for (let i = 0; i < keys.length; i++) {
                let currentNode = sourceNode[keys[i]];
                if (isNonRecursive(currentNode)) {
                    cloneNode[keys[i]] = currentNode;
                    continue;
                }
                cloneNode[keys[i]] = Array.isArray(currentNode) ? [] : {};
                dfsCopy(currentNode, cloneNode[keys[i]]);
            }
        }
    }
    dfsCopy(obj, ret);
    return ret;
}

export { deepDereferenceClone };

/*
This version deals with circular references as well, but that seems like 'a buggy thing to want'.

function deepDereferenceClone(obj) {

    function isNonRecursive(obj) {
        return Object(obj) !== obj || typeof obj === 'function';
    }

    if (isNonRecursive(obj)) {
        return obj;
    }

    let ret = Array.isArray(obj) ? [] : {};
    let sourceStack = [obj];
    let keyStack = ['root'];

    function dfsCopy(sourceNode, cloneNode) {
        //current sourceNode is an array
        if (Array.isArray(sourceNode)) {
            for (let i = 0; i < sourceNode.length; i++) {
                let currentNode = sourceNode[i];
                if (isNonRecursive(currentNode)) {
                    cloneNode.push(currentNode);
                    continue;
                }
                let cyclicRefIndex = sourceStack.indexOf(currentNode);
                if (cyclicRefIndex >= 0) {
                    cloneNode.push("Cyclic reference detected: " + keyStack.join('.') + '[' + i + ']  is a reference to ' + keyStack.slice(0, cyclicRefIndex + 1).join('.'));
                    continue;
                }
                cloneNode.push(Array.isArray(currentNode) ? [] : {});
                sourceStack.push(currentNode);
                keyStack.push('[' + i + ']');
                dfsCopy(currentNode, cloneNode[i]);
                keyStack.pop();
                sourceStack.pop();
            }
        }
        //current sourceNode is an object
        else {
            let keys = Object.keys(sourceNode);
            for (let i = 0; i < keys.length; i++) {
                let currentNode = sourceNode[keys[i]];
                if (isNonRecursive(currentNode)) {
                    cloneNode[keys[i]] = currentNode;
                    continue;
                }
                let cyclicRefIndex = sourceStack.indexOf(currentNode);
                if (cyclicRefIndex >= 0) {
                    cloneNode[keys[i]] = "Cyclic reference detected: " + keyStack.join('.') + '.' + keys[i] + ' is a reference to ' + keyStack.slice(0, cyclicRefIndex + 1).join('.');
                }
                cloneNode[keys[i]] = Array.isArray(currentNode) ? [] : {};
                sourceStack.push(currentNode);
                keyStack.push(keys[i]);
                dfsCopy(currentNode, cloneNode[keys[i]]);
                keyStack.pop();
                sourceStack.pop();
            }
        }
    }
    dfsCopy(obj, ret);
    return ret;
}
*/