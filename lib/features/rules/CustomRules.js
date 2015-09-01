'use strict';

var forEach = require('lodash/collection/forEach'),
    inherits = require('inherits');

var is = require('../../util/ModelUtil').is;

var RuleProvider = require('diagram-js/lib/features/rules/RuleProvider');

var HIGH_PRIORITY = 1500;


/**
 * BPMN specific modeling rule
 */
function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = [ 'eventBus' ];

module.exports = CustomRules;

CustomRules.prototype.init = function() {
  function isBpmnElement(context) {
    var result;

    if (context.shape && !is(context.shape, 'bpmn:BaseElement')) {
      return true;
    }

    if (context.connection && !is(context.connection, 'bpmn:BaseElement')) {
      return true;
    }

    if (context.shapes) {
      forEach(context.shapes, function(shape) {
        if (!is(shape, 'bpmn:BaseElement')) {
          result = true;
          return false;
        }
      });
      return result;
    }

    if (context.source && !is(context.source, 'bpmn:BaseElement')) {
      return true;
    }

    if (context.source && !is(context.source, 'bpmn:BaseElement')) {
      return true;
    }
  }

  this.addRule([
    'connection.create',
    'connection.reconnectStart',
    'connection.reconnectEnd',
    'connection.updateWaypoints'
  ], HIGH_PRIORITY, isBpmnElement);

  this.addRule([
    'shape.resize',
    'elements.move',
    'shape.create',
    'shape.append'
  ], HIGH_PRIORITY, isBpmnElement);
};
