function Const(text) {
  return { type: "const", v: text };
}
function Var(name, pad, trunc, args) {
  return { type: "var", name: name, pad: pad, trunc: trunc, args: args };
}
function Dec(name, nodes) {
  return { type: "decorator", name: name, nodes: nodes || [] };
}

var RE = /%(?:([\.a-z]+)\(([^\)]*)\))|%(?:(-?\d+)?(?:.(-?\d+))?([a-z]+|%)(?:\{([^\}]*)\})?)/g;

module.exports = function parse(format) {
  var nodes = [];

  var index = 0,
    s;
  format.replace(RE, function(
    _,
    decName,
    decArgs,
    varPad,
    varTrunc,
    varName,
    varArgs,
    offset
  ) {
    s = format.slice(index, offset);
    if (s.length) {
      nodes.push(Const(s));
    }

    if (decName) {
      nodes.push(Dec(decName, parse(decArgs)));
    } else if (varName) {
      if (varName === "%") {
        nodes.push(Const("%"));
      } else {
        nodes.push(
          Var(
            varName,
            varPad && parseInt(varPad, 10),
            varTrunc && parseInt(varTrunc, 10),
            typeof varArgs == "string" ? varArgs.split("|") : []
          )
        );
      }
    }

    index = offset + _.length;
    return _;
  });

  s = format.substr(index);
  if (s.length) {
    nodes.push(Const(s));
  }

  return nodes;
};
