import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Tts from '../sounds/Tts';
import Stt from '../sounds/Stt';

let colors: Array<string> = [];
type StateKeys = keyof State;

interface Props {
  answer: string;
  finish: any;
  micStatus(stat: string): void;
  micColor(color: string): void;
  micVolume(vol1: boolean, vol2: boolean): void;
}
interface State {
  answerArray: Array<string>;
  count: number;
  speech: string;
  words: Array<string>;
  fontStyle: 'normal' | 'italic' | undefined;
}

class Compare extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    colors = this.props.answer.split(' ').map((_) => 'transparent');
    this.setState({
      words: colors,
    });
  }

  state: State = {
    answerArray: this.props.answer.replace('.', '').split(' '),
    count: 0,
    speech: '',
    words: [],
    fontStyle: 'normal',
  };

  tts2: any;
  stt2: any;

  componentDidMount() {
    this.tts2.ttsSpeaking('Speak it up again.');
    this.forceUpdate();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.count !== nextState.count ||
      this.state.words !== nextState.words
    );
  }

  compareSetState = (
    key: StateKeys,
    value: number | string | Array<string> | boolean,
    func?: any,
  ) => {
    this.setState(
      {
        [key]: value,
      } as Pick<State, keyof State>,
      func,
    );
  };

  render() {
    const styles = StyleSheet.create({
      view: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: '30%',
      },
      text: {
        fontSize: 20,
        margin: 4,
      },
    });

    const getTextStyle = (index: number): Object => {
      //현재 맞췄다면
      if (
        this.state.words[index] === '#6807f9' ||
        this.state.words[index] === '#444'
      ) {
        return {
          color: this.state.words[index],
          fontStyle: 'normal',
          borderBottomColor: '#aaa',
          borderBottomWidth: 1,
        };
      } else {
        //틀린 단어
        if (this.state.count == 2) {
          //힌트
          return {
            color: '#aaa',
            fontStyle: 'italic',
            borderBottomColor: '#aaa',
            borderBottomWidth: 1,
          };
        } else {
          //틀렸지만 아직 힌트가 나오기 전
          return {
            color: 'transparent',
            fontStyle: 'normal',
            borderBottomWidth: 1,
            borderBottomColor: '#aaa',
          };
        }
      }
    };

    const {answerArray} = this.state;
    return (
      <View style={styles.view}>
        <Tts
          ref={(ref) => {
            if (ref !== undefined) this.tts2 = ref;
          }}
          sttRef={this.stt2}
          type={'Compare'}
          micColor={this.props.micColor}
          micStatus={this.props.micStatus}
          compareCount={this.state.count}
        />
        <Stt
          ref={(ref) => (this.stt2 = ref)}
          ttsRef={this.tts2}
          type={'Compare'}
          data={this.props.answer}
          count={this.state.count}
          colors={colors}
          compareSetState={this.compareSetState}
          micColor={this.props.micColor}
          micStatus={this.props.micStatus}
          micVolume={this.props.micVolume}
          finishCompare={this.props.finish}
        />
        {answerArray.map((word, i) => {
          return (
            <Text key={`word-${i}`} style={[styles.text, getTextStyle(i)]}>
              {word + ' '}
            </Text>
          );
        })}
      </View>
    );
  }
}

export default Compare;
