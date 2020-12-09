function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomName() {
  const arr = ['Some', 'Random', 'Words', 'To', 'Create', 'Randomised', 'User', 'Name'];
  const maxInt = arr.length - 1;
  const randomName = `${ arr[getRandomInt(0, maxInt)] }_${ arr[getRandomInt(0, maxInt)] }_${ arr[getRandomInt(0, maxInt)] }_${ getRandomInt(0, 1000) }`;
  return randomName;
}

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

export { getRandomName, getRandomColor };
