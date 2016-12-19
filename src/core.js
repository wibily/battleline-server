import {Map, List, fromJS} from 'immutable';
import {shuffle} from 'lodash/collection';

export const EMPTY_LANE =  {
  winner: null,
  p1:[],
  p2:[]
};

const NUM_SUITES = 6;
const NUM_TROOP_VALUES = 10;

function shuffleDeck(){
  let deck = [];
  for(let suite = 1; suite <= NUM_SUITES; suite++){
    for(let troop = 1; troop <= NUM_TROOP_VALUES; troop++){
      deck.push([troop, suite]);
    }
  }
  return shuffle(deck);
}

export function start() {
  let deck = fromJS(shuffleDeck());

  return Map({
    winner: null,
    turn: 'p1',
    p1: deck.slice(0,7),
    p2: deck.slice(7,14),
    deck: deck.skip(14),
    lanes: fromJS(Array(9).fill(EMPTY_LANE))
  });
}

//type = PLAY
export function play(state, action) {
  //not yet implemented
  return state
    .set('turn', switchTurn(state.get('turn')));
}

function switchTurn(turn){
  return (turn === 'p1') ? 'p2' : 'p1';
}
