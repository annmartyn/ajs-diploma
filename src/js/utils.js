export function calcTileType(index, boardSize) {
  // TODO: write logic here надо чтобы был список как поле, 0 - угол, 64 - тоже угол
  let positions = ['top-left'];
  for (let i = 0; i < boardSize - 2; i++) {
    positions.push('top');
  };
  positions.push('top-right');
  for (let i = 0; i < boardSize - 2; i++) {
    positions.push('left');
    for (let i = 0; i < boardSize - 2; i++) {
      positions.push('center');
    };
    positions.push('right');
  };

  positions.push('bottom-left');
  for (let i = 0; i < boardSize - 2; i++) {
    positions.push('bottom');
  };
  positions.push('bottom-right');
  return positions[index];
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
