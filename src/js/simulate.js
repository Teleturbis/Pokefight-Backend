import { adjectives, names } from '../model/random-user-data';

const behavior = {
  ticRate: 0.1,
  maxActionsPerTic: 3,
  maxMobs: 50,
  actionsWeight: [
    { value: 'join', weight: 2 },
    { value: 'leave', weight: 2 },
    { value: 'move', weight: 2 },
    { value: 'skin', weight: 1 },
    { value: 'name', weight: 1 },
  ],
};

const mobs = [];
const skins = ['blue', 'green', 'orange', 'purple', 'tan'];

export function pickRandomMob(mobs) {
  return mobs[Math.floor(Math.random() * mobs.length)];
}

export function randomUserName() {
  let name = names[Math.floor(Math.random() * names.length)];

  const r = Math.random();
  let separator;
  if (r < 0.3) {
    separator = '.';
  } else if (r < 0.6) {
    separator = '_';
  } else {
    separator = '';
  }

  if (Math.random() < 0.5) {
    name += separator;
    if (Math.random() < 0.5) name += Math.floor(Math.random() * 99);
    else name += Math.floor(Math.random() * 59) + 1960;
  }

  if (Math.random() < 0.5)
    name =
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      separator +
      name;

  if (Math.random() < 0.2) name = name.toLowerCase();

  return name;
}

export function generateJoinAction() {
  return {
    id: Math.floor(Math.random() * 9999),
    action: 'join',
    value: {
      skin: skins[Math.floor(Math.random() * skins.length)],
      name: randomUserName(),
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 600),
    },
  };
}

export function generateMoveAction(mob) {
  const dist = 60;
  return {
    id: mob.id,
    action: 'move',
    value: {
      x: mob.value.x + Math.floor(Math.random() * dist) - dist / 2,
      y: mob.value.y + Math.floor(Math.random() * dist) - dist / 2,
    },
  };
}

export function weightedPick(arr) {
  // Get the max weight
  const max = arr.reduce((total, item) => {
    return total + item.weight;
  }, 0);

  // Calculate a random number on the scale of max
  let weight = Math.floor(Math.random() * max);

  // For each item in the array, decrement max by that item's weight
  let result;
  arr.some((item) => {
    weight -= item.weight;
    result = item;
    return weight < 0;
  });

  return result;
}

export function generateTicObject() {
  let t = { actions: [] };
  // console.log('mobs', mobs);

  for (let i = 0; i < behavior.maxActionsPerTic; i++) {
    switch (weightedPick(behavior.actionsWeight).value) {
      case 'join':
        if (mobs.length < behavior.maxMobs) {
          const mob = generateJoinAction();
          mobs.push(mob);
          t.actions.push(mob);
        }
        break;
      case 'leave':
        // todo
        break;
      case 'move':
        const mob = pickRandomMob(mobs.filter((m) => m.id !== -1));
        if (mob) t.actions.push(generateMoveAction(mob));
        break;
      default:
        break;
    }
  }

  // console.log('tic', t);

  return t;
}

export function reset() {
  mobs.length = 0;
}
