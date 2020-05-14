import React, {Component} from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';
import FadeToTop from '../animations/FadeToTop';
import FadeToLeft from '../animations/FadeToLeft';
import FadeIn from '../animations/FadeIn';
import Compare from './Compare';
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

const tokenizer = new Tokenizer();

interface Props {
  data: any;
  reactionNum: string;
  micStatus: any;
  micColor: any;
  goNextPage: any;
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
}

class Quiz extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.finishListener = this.ttsCallback.bind(this);
    Tts.setDefaultLanguage('en-US');
    Tts.addEventListener('tts-finish', this.finishListener);
    Voice.onSpeechResults = this._debounce(
      this.onSpeechResultsHandler.bind(this),
      500,
    ).bind(this);
    Voice.onSpeechError = this.onSpeechErrorHandler.bind(this);
    if (Platform.OS === 'ios') Tts.setIgnoreSilentSwitch(false);
  }

  state: State = {
    reaction: false,
    reaction2: false,
    next: false,
    passed: false,
    answer: '',
    answerSet: [],
    compare: false,
    nextPage: false,
  };

  finishListener: any;

  componentDidMount() {
    const {data, reactionNum, micStatus} = this.props;
    micStatus('hide');
    this.ttsSpeaking(reactionNum);
    if (data.type === 'Q') {
      this.setState({
        answerSet: data.a_set,
      });
    } else {
      this.setState({
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
      this.state.reaction2 !== nextState.reaction2
    );
  }

  componentWillUnmount() {
    Tts.removeEventListener('tts-finish', this.finishListener);
    Tts.stop();
    Voice.destroy().then(Voice.removeAllListeners);
  }

  ttsSpeaking(str: string) {
    Tts.speak(
      str,
      Platform.OS === 'ios'
        ? {
            iosVoiceId: 'com.apple.ttsbundle.siri_female_en-US_compact',
            rate: 0.5,
          }
        : {
            androidParams: {
              KEY_PARAM_PAN: -1,
              KEY_PARAM_VOLUME: 1,
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
            },
          },
    );
  }

  ttsCallback() {
    const {reaction, reaction2, next, passed} = this.state;
    const {data, goNextPage} = this.props;
    Tts.stop();
    if (reaction && !next && data.type !== 'VQ') {
      this.setState({
        next: true,
      });
    }

    if (!reaction) {
      setTimeout(() => {
        this.setState({
          reaction: true,
        });
      }, 2000);
    }

    if (passed) {
      if (!reaction2) {
        setTimeout(() => {
          this.setState({
            reaction2: true,
          });
        }, 1000);
      } else {
        setTimeout(() => {
          goNextPage(true);
        }, 2000);
      }
    }
  }

  processNLU(answerSentence: string, candidateList: string[]) {
    const answerWord = tokenizer
      .tokenize(answerSentence.toLowerCase().replace('~', ''))
      .filter((token: any) => token.tag === 'word' || token.tag === 'number')
      .map((token: any) => token.value)
      .join('');

    return similarity.findBestMatch(answerWord, [
      ...candidateList.map((sentence) =>
        sentence.toLowerCase().replace('~', ''),
      ),
    ]);
  }

  onSpeechResultsHandler(e: Object | any) {
    console.log('voice result');
    // console.log(e.value);
    // console.log(this.state.answerSet);
    let rating = 0;
    if (this.state.answer == '') {
      let accuracy = this.state.answerSet.map((sentence) => {
        return this.processNLU(sentence, e.value).bestMatch.rating;
      });

      let indexOfMaxValue = accuracy.reduce(
        (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
        0,
      );

      this.setState({
        answer: this.state.answerSet[indexOfMaxValue],
      });

      rating = accuracy[indexOfMaxValue];
    } else {
      rating = this.processNLU(this.props.data.v_en.replace('~', ''), e.value)
        .bestMatch.rating;
    }
    // console.log('답: ' + this.state.answer);
    if (rating >= 0.7) {
      //통과한 경우
      Voice.destroy().then(Voice.removeAllListeners);
      // console.log('passed');
      this.setState({
        passed: true,
        compare: false,
      });
    } else {
      //말했는데 실패한 경우
      console.log('fail');
      this.props.micColor('red');
      this.props.micStatus('wrong');
      setTimeout(() => {
        Voice.destroy()
          .then(Voice.removeAllListeners)
          .then(() =>
            this.setState({
              compare: true,
            }),
          );
      }, 1000);
    }
  }

  onSpeechErrorHandler(e: any) {
    console.warn(e.error);
    if (
      e.error.message === '6/No speech input' ||
      e.error.message === '7/No match'
    ) {
      console.log('catch');
      setTimeout(() => {
        Voice.start('en-US');
      }, 1000);
    }
  }

  _debounce = (fn: any, delay: number) => {
    let timer: any = null;
    return function (this: Quiz, ...args: any) {
      const context = this;
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  };

  finishCompare() {
    this.setState({passed: true, compare: false});
  }

  randomReaction2() {
    const reactions2 = ['great', 'nice', 'excellent', 'good'];
    return reactions2[Math.floor(Math.random() * 4)];
  }

  getEn() {
    const {data, reactionNum, micStatus, micColor} = this.props;
    const {reaction, reaction2, next, passed, compare, answer} = this.state;
    if (!reaction) {
      return <FadeToLeft data={data.type === 'Q' ? reactionNum : ' '} />;
    } else {
      if (!next) {
        micStatus('testing');
        micColor('colored');
        this.ttsSpeaking(data.q_en.replace('/', ' '));
        return (
          <FadeIn
            data={data.q_en}
            // color={'#444'}
            // textAlign={'left'}
            // fontSize={20}
            type={'noImg'}
          />
        );
      } //next true
      else {
        if (!passed) {
          if (!compare) {
            micStatus('testing');
            micColor('white');
            Voice.start('en-US');
            return (
              <Text
                style={{
                  opacity: 0,
                  height: '30%',
                }}></Text>
            );
          } else {
            return (
              <Compare
                answer={
                  data.type === 'VQ' ? data.v_en.replace('~', '') : answer
                }
                finish={this.finishCompare.bind(this)}
                micStatus={micStatus}
                micColor={micColor}
              />
            );
          }
        } else {
          //passed
          if (!reaction2) {
            micColor('colored');
            micStatus('correct');
            this.ttsSpeaking(
              data.type === 'VQ' ? data.v_en.replace('~', '') : answer,
            );
            return (
              <FadeToLeft data={data.type === 'VQ' ? data.v_en : answer} />
            );
          } else {
            this.ttsSpeaking(this.randomReaction2());
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

  removeBrackets(str: string) {
    str = str.split('{').join('');
    return str.split('}').join('');
  }

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
        {this.getEn()}
        <FadeToTop data={this.getKor()} type={'vocaAndQuiz'} />
      </View>
    );
  }
}

export default Quiz;
