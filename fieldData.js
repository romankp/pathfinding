const returnX = (dimVal, workingVal) => {
  const xRemainder = workingVal % dimVal;
  return xRemainder === 0 ? dimVal : xRemainder;
};

const returnY = (dimVal, workingVal) => {
  return Math.ceil(workingVal / dimVal);
};

// Returns distance of cell from target with a bit of rounding
const returnDistance = (dimVal, x, y) => {
  const yDist = dimVal - y;
  const xDist = dimVal - x;
  if (dimVal === x) {
    return yDist;
  }
  if (dimVal === y) {
    return xDist;
  }
  return Number(Math.round(Math.hypot(yDist, xDist) + 'e3') + 'e-3');
};

const returnCoordObj = (i, dimVal, type) => {
  const x = returnX(dimVal, i);
  const y = returnY(dimVal, i);
  return {
    id: i,
    x: x,
    y: y,
    targetDistance: returnDistance(dimVal, x, y),
    type: type,
    checked: false,
    from: [],
  };
};

const randomizeObstacle = () => {
  return Math.random() > 0.3 ? 'empty' : 'obstacle';
};

const createFieldArray = (dimVal, obstacles) => {
  const arrayLength = dimVal ** 2;
  const finalArray = [];
  for (let i = 1; i <= arrayLength; i++) {
    if (i === 1) {
      finalArray.push(returnCoordObj(i, dimVal, 'start'));
    } else if (i === arrayLength) {
      finalArray.push(returnCoordObj(i, dimVal, 'target'));
    } else {
      finalArray.push(returnCoordObj(i, dimVal, randomizeObstacle()));
    }

    // else if (obstacles.some(pos => pos === i)) {
    //   finalArray.push(returnCoordObj(i, dimVal, 'obstacle'));
    // } else {
    //   finalArray.push(returnCoordObj(i, dimVal, 'empty'));
    // }
  }
  return finalArray;
};

export { createFieldArray };