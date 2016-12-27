//noinspection JSUnusedGlobalSymbols
let mockState = {
  "error": null,
  "winner": null,
  "turn": "p1|p2",
  "p1":[[],[],[]],
  "p2":[[],[],[]],
  "lanes":[{
    "winner": "p1|p2",
    "p1":[[],[],[]],
    "p2":[[],[],[]]
  },{},{}],
  "deck":[[],[],[]]
};

//card: [number, suite], suites start from 1
//noinspection JSUnusedGlobalSymbols
let playACTION = {
  type: 'PLAY',
  card: [1,1],
  lane: 0
};