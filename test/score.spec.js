import {fromJS} from 'immutable';
import {EMPTY_LANE} from "../src/core";

import {expect} from 'chai';

import {scoreLine, getMaxScore} from '../src/score';

describe('score logic', ()=> {

  it('should calculate max score of partially completed wedge', () => {
    let wedgeScore = scoreLine(fromJS([[1, 1], [2, 1], [3, 1]]));

    let maxScore = getMaxScore(fromJS([[1, 1], [2, 1]]),
      fromJS([{
        winner: null,
        p1: [[10, 5], [10, 6], [10, 4]],
        p2: [[1, 1], [2, 1]]
      }, ...new Array(8).fill(EMPTY_LANE)]));

    expect(wedgeScore).equals(maxScore);
  });

  it('should calculate max score of partially completed wedge requiring middle value', () => {
    let wedgeScore = scoreLine(fromJS([[1, 1], [2, 1], [3, 1]]));

    let maxScore = getMaxScore(fromJS([[1, 1], [3, 1]]),
      fromJS([{
        winner: null,
        p1: [[10, 5], [10, 6], [10, 4]],
        p2: [[1, 1], [3, 1]]
      }, ...new Array(8).fill(EMPTY_LANE)]));

    expect(wedgeScore).equals(maxScore);
  });
});



