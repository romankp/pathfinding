const obstacleChance = 35 / 100;

const returnX = (dimVal, workingVal) => {
  const xRemainder = workingVal % dimVal;
  return xRemainder === 0 ? dimVal : xRemainder;
};

const returnY = (dimVal, workingVal) => {
  return Math.ceil(workingVal / dimVal);
};

// Returns distance of cell from target with a bit of rounding
const returnDistance = (dimVal, x, y, targetId) => {
  // We use Math.abs here to make sure the number is returned positive
  const xDist = Math.abs(returnX(dimVal, targetId) - x);
  const yDist = Math.abs(returnY(dimVal, targetId) - y);

  if (xDist === 0) {
    return yDist;
  }
  if (yDist === 0) {
    return xDist;
  }
  return Number(Math.round(Math.hypot(yDist, xDist) + 'e3') + 'e-3');
};

const returnCoordObj = (i, dimVal, type, endPos) => {
  const x = returnX(dimVal, i);
  const y = returnY(dimVal, i);
  const distance = returnDistance(dimVal, x, y, endPos);

  return {
    id: i,
    x: x,
    y: y,
    // We enlarge the distance value for the start coord to make it a less favorable as a move option
    targetDistance: type === 'start' ? distance + 1 : distance,
    type: type,
    checked: false,
    from: [],
  };
};

const randomizeObstacle = chanceVal => {
  return Math.random() > chanceVal ? 'empty' : 'obstacle';
};

const returnRandomID = latDim => {
  return Math.floor(Math.random() * latDim ** 2 + 1);
};

const returnNoncollidingID = (latDim, avoidID) => {
  let randomID = returnRandomID(latDim);
  while (randomID === avoidID) {
    randomID = returnRandomID(latDim);
  }
  return randomID;
};

const createFieldArray = (dimVal, startPos, endPos, override) => {
  let finalArray = [];

  if (override.length) {
    finalArray = override;
    console.warn('USING OVERRIDE');
  } else {
    for (let i = 1; i <= dimVal ** 2; i++) {
      if (i === startPos) {
        finalArray.push(returnCoordObj(i, dimVal, 'start', endPos));
      } else if (i === endPos) {
        finalArray.push(returnCoordObj(i, dimVal, 'target', endPos));
      } else {
        finalArray.push(
          returnCoordObj(i, dimVal, randomizeObstacle(obstacleChance), endPos)
        );
      }
    }
  }

  console.log(`field array -> ${JSON.stringify(finalArray, null, 2)}`);
  return finalArray;
};

export {
  returnX,
  returnY,
  returnDistance,
  returnCoordObj,
  randomizeObstacle,
  createFieldArray,
  returnRandomID,
  returnNoncollidingID,
};
