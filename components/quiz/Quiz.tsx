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
  reaction: string;
  micStatus: any;
  micColor: any;
}
interface State {
  reaction: boolean;
  next: boolean;
  passed: boolean;
  answer: string;
  answerSet: Array<string>;
  compare: boolean;
}

function getByIndex(obj: any, index: number) {
  return obj[Object.keys(obj)[index]];
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
    );
    if (Platform.OS === 'ios') Tts.setIgnoreSilentSwitch(false);
  }

  state: State = {
    reaction: false,
    next: false,
    passed: false,
    answer: '',
    answerSet: [],
    compare: false,
  };

  finishListener: any;

  componentDidMount() {
    this.props.micStatus('hide');
    this.ttsSpeaking(this.props.reaction);
    if (this.props.data.type === 'Q') {
      this.setState({
        answerSet: getByIndex(this.props.data, 5),
      });
    } else {
      this.setState({
        answer: this.props.data.v_en,
        next: true,
      });
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.reaction !== nextState.reaction ||
      this.state.next !== nextState.next ||
      this.state.passed !== nextState.passed ||
      this.state.compare !== nextState.compare
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
    Tts.stop();
    if (
      this.state.reaction &&
      !this.state.next &&
      this.props.data.type !== 'VQ'
    ) {
      this.setState({
        next: true,
      });
    }
    if (!this.state.reaction) {
      setTimeout(() => {
        this.setState({
          reaction: true,
        });
      }, 2000);
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
      this.props.micColor('colored');
      this.props.micStatus('correct');
    } else {
      //말했는데 실패한 경우
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

  _debounce = (fn: any, delay: number) => {
    let timer: any = null;
    return function (...args: any) {
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

  getEn() {
    const {data, reaction} = this.props;
    if (!this.state.reaction) {
      return (
        <FadeToLeft data={data.type === 'Q' ? reaction : ' '} color={'#444'} />
      );
    } else {
      this.props.micStatus('testing');
      this.props.micColor('white');
      if (!this.state.next) {
        this.ttsSpeaking(this.props.data.q_en.replace('/', ' '));
        return (
          <FadeIn
            data={data.q_en}
            color={'#444'}
            textAlign={'left'}
            fontSize={20}
          />
        );
      } //next true
      else {
        if (!this.state.passed) {
          if (!this.state.compare) {
            Voice.start('en-US');
            return (
              <FadeToLeft
                data={data.type === 'VQ' ? data.v_en : this.state.answerSet[0]}
                color={'transparent'}
              />
            );
          } else {
            return (
              <Compare
                answer={
                  data.type === 'VQ'
                    ? data.v_en.replace('~', '')
                    : this.state.answer
                }
                finish={this.finishCompare.bind(this)}
                micStatus={this.props.micStatus}
                micColor={this.props.micColor}
              />
            );
          }
        } else {
          this.props.micColor('colored');
          this.props.micStatus('correct');
          this.ttsSpeaking(
            data.type === 'VQ' ? data.v_en.replace('~', '') : this.state.answer,
          );
          return (
            <FadeToLeft
              data={data.type === 'VQ' ? data.v_en : this.state.answer}
              color={'#444'}
            />
          );
        }
      }
    }
  }

  getKor() {
    const {data} = this.props;
    if (!this.state.reaction) {
      return ' ';
    } else {
      if (data.type === 'VQ') {
        return data.v_ko;
      } else {
        if (!this.state.next) {
          return this.removeBrackets(data.q_ko);
        } else {
          return this.removeBrackets(data.guide);
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
        <FadeToTop
          data={this.getKor()}
          color={'#444'}
          accentColor={'#888'}
          fontSize={20}
          textAlign={'flex-start'}
        />
      </View>
    );
  }
}

export default Quiz;
