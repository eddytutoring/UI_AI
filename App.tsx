import React, {Component} from 'react';
import ScriptLabel from './components/ScriptLable';
import InstructionLabelEng from './components/InstructionLabelEng';
import InstructionLabelKor from './components/InstructionLabelKor';
import MICButton from './components/MICButton2';
import InputField from './components/Input';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

import {StyleSheet, View, Platform, SafeAreaView} from 'react-native';

const tokenizer = new Tokenizer();

interface Props {}
interface State {
  fontSize: number;
  alignment: 'center' | 'flex-start' | undefined;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
  activeLabelFontSize: number;
  labelFontSize: number;
  padding: number;
  isReady: boolean;
  isTtsFinished: boolean;
  stt: string;
  tts: string;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    Tts.setDefaultLanguage('en-US');
  }

  state: State = {
    fontSize: 25,
    alignment: 'flex-start',
    fontWeight: '300',
    activeLabelFontSize: 12,
    labelFontSize: 16,
    padding: 30,
    isReady: false,
    isTtsFinished: false,
    stt: 'yet',
    tts: "Let's start!",
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
      });
      Voice.start('en-US');
      Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
      Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    }, 500);
  }

  processNLU(answerSentence: string, candidateList: string[]) {
    const answerWord = tokenizer
      .tokenize(answerSentence.toLowerCase().replace('!', ''))
      .filter((token: any) => token.tag === 'word' || token.tag === 'number')
      .map((token: any) => token.value)
      .join('');

    return similarity.findBestMatch(answerWord, [
      ...candidateList.map((sentence) =>
        sentence.toLowerCase().replace('!', ''),
      ),
    ]);
  }

  onSpeechResultsHandler(result: Object | any) {
    console.log(result.value);
    const accuracy = this.processNLU(this.state.tts, result.value);
    const {
      bestMatch: {target, rating},
    } = accuracy;

    console.log(rating);

    if (rating >= 0.6) {
      Voice.destroy().then(Voice.removeAllListeners);
      this.setState({
        isReady: false,
        isTtsFinished: true,
      });
      setTimeout(() => {
        this.ttsSpeaking();
        this.setState({
          stt: 'passed',
        });
      }, 3000);
    }
  }

  onSpeechEndHandler = (event: Object) => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.start('en-US');
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
  };

  ttsSpeaking() {
    Tts.speak(
      this.state.tts,
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

    Tts.addEventListener('tts-finish', () => {
      this.setState({isReady: false, isTtsFinished: true});
    });
  }

  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 30,
        backgroundColor: '#fafafa',
      },
      scripts: {
        flex: 1,
        justifyContent: 'center',
      },
      button: {
        backgroundColor: '#bbc4f1',
        color: Platform.OS === 'ios' ? '#841584' : '#000',
      },
      input: {
        flex: 2,
        justifyContent: 'flex-end',
      },
    });

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.view}>
          {/* <View style={styles.input}>
          <InputField
            label="이메일 또는 아이디"
            activeLabelFontSize={this.state.activeLabelFontSize}
            labelFontSize={this.state.labelFontSize}
            padding={this.state.padding}
            secure={false}
          />
          <InputField
            label="비밀번호"
            activeLabelFontSize={this.state.activeLabelFontSize}
            labelFontSize={this.state.labelFontSize}
            padding={this.state.padding}
            secure={true}
          />
        </View> */}

          <View style={styles.scripts}>
            {/* <InstructionLabelEng
            label="Let's start!"
            fontSize={this.state.fontSize}
            fontWeight={this.state.fontWeight}
          /> */}

            {this.state.stt === 'yet' ? (
              <ScriptLabel
                label={this.state.tts}
                fontSize={this.state.fontSize}
                fontWeight={this.state.fontWeight}
              />
            ) : (
              <InstructionLabelEng
                label={this.state.tts}
                fontSize={this.state.fontSize}
                fontWeight={this.state.fontWeight}
              />
            )}
          </View>
          <InstructionLabelKor
            label='"Let&apos;s start!"를 외치며 시작해봐요!'
            fontSize={17}
            fontWeight={'bold'}
            accentFontColor={'#444'}
            alignment={this.state.alignment}
            fontColor={'#888'}
          />
          <MICButton
            isReady={this.state.isReady}
            isTtsFinished={this.state.isTtsFinished}
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default App;
