module.exports = {
  __init__: [ 'bpmnRenderer', 'customRenderer' ],
  bpmnRenderer: [ 'type', require('./BpmnRenderer') ],
  customRenderer: [ 'type', require('./CustomRenderer') ],
  pathMap: [ 'type', require('./PathMap') ]
};
