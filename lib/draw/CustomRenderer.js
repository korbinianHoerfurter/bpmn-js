'use strict';

var inherits = require('inherits');

var isArray = require('lodash/lang/isArray'),
    assign = require('lodash/object/assign');

var BaseRenderer = require('diagram-js/lib/draw/BaseRenderer');


function CustomRenderer(eventBus, styles) {

  BaseRenderer.call(this, eventBus, 2000);

  this._styles = styles;

  var self = this;

  this.handlers = {
    'custom:triangle': function(p, element) {
      return self.drawTriangle(p, element.width);
    }
  };

  this.drawTriangle = function(p, side, attrs) {
    var halfSide = side / 2,
        points;

    points = [ halfSide, 0, side, side, 0, side, halfSide, 0 ];

    attrs = self._computeStyle(attrs, {
      stroke: 'black',
      strokeWidth: 2,
      fill: 'white'
    });

    return p.polygon(points).attr(attrs);
  };

  this.getTrianglePath = function(element) {
    var side = element.width,
        halfSide = side / 2;

    var trianglPath = [
      ['M', halfSide, 0],
      ['l', side, side],
      ['l', 0, side],
      ['l', halfSide, 0],
      ['z']
    ];

    return self._componentsToPath(trianglPath);
  };
}

inherits(CustomRenderer, BaseRenderer);


CustomRenderer.prototype.canRender = function(element) {
  return /^custom\:/.test(element.type);
};

CustomRenderer.prototype.drawShape = function(visuals, element) {
  var type = element.type;
  var h = this.handlers[type];

  /* jshint -W040 */
  return h(visuals, element);
};

CustomRenderer.prototype.drawConnection = function(visuals, element) {
  var type = element.type;
  var h = this.handlers[type];

  /* jshint -W040 */
  return h(visuals, element);
};

CustomRenderer.prototype.getShapePath = function(element) {
  var type = /^custom\:/.replace(element.type, '');

  var shapes = {
    triangle: this.getTrianglePath
  };

  return shapes[type](element);
};

CustomRenderer.prototype._componentsToPath = function(elements) {
  return elements.join(',').replace(/,?([A-z]),?/g, '$1');
};

CustomRenderer.prototype._computeStyle = function(custom, traits, defaultStyles) {
  var styles = this._styles;

  if (!isArray(traits)) {
    defaultStyles = traits;
    traits = [];
  }

  return styles.style(traits || [], assign(defaultStyles, custom || {}));
};


CustomRenderer.$inject = [ 'eventBus', 'styles' ];

module.exports = CustomRenderer;
