import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Description from './description/Description';
import Voca from './voca/Voca';
import Quiz from './quiz/Quiz';
import MIC from './mic/MIC';

interface Props {
  reaction: number;
  onPressHandler: any; //for close function
  data: any;
  goNextPage(stat: boolean): void;
}

interface State {
  index: number;
  status: 'wrong' | 'correct' | 'hide' | 'testing';
  color: 'colored' | 'white' | 'red';
  vol1: boolean;
  vol2: boolean;
}

class AiTutor extends Component<Props, State> {
  state: State = {
    index: 0,
    status: 'hide',
    color: 'colored',
    vol1: false,
    vol2: false,
  };

  getContents(type: string) {
    const {data} = this.props;
    if (type === 'D') {
      return <Description data={data} goNextPage={this.props.goNextPage} />;
    } else if (type === 'Q' || type === 'VQ') {
      const ones = [
        '.',
        'One.',
        'Two.',
        'Three.',
        'Four.',
        'Five.',
        'Six.',
        'Seven.',
        'Eight.',
        'Nine.',
        'Ten.',
        'Eleven.',
        'Twelve.',
        'Thirteen.',
        'Fourteen.',
        'Fifteen.',
        'Sixteen.',
        'Seventeen.',
        'Eighteen.',
        'Nineteen.',
      ];
      const tens = [
        '',
        '',
        'Twenty ',
        'Thirty ',
        'Forty ',
        'Fifty ',
        'Sixty ',
        'Seventy ',
        'Eighty ',
        'Ninety ',
      ];
      return (
        <Quiz
          data={data}
          reactionNum={
            this.props.reaction < 20
              ? ones[this.props.reaction]
              : tens[this.props.reaction / 10] + ones[this.props.reaction % 10]
          }
          micStatus={this.micStatus}
          micColor={this.micColor}
          micVolume={this.micVolume}
          goNextPage={this.props.goNextPage}
        />
      );
    } else if (type === 'V') {
      return (
        <Voca
          data={data}
          micStatus={this.micStatus}
          micColor={this.micColor}
          micVolume={this.micVolume}
          goNextPage={this.props.goNextPage}
        />
      );
    } else {
      return null;
    }
  }

  micStatus = (status: 'wrong' | 'correct' | 'hide' | 'testing') => {
    this.setState({
      status: status,
    });
  };

  micColor = (color: 'colored' | 'white' | 'red') => {
    this.setState({
      color: color,
    });
  };

  micVolume = (vol1: boolean, vol2: boolean) => {
    this.setState({
      vol1: vol1,
      vol2: vol2,
    });
  };

  render() {
    const type = this.props.data.type;
    return (
      <>
        <View style={styles.view}>{this.getContents(type)}</View>
        {type !== 'D' && (
          <View style={{flex: 1, justifyContent: 'flex-start'}}>
            <MIC
              status={this.state.status}
              color={this.state.color}
              vol1={this.state.vol1}
              vol2={this.state.vol2}
            />
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 2,
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default AiTutor;
