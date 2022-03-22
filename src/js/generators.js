/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  let randomTypes = Math.floor(Math.random() * allowedTypes.length); //индекс 
  let levelTypes = Math.floor(Math.random() * maxLevel) + 1;
  let t = allowedTypes[randomTypes];
  let ch = new t(levelTypes);
  yield ch;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let team = [];
  for (let i = 0; i < characterCount; i += 1) {
    let character = characterGenerator(allowedTypes, maxLevel).next().value;
    team.push(character);
  }
  return team;
}
