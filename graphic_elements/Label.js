KIEVII.namespace('graphicElements.Label');

KIEVII.graphicElements.Label = function(name, topleft, specArgs) {
    if (arguments.length) {
        this.getready(name, topleft, specArgs);
    }
}

//inherit from the Element prototype
KIEVII.graphicElements.Label.prototype = new KIEVII.graphicElements.Element();
//put the correct constructor reference back (not essential)
KIEVII.graphicElements.Label.prototype.constructor = KIEVII.graphicElements.Label;

KIEVII.graphicElements.Label.prototype.getready = function (name, topleft, specArgs) {
    //Reference the getready method from the parent class
    this.tempReady = KIEVII.graphicElements.Element.prototype.getready;
    //and run it as if it were part of this object
    this.tempReady(name, topleft, specArgs);

    this.values = {"labelvalue" : 0};

    //By default, a label always draws itself when value is set.
    this.drawItself = true;
    
    this.width = specArgs.wh[0];
    this.height = specArgs.wh[1];

    this.completed = true;

};

// This methods returns true if the point given belongs to this element.
KIEVII.graphicElements.Label.prototype.isInROI = function (x, y) {
    if ((x > this.xOrigin) && (y > this.yOrigin)) {
        if ((x < (this.xOrigin + this.width)) && (y < (this.yOrigin + this.height))) {
            //console.log(this.name, "point ", x, y, " is in ROI ", this.xOrigin, this.yOrigin, this.xOrigin + this.width, this.yOrigin + this.height);
            return true;
        }
        //console.log(this.name, " ROI Handler: ", x, y, " is NOT in ROI ", this.xOrigin, this.yOrigin, this.xOrigin + this.width, this.yOrigin + this.height);
    }
    return false;
};

// Text filter automatically parses and translates the value.
// This one does nothing but round value. TODO this should be overridden
// and definitely NOT here.
KIEVII.graphicElements.Label.prototype.textFilter = function (value) {
    return value.toFixed(3);
};

// Setters
KIEVII.graphicElements.Label.prototype.setValue = function (slot, value) {

    if (this.textFilter !== undefined) {
        var temp_value = this.textFilter(value);
    }

    this.tempsetValue = KIEVII.graphicElements.Element.prototype.setValue;
    this.tempsetValue(slot, temp_value);
};
 
KIEVII.graphicElements.Label.prototype.refresh = function () {
    var text;
    if (this.drawClass === undefined) {
        throw new Error("Error: drawClass is undefined!");
    }
    else {
        // Maybe the filtering should be done here?
        text = this.values.labelvalue;
        // Draw yourself! This is per-class behaviour.
        //console.log (this.name, "'s drawClass is drawing itself!");
        this.drawClass.draw(text, this.xOrigin, this.yOrigin, this.width, this.height);
    }
};
