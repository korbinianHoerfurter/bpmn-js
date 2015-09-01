module.exports = {
  __depends__: [
    require('diagram-js/lib/features/rules')
  ],
  __init__: [ 'bpmnRules', 'customRules' ],
  bpmnRules: [ 'type', require('./BpmnRules') ],
  customRules: [ 'type', require('./CustomRules') ]
};
