const _ = require("lodash");

module.exports = function(...args) {
    const _references = _(args)
        .castArray()
        .flatten()
        .value();

    if (
        !_.every(_references, x => {
            return typeof x === "string" && x.length;
        })
    ) {
        throw new TypeError(
            "constructor parameter array must contain only strings"
        );
    }

    if (!_references.length) {
        throw new TypeError("constructor parameter array cannot be empty");
    }

    const references = [].concat(_references);

    const context = function(values, _parent) {
        const rebuild = (index, value, parent) => {
            return context(
                references.map((p, i) => (i === index ? value : values[i])),
                parent
            );
        };

        const handler = (index, parent) => value => {
            if (value === undefined) {
                return values[index];
            }

            return rebuild(index, value, parent);
        };

        const _set = parent => (elem, name, value) => {
            const index = _.indexOf(references, elem);

            if (index === -1) {
                throw new Error(`context does not have a '${elem}' attribute`);
            }

            const getVal = (current, name, newValue) => {
                if (_.isNil(name)) {
                    return name === undefined ? newValue : name;
                } else if (_.isObject(current)) {
                    current[name] = newValue;
                    return current;
                } else {
                    return newValue === undefined ? name : newValue;
                }
            };

            return rebuild(index, getVal(values[index], name, value), parent);
        };

        const _get = current => elem => {
            const index = _.indexOf(references, elem);

            if (index === -1) {
                throw new Error(`context does not have a '${elem}' attribute`);
            }

            return current[elem]();
        };

        const instance = {};
        instance.set = _set(instance);
        instance.get = _get(instance);
        instance.parent = () => _parent;

        references.forEach((x, i) => (instance[x] = handler(i, instance)));

        return instance;
    };

    return context([]);
};
