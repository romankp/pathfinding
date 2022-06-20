import assert from 'node:assert/strict';
import { returnX, returnY } from '../modules/fieldData.mjs';

describe('fieldData', function () {
  describe('returnX', function () {
    it('should return dimVal value when both arguments return 0 mod', function () {
      assert.equal(returnX(5, 5), 5);
    });
    it('should return remained when arguments are different', function () {
      assert.equal(returnX(2, 5), 1);
    });
  });

  describe('returnY', function () {
    it('should round up workingVal devided by dimVal', function () {
      assert.equal(returnY(3, 5), 2);
    });
  });
});
