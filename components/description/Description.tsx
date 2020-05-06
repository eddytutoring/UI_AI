import React, {Component} from 'react';
import {Image, View, StyleSheet, Platform} from 'react-native';
import chipImg from '../../resource/chip.png';
import FadeIn from '../animations/FadeIn';
import Tts from 'react-native-tts';

interface Props {
  data: any;
}

interface State {}

class Description2 extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.finishListener = this.ttsCallback.bind(this);
    Tts.setDefaultLanguage('en-US');
    Tts.addEventListener('tts-finish', this.finishListener);
    Tts.addEventListener('tts-cancel', this.cancelListener);
  }

  finishListener: any;
  cancelListener: any;

  componentDidMount() {
    this.ttsSpeaking(this.props.data.d_ko);
  }

  componentWillUnmount() {
    Tts.removeEventListener('tts-finish', this.finishListener);
    Tts.stop();
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
  }

  getStyle() {
    if (this.props.data.d_img) {
      //이미지가 있다
      return {color: 'white', fontSize: 15, textAlign: 'center'};
    } else {
      //이미지가 없다
      return {color: 'black', fontSize: 20, textAlign: 'left'};
    }
  }

  render() {
    const {data} = this.props;

    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        alignItems: this.props.data.d_img ? 'center' : 'flex-start',
        backgroundColor: this.props.data.d_img ? '#be79df' : 'white',
      },
      img: {
        width: 100,
        height: 100,
        marginBottom: 20,
      },
    });

    return (
      <View style={styles.view}>
        {data.d_img && <Image source={chipImg} style={styles.img} />}
        <FadeIn data={data.d_ko} {...this.getStyle()} />
        {/* mic */}
      </View>
    );
  }
}

export default Description2;
