const expect = require('chai').expect;
const _context = require('../index');

describe('Test that context', function() {
    it('succeeds with one attribute created', function() {
        const context = _context(['one']);
        // initially undefined
        expect(context.one()).to.be.undefined;
        // generates a new context instance when setting a value
        const subcontext = context.one('value');
        // does not alter the initial instance
        expect(context.one()).to.be.undefined;
        // returns the expected value from the new instance
        expect(subcontext.one()).to.equal('value');
    });

    it('succeeds with two attributes created', function() {
        const context = _context(['one', 'two']);
        const contextOne = context.one('one');
        const contextTwo = context.two('two');
        const contextOneTwo = contextOne.two('two');
        const contextTwoOne = contextTwo.one('one');

        expect(context.one()).to.be.undefined;
        expect(context.two()).to.be.undefined;
        expect(context.parent()).to.be.undefined;

        expect(contextOne.one()).to.equal('one');
        expect(contextOne.two()).to.be.undefined;
        expect(contextOne.parent()).to.equal(context);

        expect(contextTwo.one()).to.be.undefined;
        expect(contextTwo.two()).to.equal('two');
        expect(contextTwo.parent()).to.equal(context);

        expect(contextOneTwo.one()).to.equal('one');
        expect(contextOneTwo.two()).to.equal('two');
        expect(contextOneTwo.parent()).to.equal(contextOne);

        expect(contextTwoOne.one()).to.equal('one');
        expect(contextTwoOne.two()).to.equal('two');
        expect(contextTwoOne.parent()).to.equal(contextTwo);
    });

    it('succeeds when using set', function() {
        var context = _context(['one']);
        expect(context.one()).to.be.undefined;

        var parent = context;
        context = context.one('one');
        expect(context.one()).to.equal('one');
        expect(context.parent()).to.equal(parent);

        parent = context;
        context = context.set('one');
        expect(context.one()).to.be.undefined;
        expect(context.parent()).to.equal(parent);

        parent = context;
        context = context.one('one');
        expect(context.one()).to.equal('one');
        expect(context.parent()).to.equal(parent);

        parent = context;
        context = context.set('one', 'two');
        expect(context.one()).to.equal('two');
        expect(context.parent()).to.equal(parent);

        parent = context;
        context = context.set('one', undefined, 'three');
        expect(context.one()).to.equal('three');
        expect(context.parent()).to.equal(parent);

        parent = context;
        context = context.one({
            val: 'one'
        });
        expect(context.one()).to.deep.equal({
            val: 'one'
        });
        expect(context.parent()).to.equal(parent);

        parent = context;
        context = context.set('one', 'val', 'two');
        expect(context.one()).to.deep.equal({
            val: 'two'
        });
        expect(context.parent()).to.equal(parent);

        parent = context;
        context = context.set('one', 'val');
        const last = context.one();

        expect(last).to.deep.equal({
            val: undefined
        });
        expect(context.parent()).to.equal(parent);
    });

    it('throws with invalid construction', function() {
        expect(() => _context()).to.throw(TypeError);
        expect(() => _context([])).to.throw(TypeError);
        expect(() => _context([42])).to.throw(TypeError);
        expect(() => _context([''])).to.throw(TypeError);
    });

    it('throws with invalid set access', function() {
        expect(() => _context(['one']).set('two')).to.throw(Error);

    });
});