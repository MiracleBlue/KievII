KIEVII.namespace('graphicElements.Slider');

KIEVII.graphicElements.Slider = function (name, topleft, specArgs) {
    if (arguments.length) {
        this.getready(name, topleft, specArgs);
    }
}

//inherit from the Element prototype
KIEVII.graphicElements.Slider.prototype = new KIEVII.graphicElements.Element();
//put the correct constructor reference back (not essential)
KIEVII.graphicElements.Slider.prototype.constructor = KIEVII.graphicElements.Slider;

KIEVII.graphicElements.Slider.prototype.getready = function (name, topleft, specArgs /*sliderImg, knobImg*/) {

    if (specArgs === undefined) {
        throw new Error("Error: specArgs is undefined!");
    }

    //reference the getready method from the parent class
    this.tempReady = KIEVII.graphicElements.Element.prototype.getready;
    //and run it as if it were part of this object
    this.tempReady(name, topleft, specArgs);
    //now that all required properties have been inherited
    //from the parent class, define extra ones from this class
    this.values = {"slidervalue" : 0};
    this.objectsLoaded = 0;

    //By default, a Slider always draws itself when value is set.
    this.drawItself = true;

    this.width = 0;
    this.height = 0;

    // Set the status progress.
    this.objectsTotal = 2;

    this.sliderImage = new Image();
    this.sliderImage.onload = this.onLoad(this);
    this.sliderImage.src = specArgs.sliderImg;

    this.knobImage = new Image();
    this.knobImage.onload = this.onLoad(this);
    this.knobImage.src = specArgs.knobImg;

    this.type = specArgs.type;

    this.completed = false;

    // As soon as we can, we want to save our background.
    this.backgroundSavePending = true;

};

KIEVII.graphicElements.Slider.prototype.onLoad = function (that) {
    return function () {
        that.objectsLoaded += 1;
        if (that.objectsLoaded === that.objectsTotal) {
            that.completed = true;
            that.onCompletion();
        }
    };
};

// This method returns an x position given the Slider value.
/*jslint nomen: false*/
KIEVII.graphicElements.Slider.prototype._getKnobPosition = function () {
/*jslint nomen: true*/
    var ret;

    if ((this.values.slidervalue < 0) || (this.values.slidervalue > 1)) {
        // Do nothing
        return undefined;
    }
    // We must take in account the half-knob thing, here.
    switch(this.type) {

      case "horizontal":
          ret = Math.round(this.values.slidervalue * this.width + this.zeroLimit);
      break;

      case "vertical":
          ret = Math.round(this.values.slidervalue * this.height + this.zeroLimit);
      break;

      default:
          throw new Error("Error: Slider orientation is undefined!");
      }

    return ret;
};

// This method returns true if the point given belongs to this Slider.
KIEVII.graphicElements.Slider.prototype.isInROI = function (x, y) {
    switch(this.type) {
        case "horizontal":
            if ((x > this._getKnobPosition()) && (y > this.yOrigin)) {
                if ((x < (this._getKnobPosition() + this.kWidth)) && (y < (this.yOrigin + this.kHeight))) {
                    return true;
                }
            }
        break;

        case "vertical":
            if ((y > this._getKnobPosition()) && (x > this.xOrigin)) {
                if ((y < (this._getKnobPosition() + this.kHeight)) && (x < (this.xOrigin + this.kWidth))) {
                    return true;
                }
            }
        break;

        default:
          throw new Error("Error: Slider orientation is undefined!");
      }

    // Slider is in ROI if and only if we drag the knob.
    return false;
};

KIEVII.graphicElements.Slider.prototype.onMouseDown = function (x, y) {
    if (this.isInROI(x, y)) {
        this.triggered = true;
        // This remembers the difference between the current knob start and
        // the point where we started dragging.
        switch(this.type) {

            case "horizontal":
                this.drag_offset = x - this._getKnobPosition();
            break;

            case "vertical":
                this.drag_offset = y - this._getKnobPosition();
            break;

            default:
              throw new Error("Error: Slider orientation is undefined!");
          }
    }
    return undefined;
};

KIEVII.graphicElements.Slider.prototype.onMouseUp = function (x, y) {
    this.triggered = false;
    this.drag_offset = undefined;
    return undefined;
};

KIEVII.graphicElements.Slider.prototype.onMouseMove = function (curr_x, curr_y) {

        if (this.triggered === true) {
            var to_set,
                ret;

            // We must compensate for the point where we started to drag if
            // we want a seamless drag animation.
            switch(this.type) {
                case "horizontal":
                    to_set = (curr_x - this.zeroLimit - this.drag_offset) / (this.width);
                break;

                case "vertical":
                    to_set = (curr_y - this.zeroLimit - this.drag_offset) / (this.height);
                break;

                default:
                  throw new Error("Error: Slider orientation is undefined!");
              }

            if (to_set > 1) {
                to_set = 1;
            }
            if (to_set < 0) {
                to_set = 0;
            }

            ret = {"slot" : "slidervalue", "value" : to_set};

            return ret;
        }
        
        return undefined;
    };

// Setters
KIEVII.graphicElements.Slider.prototype.setValue = function (slot, value) {

    if (this.values[slot] === value) {
        // Don't update and refresh, just return!
        return;
    }

    if ((value < 0) || (value > 1)) {
        // Can happen if the user drags too much.
        return;
    }

    // Now, we call the superclass
    this.tempsetValue = KIEVII.graphicElements.Element.prototype.setValue;
    this.tempsetValue(slot, value);

};

KIEVII.graphicElements.Slider.prototype.refresh = function () {
    if (this.drawClass === undefined) {
        throw new Error("Error: drawClass is undefined!");
    }
    else {

        if (this.backgroundSavePending === true) {
            switch(this.type) {
                case "horizontal":
                    this.drawClass.saveBackground (this.xOrigin - this.additionalEndSpace, this.yOrigin, this.totalStride, this.height);
                break;

                case "vertical":
                    this.drawClass.saveBackground (this.xOrigin, this.yOrigin - this.additionalEndSpace, this.width, this.totalStride);
                break;

                default:
                  throw new Error("Error: Slider orientation is undefined!");
              }
            
            this.backgroundSavePending = false;
        }

        else {
            // We want drawClass to refresh the saved background.
            this.drawClass.restoreBackground();
        }

        this.drawClass.draw(this.sliderImage, this.xOrigin, this.yOrigin);
        /*jslint nomen: false*/

        switch(this.type) {
            case "horizontal":
                this.drawClass.draw(this.knobImage, this._getKnobPosition(), this.yOrigin);
            break;

            case "vertical":
                this.drawClass.draw(this.knobImage, this.xOrigin, this._getKnobPosition());
            break;

            default:
              throw new Error("Error: Slider orientation is undefined!");
          }
        
        /*jslint nomen: true*/
    }
};

KIEVII.graphicElements.Slider.prototype.onCompletion = function () {
    // Images were loaded, we can take their width and height.
    this.width = this.sliderImage.width;
    this.height = this.sliderImage.height;
    // The length of the slider knob.
    this.kWidth = this.knobImage.width;
    this.kHeight = this.knobImage.height;
    // The knob can stick out by an half of its length at the two extremes of the
    // slider. Let's store some useful variables.

    switch(this.type) {
        case "horizontal":
            this.totalStride = this.width + this.kWidth;
            this.additionalEndSpace = Math.round (this.kWidth / 2);
            this.zeroLimit = this.xOrigin - this.additionalEndSpace;
            this.oneLimit =  this.xOrigin + this.width + this.additionalEndSpace;
        break;

        case "vertical":
            this.totalStride = this.height + this.kHeight;
            this.additionalEndSpace = Math.round (this.kHeight / 2);
            this.zeroLimit = this.yOrigin - this.additionalEndSpace;
            this.oneLimit =  this.yOrigin + this.height + this.additionalEndSpace;
        break;

        default:
          throw new Error("Error: Slider orientation is undefined!");
      }
    
    // Now, we call the superclass
    this.tempCompletion = KIEVII.graphicElements.Element.prototype.onCompletion;
    this.tempCompletion();
};
