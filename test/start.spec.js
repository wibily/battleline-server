import {Map, List, fromJS} from 'immutable';
import {expect} from 'chai';

import {start} from '../src/core';

describe('application logic', () => {

  describe('start', ()=> {

    it('should return expected non random fields', () => {
      const nextState = start();

      const expectedFields = Map({
        winner: null,
        turn: 'p1',
        lanes: List.of(
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          }),
          Map({
            winner: null,
            p1: List(),
            p2: List()
          })
        )
      });

      expect(nextState.get('winner')).equals(expectedFields.get('winner'));
      expect(nextState.get('turn')).equals(expectedFields.get('turn'));

      for(const laneKeyValue of expectedFields.get('lanes').entries()){
        const lane = laneKeyValue[1];
        expect(lane.get('winner')).to.be.null;
        expect(lane.get('p1').equals(List()));
        expect(lane.get('p2').equals(List()));
      }
    });

    it('should return shuffled fields', () => {
      const nextState = start();
      expect(nextState.get('p1').size).equals(7);
      expect(nextState.get('p2').size).equals(7);
      expect(nextState.get('deck').size).equals(46);
    });

  });
});