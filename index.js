const fs = require('fs');
const { JsonifyExcel } = require('jsonify-excel');

const DATA = new JsonifyExcel('map.xlsx').toJson({ automap: true });

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
    f,
    d,
    s,
    a,
    e,
    tm,
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
    const map = createMap(key, app);

    setMode(map, 'f', f);
    setMode(map, 'd', d);
    setMode(map, 's', s);
    setMode(map, 'a', a);
    setMode(map, 'e', e);
    setMode(map, 'tm', tm);

    quitTm(map, !tm);

    setMap(map, key0, mod0);
    setMap(map, key1, mod1);
    setMap(map, key2, mod2);
    setMap(map, key3, mod3);
    setMap(map, key4, mod4);

    return map;
  }
);

fs.writeFileSync(
  'dist/map.json',
  JSON.stringify(
    {
      title: 'takanopontaro-map',
      rules: [
        {
          description: 'map for takanopontaro-mode',
          manipulators: json,
        },
      ],
    },
    (key, value) => {
      if (key === 'key_code' && Number.isFinite(value)) {
        return String(value);
      }
      return value;
    }
  )
);

function createMap(key, app) {
  const map = {
    type: 'basic',
    conditions: [
      {
        type: 'variable_if',
        name: 'mode',
        value: 1,
      },
    ],
    from: {
      key_code: DNS[key] || key,
      modifiers: {
        optional: ['any'],
      },
    },
    to: [],
  };
  if (app) {
    map.conditions.push({
      type: 'frontmost_application_if',
      bundle_identifiers: [app]
    });
  }
  return map;
}

function setMode(map, key, flag) {
  if (flag) {
    map.conditions.push({
      type: 'variable_if',
      name: `mode_${key}`,
      value: 1,
    });
  }
}

function quitTm(map, flag) {
  if (flag) {
    map.to.push({
      set_variable: {
        name: 'mode_tm',
        value: 0
      }
    });
  }
}

function setMap(map, key, mod) {
  if (!key) {
    return;
  }
  map.to.push({
    key_code: DNS[key] || key,
    modifiers: mod ? mod.split(',').map(m => DNS[m]) : [],
  });
}
