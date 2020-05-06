import React, {Component, Fragment} from 'react';
import {Platform, View, Text, StyleSheet} from 'react-native';
import FadeToLeft from '../animations/FadeToLeft';
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

const tokenizer = new Tokenizer();

interface Props {
  answer: string;
}
interface State {
  passed: boolean;
}

class Compare extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.finishListener = this.ttsCallback.bind(this);
    Tts.setDefaultLanguage('en-US');
    Tts.addEventListener('tts-finish', this.finishListener);
    Tts.addEventListener('tts-cancel', this.cancelListener);
    Voice.onSpeechResults = this._debounce(
      this.onSpeechResultsHandler.bind(this),
      500,
    );
    if (Platform.OS === 'ios') Tts.setIgnoreSilentSwitch(false);
  }

  state: State = {
    passed: false,
  };

  finishListener: any;
  cancelListener: any;

  componentDidMount() {
    console.log('compare');
    this.ttsSpeaking('Speak it up again.');
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
    if (!this.state.passed) {
      Voice.start('en-US');
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
    console.log(e.value);

    const {
      bestMatch: {target, rating},
    } = this.processNLU(this.props.answer, e.value);

    if (rating >= 0.7) {
      //통과한 경우
      Voice.destroy().then(Voice.removeAllListeners); //voice 자원 해제
      console.log('passed');
      this.setState({
        passed: true,
      });
    } else {
      //말했는데 실패한 경우
      Voice.stop();
      // Voice.start('en-US'); //다시 듣기
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

  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 30,
        marginRight: 10,
      },
      text: {
        fontSize: 20,
        fontStyle: 'italic',
        color: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
      },
    });

    const {answer} = this.props;
    return (
      <View style={styles.view}>
        {answer.split(' ').map((word) => {
          return (
            <>
              <Text style={styles.text}>{word}</Text>
              <Text style={{fontSize: 20}}> </Text>
            </>
          );
        })}
      </View>
    );
  }
}

export default Compare;
