import assert from 'node:assert/strict';
import {
  returnX,
  returnY,
  returnDistance,
  returnCoordObj,
  randomizeObstacle,
} from '../modules/fieldData.mjs';

describe('fieldData', function () {
  describe('returnX', function () {
    it('returns dimVal value when both arguments are equal', function () {
      assert.equal(returnX(5, 5), 5);
    });
    it('returns remainder when arguments are different', function () {
      assert.equal(returnX(2, 5), 1);
    });
  });

  describe('returnY', function () {
    it('rounds the result of workingVal devided by dimVal up', function () {
      assert.equal(returnY(3, 5), 2);
    });
  });

  describe('returnDistance', function () {
    it('returns flat y distance when target coord is on the same x value', function () {
      assert.equal(returnDistance(5, 5, 1, 15), 2);
    });
    it('returns flat x distance when target coord is on the same y value', function () {
      assert.equal(returnDistance(5, 1, 1, 5), 4);
    });
    it('returns hypotenuse rounded to the third decimal when coordinate is not on same lateral planes as target', function () {
      assert.equal(returnDistance(5, 1, 1, 15), 4.472);
    });
  });

  describe('returnCoordObj', function () {
    const expected = {
      id: 1,
      x: 1,
      y: 1,
      targetDistance: 4,
      type: 'empty',
      checked: false,
      from: [],
    };
    it('returns expected object when coord is empty type', function () {
      assert.deepEqual(returnCoordObj(1, 5, 'empty', 5), expected);
    });
    it('returns expected object when coord is start type', function () {
      expected.type = 'start';
      expected.targetDistance = 5;
      assert.deepEqual(returnCoordObj(1, 5, 'start', 5), expected);
    });
  });

  describe('randomizeObstacle', function () {
    it('returns obstacle if random fraction is less than chanceVal', function () {
      assert.equal(randomizeObstacle(1.1), 'obstacle');
    });
    it('returns empty if random fraction is less than chanceVal', function () {
      assert.equal(randomizeObstacle(0), 'empty');
    });
  });
});
