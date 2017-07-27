const fs = require('fs');
const _ = require('lodash');
const { JsonifyExcel } = require('jsonify-excel');

const DATA = new JsonifyExcel('map_mode.xlsx').toJson({ automap: true });

const DNS = {
  caps: 'caps_lock',
  cmd: 'left_command',
  lcmd: 'left_command',
  rcmd: 'right_command',
  ctrl: 'left_control',
  lctrl: 'left_control',
  rctrl: 'right_control',
  opt: 'left_option',
  lopt: 'left_option',
  ropt: 'right_option',
  shift: 'left_shift',
  lshift: 'left_shift',
  rshift: 'right_shift',
  up: 'up_arrow',
  down: 'down_arrow',
  left: 'left_arrow',
  right: 'right_arrow',
  pup: 'page_up',
  pdown: 'page_down',
  esc: 'escape',
  spc: 'spacebar',
  del: 'delete_or_backspace',
  fdel: 'delete_forward',
  ret: 'return_or_enter',
  ',': 'comma',
  '.': 'period',
  '[': 'open_bracket',
  ']': 'close_bracket',
};

const json = DATA.map(
  ({
    desc,
    app,
    any,
    f,
    d,
    s,
    a,
    e,
    key,
    key0,
    mod0,
    key1,
    mod1,
    key2,
    mod2,
    key3,
    mod3,
    key4,
    mod4,
  }) => {
    const map = initMap();

    mapCondition(map, 'f', f);
    mapCondition(map, 'd', d);
    mapCondition(map, 's', s);
    mapCondition(map, 'a', a);
    mapCondition(map, 'e', e);

    mapKey(map, key0, mod0);
    mapKey(map, key1, mod1);
    mapKey(map, key2, mod2);
    mapKey(map, key3, mod3);
    mapKey(map, key4, mod4);

    return map;
  }
);

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

fs.writeFileSync(
  'dist/takanopontaro.json',
  JSON.stringify({
    title: 'takanopontaro',
    rules: [
      {
        description: 'my rule',
        manipulators: json,
      },
    ],
  })
);

function initMap() {
  return {
    type: 'basic',
    conditions: [],
    from: {
      key_code: DNS[key] || key,
      modifiers: {
        optional: ['caps_lock'],
      },
    },
    to: [],
  };
}

function mapCondition(map, key, flag) {
  if (flag) {
    map.conditions.push({
      type: 'variable_if',
      name: `${key}-mode`,
      value: 1,
    });
  }
}

function mapKey(map, key, mod) {
  if (key) {
    map.to.push({
      key_code: DNS[key] || key,
      modifiers: mod ? mod.split(',').map(m => DNS[m]) : [],
    });
  }
}
