import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Description from './description/Description';
import Voca from './voca/Voca';
import Quiz from './quiz/Quiz';
import MIC from './mic/MIC';

interface Props {
  reaction: string;
  onPressHandler: any;
  fileName: string;
  data: any;
}

interface State {
  index: number;
  status: 'wrong' | 'correct' | 'hide' | 'testing';
  color: 'colored' | 'white' | 'red';
}

class AiTutor extends Component<Props, State> {
  state: State = {
    index: 0,
    status: 'hide',
    color: 'colored',
  };

  getContents(type: string) {
    const {data} = this.props;
    if (type === 'D') {
      return <Description data={data} />;
    } else if (type === 'Q' || type === 'VQ') {
      //VQ+Q
      return (
        <Quiz
          data={data}
          reaction={this.props.reaction}
          micStatus={this.micStatus.bind(this)}
          micColor={this.micColor.bind(this)}
        />
      );
    } else if (type === 'V') {
      //V
      return (
        <Voca
          data={data}
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
    const type = this.props.data.type;
    return (
      <>
        <View style={styles.view}>{this.getContents(type)}</View>
        {type !== 'D' && (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <MIC status={this.state.status} color={this.state.color} />
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
