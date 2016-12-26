var mockState = {
  "winner": null,
  "turn": "p1|p2",
  "p1":[[],[],[]],
  "p2":[[],[],[]],
  "lanes":[{
    "p1":[[],[],[]],
    "p2":[[],[],[]]
  },{},{}],
  "deck":[[],[],[]]
}

//card: [number, suite], suites start from 1
var playACTION = {
  type: 'PLAY',
  card: [1,1],
  lane: 0
}