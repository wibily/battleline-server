import {Map, fromJS} from 'immutable';

export const INITIAL_STATE = start();

export function start() {
  return Map({
    winner: null,
    turn: "p1"
  });
}
