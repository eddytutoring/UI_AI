import React, {Component} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
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
}
interface State {
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
    next: false,
    passed: false,
    answer: '',
    answerSet: [],
    compare: false,
  };

  finishListener: any;

  componentDidMount() {
    if (this.props.data.type === 'Q') {
      // let answers = Object.keys(this.props.data).length;
      let temp: Array<string> = [];
      // for (let i = 5; i < answers; i++) {
      temp = getByIndex(this.props.data, 5);
      console.log('temp: ' + temp);
      // }
      this.setState({
        answerSet: temp,
      });
    } else {
      this.setState({
        answer: this.props.data.v_en,
      });
    }
  }

  componentWillUnmount() {
    Tts.removeEventListener('tts-finish', this.finishListener);
    Tts.stop();
    Voice.destroy().then(Voice.removeAllListeners);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.next !== nextState.next ||
      this.state.passed !== nextState.passed ||
      this.state.compare !== nextState.compare
    );
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
    if (!this.state.next && this.props.data.type !== 'VQ') {
      this.setState({
        next: true,
      });
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
    console.log('말한다~');
    console.log(e.value);
    console.log(this.state.answerSet);
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

    console.log('답: ' + this.state.answer);

    if (rating >= 0.7) {
      //통과한 경우
      Voice.destroy().then(Voice.removeAllListeners); //voice 자원 해제
      console.log('passed');
      this.setState({
        passed: true,
        compare: false,
      });
    } else {
      //말했는데 실패한 경우
      Voice.destroy()
        .then(Voice.removeAllListeners)
        .then(() =>
          this.setState({
            compare: true,
          }),
        );
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

  getEn() {
    const {data} = this.props;
    if (data.type === 'VQ') {
      if (!this.state.passed && !this.state.compare) {
        setTimeout(() => {
          Voice.start('en-US');
        }, 500);
        return <FadeToLeft data={' '} />;
      } else if (this.state.passed) {
        this.ttsSpeaking(data.v_en.replace('~', ''));
        return <FadeToLeft data={data.v_en} />;
      } else if (this.state.compare) {
        return (
          <Compare
            answer={data.v_en.replace('~', '')}
            finish={this.finishCompare.bind(this)}
          />
        );
      }
    } else {
      // Q;
      if (!this.state.next && !this.state.passed) {
        this.ttsSpeaking(this.props.data.q_en.replace('/', ' '));
        return (
          <FadeIn
            data={data.q_en}
            color={'black'}
            textAlign={'left'}
            fontSize={20}
          />
        );
      } else if (this.state.next && !this.state.passed && !this.state.compare) {
        Voice.start('en-US');
        return <FadeToLeft data={' '} />;
      } else if (this.state.next && this.state.passed) {
        this.ttsSpeaking(this.state.answer);
        return <FadeToLeft data={this.state.answer} />;
      } else if (this.state.compare) {
        return (
          <Compare
            answer={this.state.answer}
            finish={this.finishCompare.bind(this)}
          />
        );
      }
    }
  }

  finishCompare() {
    this.setState({passed: true, compare: false});
  }

  getKor() {
    const {data} = this.props;
    if (data.type === 'VQ') {
      return data.v_ko;
    } else {
      //q
      if (!this.state.next) {
        return this.removeBrackets(data.q_ko);
      } else {
        return this.removeBrackets(data.guide);
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
          color={'black'}
          accentColor={'black'}
          fontSize={20}
          textAlign={'flex-start'}
        />
        {/* mic */}
      </View>
    );
  }
}

export default Quiz;
