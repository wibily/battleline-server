import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {start} from '../src/core';

describe('application logic', () => {

  describe('start', ()=> {

    it('should return player 1 as the starting player', () => {
      const nextState = start();
      expect(nextState).to.equal(Map({
        winner: null,
        turn: 'p1'
      }));
    });
  });
});