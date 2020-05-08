import React, {Component} from 'react';
import {Platform, View, Text, StyleSheet} from 'react-native';
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

//speak it up again tts부터 최대 오답단계 까지(마지막 tts미포함: QUIZ로 넘어가 해결할 것)
//stt 3번, tts 3번, 비교단계

const tokenizer = new Tokenizer();
let words: Array<boolean> = [];

interface Props {
  answer: string;
  finish: any;
  micStatus: any;
  micColor: any;
}
interface State {
  count: number;
  speech: string;
  words: Array<boolean>;
}

class Compare extends Component<Props, State> {
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
    this.props.answer.split(' ').map((_) => (words = words.concat([false])));
    this.setState({
      words: words,
    });
  }

  state: State = {
    count: 0,
    speech: '',
    words: [],
  };

  finishListener: any;

  componentDidMount() {
    this.props.micColor('colored');
    this.props.micStatus('testing');
    this.ttsSpeaking('Speak it up again.');
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.state.count !== nextState.count;
  }

  componentDidUpdate() {
    this.setState({
      words: words,
    });
  }

  ttsSpeaking(str: string) {
    this.props.micColor('colored');
    this.props.micStatus('testing');
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
    if (this.state.count < 3) {
      setTimeout(() => {
        Voice.start('en-US');
        this.props.micColor('white');
        this.props.micStatus('testing');
      }, 1000);
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
    const {
      bestMatch: {target, rating},
    } = this.processNLU(this.props.answer, e.value);

    this.setState({
      speech: target.toLowerCase(),
    });

    if (rating >= 0.7) {
      //통과한 경우
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.removeEventListener('tts-finish', this.finishListener);
      Tts.stop();
      this.props.finish();
    } else {
      //말했는데 실패한 경우
      this.props.micColor('red');
      this.props.micStatus('wrong');
      Voice.destroy().then(Voice.removeAllListeners);
      setTimeout(() => {
        this.setState(
          {
            count: this.state.count + 1,
          },
          () => {
            if (this.state.count < 3) this.ttsSpeaking(this.props.answer);
            else {
              Tts.removeEventListener('tts-finish', this.finishListener);
              Tts.stop();
              this.props.finish();
            }
          },
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

  getTextStyle(word: string, index: number) {
    if (
      this.state.speech.indexOf(word.replace('.', '').trim().toLowerCase()) >
        -1 ||
      this.state.words[index] === true
    ) {
      words = [...words.slice(0, index), true, ...words.slice(index + 1)];
      if (this.state.speech.indexOf(word.trim().toLowerCase()) > -1) {
        //현재 맞췄다면
        return {
          color: '#6807f9',
          fontStyle: 'normal',
        };
      } else {
        return {
          //맞췄던 단어라면
          color: 'black',
          fontStyle: 'normal',
        };
      }
    } else {
      //틀린 단어
      if (this.state.count == 2) {
        //힌트
        return {
          fontStyle: 'italic',
          borderBottomColor: '#aaa',
          borderBottomWidth: 1,
          color: '#aaa',
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
  }

  render() {
    const styles = StyleSheet.create({
      view: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      text: {
        fontSize: 20,
        margin: 4,
      },
    });

    const {answer} = this.props;
    return (
      <View style={styles.view}>
        {answer.split(' ').map((word, i) => {
          return (
            <Text
              key={`word-${i}`}
              style={[styles.text, this.getTextStyle(word, i)]}>
              {word + ' '}
            </Text>
          );
        })}
      </View>
    );
  }
}

export default Compare;
