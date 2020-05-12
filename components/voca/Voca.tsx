import React, {Component} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import FadeToLeft from '../animations/FadeToLeft';
import FadeToTop from '../animations/FadeToTop';
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

const tokenizer = new Tokenizer();

interface Props {
  data: any;
  micStatus: any;
  micColor: any;
  goNextPage: any;
}
interface State {
  passed: boolean;
}

class Voca extends Component<Props, State> {
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
    this.ttsSpeaking(this.props.data.v_en.replace('~', ''));
    this.props.micStatus('testing');
    this.props.micColor('colored');
  }

  componentWillUnmount() {
    Tts.removeEventListener('tts-finish', this.finishListener);
    Tts.stop();
    Voice.destroy().then(Voice.removeAllListeners);
    console.log('unmount');
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
    setTimeout(() => {
      Voice.start('en-US');
      this.props.micColor('white');
      this.props.micStatus('testing');
    }, 1000);
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
    const accuracy = this.processNLU(this.props.data.v_en, e.value);

    const {
      bestMatch: {target, rating},
    } = accuracy;

    if (rating >= 0.7) {
      //통과한 경우
      Voice.destroy().then(Voice.removeAllListeners); //voice 자원 해제
      console.log('passed');
      this.setState({
        passed: true,
      });
      this.props.micColor('colored');
      this.props.micStatus('correct');
      setTimeout(() => {
        this.props.goNextPage(true);
      }, 2000);
    } else {
      //말했는데 실패한 경우
      Voice.stop();
      this.ttsSpeaking('speak it up again.');
      this.props.micColor('red');
      this.props.micStatus('wrong');
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
    const {data} = this.props;

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
        <FadeToLeft data={data.v_en} color={'black'} />
        <FadeToTop
          data={data.v_ko}
          color={'#444'}
          accentColor={'#444'}
          fontSize={20}
          textAlign={'flex-start'}
        />
        {/* mic */}
      </View>
    );
  }
}

export default Voca;
