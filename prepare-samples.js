function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const data = require('./data-23-02-2202.json')
const shuffled = shuffle(data)
const fs = require('fs')

fs.writeFile('./complete-data/train_boxes.json', JSON.stringify(data.slice(0, 250), null, 2))
fs.writeFile('./complete-data/test_boxes.json', JSON.stringify(data.slice(250, 500), null, 2))
fs.writeFile('./complete-data/eval_boxes.json', JSON.stringify(data.slice(500), null, 2))
