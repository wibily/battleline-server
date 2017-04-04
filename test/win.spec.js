import {List, Map, fromJS} from 'immutable';

import {expect} from 'chai';

import {play, EMPTY_LANE} from '../src/core';
import {ERRORS} from '../src/errors';

describe('win detection logic', () => {

  it('should not allow players to play cards after the game has been won', () => {
    let p1WonState = Map({
      error: null,
      winner: 'p1',
      turn: 'p2',
      p1: List(),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[2, 1], [3, 2]]),
      lanes: fromJS([
        EMPTY_LANE, EMPTY_LANE, EMPTY_LANE,
        {winner: 'p1'}, {winner: 'p1'}, {winner: 'p1'},
        EMPTY_LANE, EMPTY_LANE, EMPTY_LANE
      ])
    });

    let nextState = play(p1WonState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    expect(nextState).equal(p1WonState.set('error', ERRORS.play.gameIsAlreadyOver));
  });

  it('should allow players to win a lane by host', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[5, 2]]),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[2, 1], [3, 2]]),
      lanes: fromJS([{
        winner: null,
        p1: [[1, 4], [2, 2]],
        p2: [[1, 5], [2, 6], [4, 2]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [5, 2],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[2, 1]]),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[3, 2]]),
      lanes: fromJS([{
        winner: 'p1',
        p1: [[1, 4], [2, 2], [5, 2]],
        p2: [[1, 5], [2, 6], [4, 2]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);

  });

  it('should allow players to win a lane by skirmish line over host', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[3, 2]]),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[2, 1], [5, 6]]),
      lanes: fromJS([{
        winner: null,
        p1: [[1, 4], [2, 2]],
        p2: [[10, 5], [8, 6], [6, 2]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [3, 2],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[2, 1]]),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[5, 6]]),
      lanes: fromJS([{
        winner: 'p1',
        p1: [[1, 4], [2, 2], [3, 2]],
        p2: [[10, 5], [8, 6], [6, 2]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);

  });

  it('should allow players to win a lane by battalion order over a skirmish line', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[3, 2]]),
      p2: fromJS([[4, 1]]),
      deck: fromJS([[5, 6]]),
      lanes: fromJS([{
        winner: null,
        p1: [[3, 3], [4, 4], [5, 5]],
        p2: [[1, 1], [3, 1]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [4, 1],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[3, 2]]),
      p2: fromJS([[5, 6]]),
      deck: fromJS([]),
      lanes: fromJS([{
        winner: 'p2',
        p1: [[3, 3], [4, 4], [5, 5]],
        p2: [[1, 1], [3, 1], [4, 1]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);

  });

  it('should allow players to win a lane by phalanx over a battalion order', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: fromJS([[4, 1]]),
      deck: fromJS([[5, 6]]),
      lanes: fromJS([{
        winner: null,
        p1: [[1, 3], [1, 4]],
        p2: [[10, 6], [9, 6], [7, 6]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[5, 6]]),
      p2: fromJS([[4, 1]]),
      deck: fromJS([]),
      lanes: fromJS([{
        winner: 'p1',
        p1: [[1, 3], [1, 4], [1, 1]],
        p2: [[10, 6], [9, 6], [7, 6]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);

  });

  it('should allow players to win a lane by wedge over phalanx', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[4, 1]]),
      p2: fromJS([[1, 1]]),
      deck: fromJS([[5, 6]]),
      lanes: fromJS([{
        winner: null,
        p1: [[10, 5], [10, 6], [10, 4]],
        p2: [[2, 1], [3, 1]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[4, 1]]),
      p2: fromJS([[5, 6]]),
      deck: fromJS([]),
      lanes: fromJS([{
        winner: 'p2',
        p1: [[10, 5], [10, 6], [10, 4]],
        p2: [[2, 1], [3, 1], [1, 1]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);
  });

  it('should award flag to player that did not play last if score is tied', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: fromJS([[]]),
      deck: fromJS([[5, 6]]),
      lanes: fromJS([{
        winner: null,
        p1: [[1, 2], [1, 3]],
        p2: [[1, 4], [1, 5], [1, 6]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[5, 6]]),
      p2: fromJS([[]]),
      deck: fromJS([]),
      lanes: fromJS([{
        winner: 'p2',
        p1: [[1, 2], [1, 3], [1, 1]],
        p2: [[1, 4], [1, 5], [1, 6]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);
  });

  it('should deduce a win by wedge', () => {
    let startState = Map({
      error: null,
      winner: null,
      turn: 'p1',
      p1: fromJS([[1, 1]]),
      p2: fromJS([[1, 2]]),
      deck: fromJS([[5, 6]]),
      lanes: fromJS([{
        winner: null,
        p1: [[2, 1], [3, 1]],
        p2: [[3, 3], [1, 6]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    let nextState = play(startState, {
      type: 'PLAY',
      card: [1, 1],
      lane: 0
    });

    let expectedState = Map({
      error: null,
      winner: null,
      turn: 'p2',
      p1: fromJS([[5, 6]]),
      p2: fromJS([[1, 2]]),
      deck: fromJS([]),
      lanes: fromJS([{
        winner: 'p1',
        p1: [[2, 1], [3, 1], [1, 1]],
        p2: [[3, 3], [1, 6]]
      }, ...new Array(8).fill(EMPTY_LANE)])
    });

    expect(nextState).equal(expectedState);
  });

});
