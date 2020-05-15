import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FadeToTop from '../animations/FadeToTop';
import FadeToLeft from '../animations/FadeToLeft';
import FadeIn from '../animations/FadeIn';
import Compare from './Compare';
import Tts from '../sounds/Tts';
import Stt from '../sounds/Stt';

type StateKeys = keyof State;

interface Props {
  data: any;
  reactionNum: string;
  micStatus(stat: string): void;
  micColor(color: string): void;
  goNextPage(stat: boolean): void;
}
interface State {
  reaction: boolean;
  reaction2: boolean;
  next: boolean;
  passed: boolean;
  answer: string;
  answerSet: Array<string>;
  compare: boolean;
  nextPage: boolean;
  wait: boolean;
}

class Quiz extends Component<Props, State> {
  state: State = {
    reaction: false,
    reaction2: false,
    next: false,
    passed: false,
    answer: '',
    answerSet: [],
    compare: false,
    nextPage: false,
    wait: true,
  };

  tts: any;
  stt: any;

  componentDidMount() {
    const {data, reactionNum} = this.props;
    if (data.type === 'Q') {
      this.tts.ttsSpeaking(reactionNum);
      this.setState({
        answerSet: data.a_set,
      });
    } else {
      this.setState({
        reaction: true,
        answer: data.v_en,
        next: true,
      });
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.reaction !== nextState.reaction ||
      this.state.next !== nextState.next ||
      this.state.passed !== nextState.passed ||
      this.state.compare !== nextState.compare ||
      this.props.data !== nextProps.data ||
      this.state.reaction2 !== nextState.reaction2 ||
      this.state.wait !== nextState.wait
    );
  }

  finishCompare = () => {
    this.setState({passed: true, compare: false});
  };

  randomReaction2() {
    const reactions2 = ['great', 'nice', 'excellent', 'good'];
    return reactions2[Math.floor(Math.random() * 4)];
  }

  getEn() {
    const {data, reactionNum, micStatus, micColor} = this.props;
    const {
      reaction,
      reaction2,
      next,
      passed,
      compare,
      answer,
      wait,
    } = this.state;
    if (!reaction) {
      micStatus('hide');
      return <FadeToLeft data={data.type === 'Q' ? reactionNum : ' '} />;
    } else {
      if (!next) {
        micStatus('testing');
        micColor('colored');
        this.tts.ttsSpeaking(data.q_en.replace('/', ' '));
        return <FadeIn data={data.q_en} type={'noImg'} />;
      } //next true
      else {
        if (!passed) {
          if (!compare) {
            micStatus('testing');
            micColor('white');
            this.stt.start();
            return (
              <Text
                style={{
                  opacity: 0,
                  height: '30%',
                }}></Text>
            );
          } else {
            setTimeout(() => {
              this.setState({
                wait: false,
              });
            }, 500);
            if (!wait) {
              return (
                <Compare
                  answer={
                    data.type === 'VQ' ? data.v_en.replace('~', '') : answer
                  }
                  finish={this.finishCompare}
                  micStatus={micStatus}
                  micColor={micColor}
                />
              );
            } else {
              return <Text style={{height: '30%'}}></Text>;
            }
          }
        } else {
          //passed
          if (!reaction2) {
            micColor('colored');
            micStatus('correct');
            if (this.tts !== null)
              this.tts.ttsSpeaking(
                data.type === 'VQ' ? data.v_en.replace('~', '') : answer,
              );
            return (
              <FadeToLeft data={data.type === 'VQ' ? data.v_en : answer} />
            );
          } else {
            if (this.tts !== null) this.tts.ttsSpeaking(this.randomReaction2());
            micStatus('hide');
            <Text style={{height: '30%'}}>' '</Text>;
          }
        }
      }
    }
  }

  getKor() {
    const {data} = this.props;
    if (!this.state.reaction) return ' ';
    //리액션
    else {
      //리액션 끝난후
      if (data.type === 'VQ') {
        //프리뷰면
        if (!this.state.reaction2) return data.v_ko;
        else return ' ';
      } else {
        //리뷰면
        if (!this.state.next) return this.removeBrackets(data.q_ko);
        //next false
        else {
          //next true
          if (!this.state.reaction2) return this.removeBrackets(data.guide);
          else return ' ';
        }
      }
    }
  }

  getSound() {
    if (!this.state.compare) {
      this.setState({
        wait: true,
      });
      return (
        <>
          <Tts
            ref={(ref) => (this.tts = ref)}
            sttRef={this.stt}
            type={this.props.data.type}
            micStatus={this.props.micStatus}
            micColor={this.props.micColor}
            goNextPage={this.props.goNextPage}
            quizState={{
              next: this.state.nextPage,
              reaction: this.state.reaction,
              reaction2: this.state.reaction2,
              passed: this.state.passed,
            }}
            quizSetState={this.quizSetState}
          />
          <Stt
            ref={(ref) => (this.stt = ref)}
            type={this.props.data.type}
            data={this.props.data}
            ttsRef={this.tts}
            answer={
              this.props.data.type === 'Q'
                ? this.props.data.a_set
                : this.props.data.v_en
            }
            quizSetState={this.quizSetState}
            micColor={this.props.micColor}
            micStatus={this.props.micStatus}
          />
        </>
      );
    } else {
      return null;
    }
  }

  removeBrackets(str: string) {
    str = str.split('{').join('');
    return str.split('}').join('');
  }

  quizSetState = (key: StateKeys, value: boolean | string | Array<string>) => {
    this.setState({
      [key]: value,
    } as Pick<State, keyof State>);
  };

  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'space-around',
        padding: 30,
        alignItems: 'flex-start',
      },
    });

    return (
      <View style={styles.view}>
        {this.getSound()}
        {this.getEn()}
        <FadeToTop data={this.getKor()} type={'vocaAndQuiz'} />
      </View>
    );
  }
}

export default Quiz;
