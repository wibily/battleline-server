import {Map, is, fromJS} from 'immutable';
import {shuffle} from 'lodash/collection';
import {ERRORS} from './errors';

export const EMPTY_LANE = {
  winner: null,
  p1: [],
  p2: []
};

const NUM_SUITES = 6;
const NUM_TROOP_VALUES = 10;

function shuffleDeck() {
  let deck = [];
  for (let suite = 1; suite <= NUM_SUITES; suite++) {
    for (let troop = 1; troop <= NUM_TROOP_VALUES; troop++) {
      deck.push([troop, suite]);
    }
  }
  return shuffle(deck);
}

export function start() {
  let deck = fromJS(shuffleDeck());

  return Map({
    error: null,
    winner: null,
    turn: 'p1',
    p1: deck.slice(0, 7),
    p2: deck.slice(7, 14),
    deck: deck.skip(14),
    lanes: fromJS(new Array(9).fill(EMPTY_LANE))
  });
}

function isCardInHand(state, action) {
  let player = state.get('turn');
  let playedCard = fromJS(action.card);

  return state.get(player).find(cardInHand => is(cardInHand, playedCard));
}

function isLaneWon(state, action) {
  return state.getIn(['lanes', action.lane, 'winner']);
}

function isLaneFull(state, action){
  let player = state.get('turn');

  return state.getIn(['lanes', action.lane, player]).size >= 3;
}


function getErrors(state, action) {

  if (!isCardInHand(state, action)){
    return ERRORS.play.cardNotInHand;
  }

  if(isLaneWon(state, action)){
    return ERRORS.play.laneIsAlreadyWon;
  }

  if(isLaneFull(state, action)){
    return ERRORS.play.laneIsAlreadyFull;
  }

  return null;
}

export function play(state, action) {
  let player = state.get('turn');
  let playedCard = fromJS(action.card);

  let errors = getErrors(state, action);
  if(errors){
    return state.set('error', errors);
  }

  return state
    .set('turn', switchTurn(player))
    .set(player, state.get(player).filterNot(card => is(card, playedCard)))
    .updateIn(['lanes', action.lane, player], lane => lane.push(fromJS(action.card)));
}


function switchTurn(turn) {
  return (turn === 'p1') ? 'p2' : 'p1';
}
