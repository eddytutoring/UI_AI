import React, {Component} from 'react';
import {
  Platform,
  Image,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import InstructionLabelEng from './InstructionLabelEng';
import InstructionLabelKor from './InstructionLabelKor';
import ScriptLabel from './ScriptLabel';
import MICButton from './MICButton';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

const tokenizer = new Tokenizer();

interface Props {
  obj: any;
  onPressHandler: any;
}
interface State {
  fontSize: number;
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
  isSttFinished: 'finished' | 'yet';
  stt: boolean;
  index: number;
  duration: number;
  unmount: boolean;
}

class AiScreen2 extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    Tts.setDefaultLanguage('en-US');
    // Tts.addEventListener('tts-finish', this.ttsCallback.bind(this));
  }

  state: State = {
    fontSize: 25,
    fontWeight: '300',
    isSttFinished: 'yet',
    stt: false,
    index: 0,
    duration: 700,
    unmount: false,
  };

  componentDidMount() {
    this.ttsSpeaking(this.props.obj[this.state.index].tts);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.index !== nextState.index ||
      this.state.isSttFinished !== nextState.isSttFinished ||
      this.state.stt !== nextState.stt
    );
  }

  componentWillUnmount() {
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
    console.log(this.state.index);
    console.log(this.props.obj.length - 1);
    if (!this.state.unmount) {
      if (this.state.index === 1) {
        //tts 먼저
        //stt기준으로 화면 전환
        // this.ttsSpeaking(this.props.obj[this.state.index].tts);
        setTimeout(() => {
          this.setState({
            stt: true,
          });
        }, 500);
        Voice.start('en-US');
      }
      // else if (this.props.obj[this.state.index].stt) {
      //   Voice.start('en-US');
      //   //stt 먼저 실행해야
      //   //stt 완료 이벤트 후 tts 나와야
      //   //englabel도 같이 늦게 나와야
      // }
      else {
        //tts기준으로 화면 전환
        if (this.state.index < this.props.obj.length - 1) {
          console.log(this.state.unmount);
          setTimeout(() => {
            this.setState({index: this.state.index + 1, stt: false}, () => {
              if (
                this.state.index === 1 ||
                !this.props.obj[this.state.index].stt
              )
                this.ttsSpeaking(this.props.obj[this.state.index].tts);
              else {
                // Voice.start('en-US');
                if (this.props.obj[this.state.index]) {
                  setTimeout(() => {
                    this.setState(
                      {
                        isSttFinished: 'yet',
                        stt: true,
                      },
                      () => {
                        Voice.start('en-US');
                      },
                    );
                  }, 1000);
                } else {
                  Voice.start('en-US');
                }
              }
            });
          }, 2000);
        } else {
          Tts.stop();
          console.log('completed the last page');
        }
      }
    }
  }

  // userSpeaking() {
  //   setTimeout(() => {
  //     // this.setState({
  //     //   isReady: true,
  //     // });
  //     Voice.start('en-US');
  //     Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  //     Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
  //   }, 800);
  // }

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
    const accuracy = this.processNLU(
      this.props.obj[this.state.index].stt,
      result.value,
    );

    const {
      bestMatch: {target, rating},
    } = accuracy;

    if (rating >= 0.75) {
      Voice.destroy().then(Voice.removeAllListeners);
      console.log('passed');

      if (this.state.index === 1) {
        setTimeout(() => {
          this.setState(
            {
              index: this.state.index + 1,
            },
            () => {
              this.ttsSpeaking(this.props.obj[this.state.index].tts);
            },
          );
        }, 2000);
      } else {
        setTimeout(() => {
          this.setState(
            {
              isSttFinished: 'finished',
            },
            () => {
              this.ttsSpeaking(this.props.obj[this.state.index].tts);
            },
          );
        }, 2000);
      }
    }
  }

  onSpeechEndHandler = (event: Object) => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
  };

  render() {
    {
      setTimeout(() => {
        this.setState({
          index: this.state.index + 1,
        });
      }, 5000);
    }
    const {obj} = this.props;
    return (
      <SafeAreaView style={styles.view}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState(
              {
                unmount: true,
              },
              this.props.onPressHandler,
            );
          }}>
          <Image
            style={styles.closeBtn}
            source={require('../resource/close.png')}
          />
        </TouchableWithoutFeedback>
        <View style={styles.contents}>
          {obj[this.state.index].ScriptLabel && (
            <View
              style={
                this.state.index !== 0 &&
                this.state.index !== this.props.obj.length - 1
                  ? styles.scriptView
                  : styles.scriptViewFirst
              }>
              {this.state.index !== 0 &&
              this.state.index !== this.props.obj.length - 1 ? null : (
                <Image
                  style={styles.chipImage}
                  source={require('../resource/chip.png')}
                />
              )}
              <ScriptLabel
                label={obj[this.state.index].ScriptLabel}
                fontSize={
                  this.state.index !== 0 &&
                  this.state.index !== this.props.obj.length - 1
                    ? this.state.fontSize
                    : 13
                }
                fontWeight={
                  this.state.index !== 0 &&
                  this.state.index !== this.props.obj.length - 1
                    ? this.state.fontWeight
                    : 'bold'
                }
                paddingHorizontal={
                  this.state.index !== 0 &&
                  this.state.index !== this.props.obj.length - 1
                    ? 0
                    : 20
                }
                alignment={
                  this.state.index !== 0 &&
                  this.state.index !== this.props.obj.length - 1
                    ? 'left'
                    : 'center'
                }
                duration={this.state.duration}
              />
            </View>
          )}
          {obj[this.state.index].InstructionLabelEng && (
            <View style={styles.engView}>
              <InstructionLabelEng
                label={
                  this.state.isSttFinished === 'finished'
                    ? `${obj[this.state.index].InstructionLabelEng}`
                    : this.state.index !== 1
                    ? ''
                    : `${obj[this.state.index].InstructionLabelEng}`
                }
                fontSize={this.state.fontSize}
                fontWeight={this.state.fontWeight}
                duration={this.state.duration}
              />
            </View>
          )}
          <View
            style={
              this.state.index !== 0 &&
              this.state.index !== this.props.obj.length - 1
                ? styles.korView
                : styles.korViewFirst
            }>
            {obj[this.state.index].InstructionLabelKor && (
              <InstructionLabelKor
                label={`${obj[this.state.index].InstructionLabelKor}`}
                fontSize={16}
                fontWeight={'bold'}
                accentFontColor={'#444'}
                alignment={
                  this.state.index !== 0 &&
                  this.state.index !== this.props.obj.length - 1
                    ? 'flex-start'
                    : 'center'
                }
                fontColor={'#888'}
                duration={this.state.duration}
              />
            )}
          </View>
          <View style={styles.micView}>
            {obj[this.state.index].stt && (
              <MICButton
                isReady={this.state.stt}
                isSttFinished={this.state.isSttFinished}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '90%',
    backgroundColor: '#fafafa',
  },
  scriptView: {
    flex: 1,
    justifyContent: 'center',
  },
  scriptViewFirst: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  engView: {
    flex: 1,
    justifyContent: 'center',
  },
  korView: {
    flex: 1,
    justifyContent: 'center',
  },
  korViewFirst: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  micView: {
    flex: 1,
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 40,
    height: 40,
    zIndex: 1,
  },
  contents: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  chipImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default AiScreen2;
