'use strict';
console.log('Your utils are ready for action!!!');

//DOM
function toggleElementVisibility(selector) {
    var el = document.querySelector(selector);

    if (el) {
        el.style.display = (el.style.display === 'none')? 'initial' : 'none';
    } else {
        console.error('toggleElementVisibility: Cound not find: ' + selector);
    }
   
}

//Mathematical
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}