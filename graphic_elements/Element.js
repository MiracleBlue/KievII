var KIEVII = KIEVII || {};
KIEVII.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = KIEVII,
        i;
    // strip redundant leading global
    if (parts[0] === "KIEVII") {
        parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

KIEVII.namespace('graphicElements.Element');

KIEVII.graphicElements.Element = function (name, topleft) {
    if (arguments.length) {
        this.getready(name, topleft);
    }
}

KIEVII.graphicElements.Element.prototype.getready = function (name, topleft, specArgs) {

    if (specArgs.isClickable !== true) {
        this.isClickable = false;
    }

    this.name = name;

    // These are arrays of 2
    this.xOrigin = topleft[0];
    this.yOrigin = topleft[1];

    // This is the bounding box. Element has no dimension.
    this.width = 0;
    this.height = 0;

    // Element never draws itself.
    this.drawItself = false;

    // These are to be set later
    this.values = {};

    // Completion
    this.objectsTotal = 0;
    this.objectsLoaded = 0;
    this.completed = false;

    // See if there is a callback to call when the value is set
    if (specArgs !== undefined) {
        if (typeof (specArgs.onValueSet) === "function") {
            this.onValueSet = specArgs.onValueSet;
        }
    }
    // See if there is a callback on load completion
    if (specArgs !== undefined) {
        if (typeof (specArgs.onComplete) === "function") {
            this.onComplete = specArgs.onComplete;
        }
    }
};

// Private function
KIEVII.graphicElements.Element.prototype.isInROI = function (x, y) {
    // This is the abstract class.
    return false;
};

KIEVII.graphicElements.Element.prototype.getValues = function () {
    var tempArray = [],
        i;
    for (i in this.values) {
        if (this.values.hasOwnProperty(i)) {
            tempArray.push(i);
        }
    }
    // Returns the keys.
    return tempArray;
};

KIEVII.graphicElements.Element.prototype.getXCoord = function () {
    return this.xOrigin;
};

KIEVII.graphicElements.Element.prototype.getYCoord = function () {
    return this.yOrigin;
};

KIEVII.graphicElements.Element.prototype.getWidth = function () {
    return this.width;
};

KIEVII.graphicElements.Element.prototype.getHeight = function () {
    return this.height;
};

KIEVII.graphicElements.Element.prototype.getValue = function (slot) {
    if (this.values[slot] === undefined) {
        throw new Error("Slot " + slot + " not present or value undefined");
    }
    else {
        return this.values[slot];
    }
};

KIEVII.graphicElements.Element.prototype.getStatus = function () {
    return {"objectsTotal" : this.objectsTotal, "objectsLoaded" : this.objectsLoaded};
};

KIEVII.graphicElements.Element.prototype.isComplete = function () {
    return this.completed;
};

KIEVII.graphicElements.Element.prototype.onCompletion = function () {

    // Call the callback if there's one.
    if (typeof (this.onComplete) === "function") {
        this.onComplete (this.name);
    }

    return;
};

// Setters
KIEVII.graphicElements.Element.prototype.setValue = function (slot, value) {

    var temp_value = value;

    if (this.values[slot] === undefined) {
        throw new Error("Slot " + slot + " not present or value undefined");
    }

    if (temp_value === this.values[slot]) {
        // Nothing to do.
        return;
    }

    this.values[slot] = temp_value;

    // If the element needs to be refreshed, refresh it now.
    if (this.drawItself === true) {
        this.refresh();
    }

    // Finally, call the callback if there's one.
    if (typeof (this.onValueSet) === "function") {
        this.onValueSet (slot, this.values[slot], this.name);
    }

};

KIEVII.graphicElements.Element.prototype.setClickable = function (isClickable) {
    this.isClickable = isClickable;
};

KIEVII.graphicElements.Element.prototype.setDrawsItself = function (value) {
    this.drawItself = value;
};

// Refresh. This is the basic action.
KIEVII.graphicElements.Element.prototype.refresh = function () {
    this.drawFunc();
};

KIEVII.graphicElements.Element.prototype.getName = function () {
    return this.name;
};

KIEVII.graphicElements.Element.prototype.setDrawClass = function (drawClass) {
    this.drawClass = drawClass;
};

KIEVII.graphicElements.Element.prototype.onMouseMove = function (x,y) {
    return undefined;
};

KIEVII.graphicElements.Element.prototype.onMouseDown = function (x,y) {
    return undefined;
};

KIEVII.graphicElements.Element.prototype.onMouseUp = function (x,y) {
    return undefined;
};
