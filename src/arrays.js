import _ from 'lodash';

export function toArray(_arguments) {
  if (_.isArray(_arguments[0])) return _arguments[0];

  return Array.prototype.slice.call(_arguments);
}
