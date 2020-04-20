import React, {Component} from 'react';
import {Platform, Text, SafeAreaView, StyleSheet} from 'react-native';
import InstructionLabelEng from './InstructionLabelEng';
import InstructionLabelKor from './InstructionLabelKor';
import ScriptLabel from './ScriptLable';
import MICButton from './MICButton';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import similarity from 'string-similarity';
import Tokenizer from 'wink-tokenizer';

const tokenizer = new Tokenizer();

interface Props {
  obj: any;
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
  count: number;
  isTtsFinished: boolean;
  stt: string;
  isReady: boolean;
  index: number;
  duration: number;
}

class AiScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    Tts.setDefaultLanguage('en-US');
    Tts.addEventListener('tts-finish', this.ttsCallback.bind(this));
  }

  state: State = {
    fontSize: 25,
    fontWeight: '300',
    count: 0,
    isTtsFinished: false,
    stt: 'yet',
    isReady: false,
    index: 0,
    duration: 700,
  };
  index = 0;

  componentDidMount() {
    this.ttsSpeaking(this.props.obj[this.index].tts);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.state.index !== nextState.index;
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
    console.log('fin');
    console.log(this.state.index);
    console.log(this.props.obj.length - 1);
    if (this.state.index < this.props.obj.length - 1) {
      setTimeout(() => {
        this.setState({index: this.state.index + 1});
        this.ttsSpeaking(this.props.obj[this.state.index].tts);
      }, 2000);
    } else {
      console.log('completed the last page');
    }
  }

  render() {
    // {
    //   if (this.state.index < this.props.obj.length - 1) {
    //     setTimeout(() => {
    //       this.setState({
    //         index: this.state.index + 1,
    //       });
    //     }, 5000);
    //   }
    // }
    const {obj} = this.props;
    return (
      <SafeAreaView style={styles.view}>
        {obj[this.state.index].ScriptLabel && (
          <ScriptLabel
            label={obj[this.state.index].ScriptLabel}
            fontSize={this.state.fontSize}
            fontWeight={this.state.fontWeight}
          />
        )}
        {obj[this.state.index].InstructionLabelEng && (
          <InstructionLabelEng
            label={`${obj[this.state.index].InstructionLabelEng}`}
            fontSize={this.state.fontSize}
            fontWeight={this.state.fontWeight}
            duration={this.state.duration}
          />
        )}

        {obj[this.state.index].InstructionLabelKor && (
          <InstructionLabelKor
            label={`${obj[this.state.index].InstructionLabelKor}`}
            fontSize={17}
            fontWeight={'bold'}
            accentFontColor={'#444'}
            alignment="flex-start"
            fontColor={'#888'}
            duration={this.state.duration}
          />
        )}
        {/* {console.log(obj[this.state.index].InstructionLabelKor)}
        {console.log(this.state.index)} */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
  },
});

export default AiScreen;
