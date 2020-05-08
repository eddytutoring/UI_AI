import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Description from './description/Description';
import Voca from './voca/Voca';
import Quiz from './quiz/Quiz';
import MIC from './mic/MIC';

interface Props {
  onPressHandler: any;
  page: number;
  fileName: string;
}

interface State {
  index: number;
  status: 'wrong' | 'correct' | 'hide' | 'testing';
  color: 'colored' | 'white' | 'red';
}

class AiTutor extends Component<Props, State> {
  state: State = {
    index: 0,
    status: 'wrong',
    color: 'red',
  };

  getJSON = () => {
    try {
      return require('./data/preview.json').data.items[this.props.page];
    } catch (err) {
      console.warn(err);
    }
  };

  data = this.getJSON();

  getContents(type: string) {
    if (type === 'D') {
      return <Description data={this.data} />;
    } else if (type === 'Q' || type === 'VQ') {
      //VQ+Q
      return (
        <Quiz
          data={this.data}
          reaction={'one'}
          micStatus={this.micStatus.bind(this)}
          micColor={this.micColor.bind(this)}
        />
      );
    } else if (type === 'V') {
      //V
      return (
        <Voca
          data={this.data}
          micStatus={this.micStatus.bind(this)}
          micColor={this.micColor.bind(this)}
        />
      );
    } else {
      return null;
    }
  }

  micStatus(status: 'wrong' | 'correct' | 'hide' | 'testing') {
    this.setState({
      status: status,
    });
  }

  micColor(color: 'colored' | 'white' | 'red') {
    this.setState({
      color: color,
    });
  }

  render() {
    const type = this.data.type;
    return (
      <>
        <View style={styles.view}>{this.getContents(type)}</View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <MIC status={this.state.status} color={this.state.color} />
        </View>
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
