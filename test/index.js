var chai = require('chai')
var assert = require('assert')
var sinon = require('sinon')
var Logdown = require('../src/index')

function createInstances() {
  return [
    new Logdown({prefix: 'foo'}),
    new Logdown({prefix: 'bar'}),
    new Logdown({prefix: 'quz'}),
    new Logdown({prefix: 'baz'})
  ]
}

describe('Logdown.enable', function() {
  var sandbox

  beforeEach(function() {
    sandbox = sinon.sandbox.create()

    sandbox.stub(global.console, 'log')
  })

  afterEach(function(){
    sandbox.restore()
  })

  it('`Logdown.enable(*)` should enable all instances', function() {
    Logdown.disable('*')
    Logdown.enable('*')
    var instances = createInstances()
    instances.forEach(function(instance) {
      instance.log('Lorem')
    })

    sinon.assert.called(console.log)
  })

  it('Logdown.enable(\'foo\') should enable only instances with “foo” prefix', function() {
    var foo = new Logdown({prefix: 'foo'})
    var bar = new Logdown({prefix: 'bar'})
    var quz = new Logdown({prefix: 'quz'})
    var baz = new Logdown({prefix: 'baz'})

    Logdown.disable('*')
    Logdown.enable('foo')


    bar.log('lorem')
    sinon.assert.notCalled(console.log)
    quz.log('lorem')
    sinon.assert.notCalled(console.log)
    baz.log('lorem')
    sinon.assert.notCalled(console.log)
    foo.log('lorem')
    sinon.assert.called(console.log)
  })

  it('Logdown.enable(\'*foo\') should enable only instances with names ending with “foo”', function() {
    var foo = new Logdown({prefix: 'foo'})
    var bar = new Logdown({prefix: 'bar'})
    var foobar = new Logdown({prefix: 'foobar'})
    var barfoo = new Logdown({prefix: 'barfoo'})

    Logdown.disable('*')
    Logdown.enable('*foo')

    bar.log('lorem')
    foobar.log('lorem')
    sinon.assert.notCalled(console.log)
    foo.log('lorem')
    barfoo.log('lorem')
    sinon.assert.calledTwice(console.log)
  })

  it('Logdown.enable(\'foo*\') should enable only instances with names beginning with “foo”', function() {
    var foo = new Logdown({prefix: 'foo'})
    var bar = new Logdown({prefix: 'bar'})
    var foobar = new Logdown({prefix: 'foobar'})
    var barfoo = new Logdown({prefix: 'barfoo'})

    Logdown.disable('*')
    Logdown.enable('foo*')

    bar.log('lorem')
    barfoo.log('lorem')
    sinon.assert.notCalled(console.log)
    foobar.log('lorem')
    foo.log('lorem')
    sinon.assert.calledTwice(console.log)
  })
})