'use strict';

var TestHelper = require('../../../TestHelper');

var map = require('lodash/collection/map');

function move(elementIds, delta, targetId, isAttach) {

  if (typeof elementIds === 'string') {
    elementIds = [ elementIds ];
  }

  if (typeof delta !== 'object') {
    isAttach = targetId;
    targetId = delta;
    delta = { x: 0, y: 0 };
  }

  if (typeof targetId !== 'string') {
    isAttach = targetId;
    targetId = null;
  }

  return TestHelper.getBpmnJS().invoke(function(elementRegistry, modeling) {

    function getElement(id) {

      var element = elementRegistry.get(id);
      expect(element).to.exist;

      return element;
    }

    var elements = map(elementIds, getElement),
        target = targetId && getElement(targetId);

    return modeling.moveElements(elements, delta, target, isAttach);
  });
}


module.exports.move = move;


function getAncestors(element) {
  var ancestors = [];

  while (element) {
    ancestors.push(element);

    element = element.parent;
  }

  return ancestors;
}


function compareZOrder(aId, bId) {

  var elementA,
      elementB;

  TestHelper.getBpmnJS().invoke(function(elementRegistry) {

    function getElement(id) {

      var element = elementRegistry.get(id);
      expect(element).to.exist;

      return element;
    }

    elementA = getElement(aId);
    elementB = getElement(bId);
  });


  var aAncestors = getAncestors(elementA),
      bAncestors = getAncestors(elementB);

  var sharedRoot = aAncestors.reduce(function(result, aAncestor, aParentIndex) {

    if (result) {
      return result;
    }

    var bParentIndex = bAncestors.indexOf(aAncestor);

    if (bParentIndex !== -1) {
      return {
        a: aAncestors[aParentIndex - 1],
        b: bAncestors[bParentIndex - 1],
        parent: aAncestor
      };
    }
  });

  // b contained in a
  if (!sharedRoot.a) {
    return -1;
  }

  // a contained in b
  if (!sharedRoot.b) {
    return 1;
  }

  var aIndex = sharedRoot.parent.indexOf(sharedRoot.a),
      bIndex = sharedRoot.parent.indexOf(sharedRoot.b);

  return Math.sign(aIndex - bIndex);
}


var forEach = require('lodash/collection/forEach');

function expectZOrder() {

  var elements = Array.prototype.slice.call(arguments);

  var next;

  forEach(elements, function(e, idx) {

    next = elements[idx];

    if (next) {
      expect(compareZOrder(e, next)).to.eql(-1);
    }
  });

  return true;
}

module.exports.expectZOrder = expectZOrder;