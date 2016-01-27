function Const(text) {
  return { type: 'const', v: text };
}
function Var(name, pad) {
  return { type: 'var', name: name, pad: pad };
}

var RE = /%([-_0])?([a-zA-Z%])/g;

module.exports = function parse(format) {
  var nodes = [];

  var index = 0, s;
  format.replace(RE, function(_, varPad, varName, offset) {

    s = format.slice(index, offset);
    if(s.length) {
      nodes.push(Const(s));
    }


    if(varName === '%') {
      nodes.push(Const('%'));
    } else {
      nodes.push(Var(varName, varPad));
    }

    index = offset + _.length;
    return _;
  });

  s = format.substr(index);
  if(s.length) {
    nodes.push(Const(s));
  }

  return nodes;
};
