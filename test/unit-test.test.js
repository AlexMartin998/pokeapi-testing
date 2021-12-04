'use strict';

const assert = require('chai').assert;

const addValuse = (a, b) => a + b;

describe('Suite de prueba', () => {
  it('should returns 2', () => {
    let va = addValuse(1, 1);
    assert.equal(va, 2);
  });
});
