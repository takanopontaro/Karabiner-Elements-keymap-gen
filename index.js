const fs = require('fs');
const Je = require('jsonify-excel');
const DATA = new Je('map.xlsx').toJSON({ automap: true });

const DNS = {
  fn: 'fn',
  cmd: 'left_command',
  ctrl: 'left_control',
  opt: 'left_option',
  shift: 'left_shift',
  up: 'up_arrow',
  down: 'down_arrow',
  left: 'left_arrow',
  right: 'right_arrow',
  pageup: 'page_up',
  pagedown: 'page_down',
  esc: 'escape',
  space: 'spacebar',
  del: 'delete_or_backspace',
  fdel: 'delete_forward',
  tab: 'tab',
  return: 'return_or_enter',
  ',': 'comma',
  '.': 'period',
  '[': 'open_bracket',
  ']': 'close_bracket',
};

const json = DATA.map(({ reset, any, key, mod, key0, mod0, key1, mod1, key2, mod2, key3, mod3, key4, mod4, key5, mod5 }) => {
  const map = {
    type: 'basic',
    from: {
      key_code: DNS[key] || key,
      modifiers: {
        mandatory: mod ? mod.split(',').map(m => DNS[m]) : [],
        optional: any ? ['any'] : []
      }
    },
    to: []
  };
  if (key0) {
    map.to_if_alone = [{
      key_code: DNS[key0] || key0,
      modifiers: mod0 ? mod0.split(',').map(m => DNS[m]) : []
    }]
  }
  if (reset) {
    map.to.push({
      key_code: 'a',
      modifiers: [DNS['fn'], DNS['shift']]
    });
  }
  if (key1) {
    map.to.push({
      key_code: DNS[key1] || key1,
      modifiers: mod1 ? mod1.split(',').map(m => DNS[m]) : []
    });
  }
  if (key2) {
    map.to.push({
      key_code: DNS[key2] || key2,
      modifiers: mod2 ? mod2.split(',').map(m => DNS[m]) : []
    });
  }
  if (key3) {
    map.to.push({
      key_code: DNS[key3] || key3,
      modifiers: mod3 ? mod3.split(',').map(m => DNS[m]) : []
    });
  }
  if (key4) {
    map.to.push({
      key_code: DNS[key4] || key4,
      modifiers: mod4 ? mod4.split(',').map(m => DNS[m]) : []
    });
  }
  if (key5) {
    map.to.push({
      key_code: DNS[key5] || key5,
      modifiers: mod5 ? mod5.split(',').map(m => DNS[m]) : []
    });
  }
  return map;
});

fs.writeFileSync('takanopontaro.json', JSON.stringify({
  title: 'takanopontaro',
  rules: [{
    description: 'my rule',
    manipulators: json
  }]
}));
