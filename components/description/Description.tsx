import React, {Component} from 'react';
import {Image, View, StyleSheet, Platform} from 'react-native';
import chipImg from '../../resource/chip.png';
import FadeIn from '../animations/FadeIn';
import Tts from 'react-native-tts';
import FadeToTop from '../animations/FadeToTop';

interface Props {
  data: any;
  goNextPage: any;
}

interface State {}

class Description extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.finishListener = this.ttsCallback.bind(this);
    Tts.setDefaultLanguage('en-US');
    Tts.addEventListener('tts-finish', this.finishListener);
    Tts.addEventListener('tts-cancel', this.cancelListener);
    console.log('mount');
  }

  finishListener: any;
  cancelListener: any;

  componentDidMount() {
    this.ttsSpeaking(this.props.data.d_en);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.props.data !== nextProps.data;
  }

  // componentDidUpdate() {
  //   console.log('update');
  //   this.ttsSpeaking(this.props.data.d_en);
  // }

  componentWillUnmount() {
    Tts.removeEventListener('tts-finish', this.finishListener);
    console.log('unmount');
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
    setTimeout(() => {
      this.props.goNextPage(true);
    }, 2000);
  }

  removeBrackets(str: string) {
    str = str.split('{').join('');
    return str.split('}').join('');
  }

  replaceAll(str: string, search: string | any, replace: string | any) {
    return str.split(search).join(replace);
  }

  getEnStyle() {
    if (this.props.data.d_img) {
      //이미지가 있다
      return {color: 'white', fontSize: 12, textAlign: 'center'};
    } else {
      //이미지가 없다
      return {color: 'black', fontSize: 20, textAlign: 'left'};
    }
  }

  getKoStyle() {
    if (this.props.data.d_img) {
      return {
        color: 'white',
        accentColor: 'white',
        fontSize: 16,
        textAlign: 'center',
      };
    } else {
      return {
        color: 'black',
        accentColor: '#888',
        fontSize: 20,
        textAlign: 'flex-start',
      };
    }
  }

  render() {
    const {data} = this.props;
    data.d_ko = this.removeBrackets(data.d_ko);
    data.d_en = this.removeBrackets(data.d_en);

    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'space-around',
        padding: 30,
        alignItems: this.props.data.d_img ? 'center' : 'flex-start',
        backgroundColor: this.props.data.d_img ? '#be79df' : 'white',
      },
      img: {
        width: 80,
        height: 80,
        marginBottom: 20,
      },
    });

    return (
      <>
        <View style={styles.view}>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              width: '85%',
            }}>
            {data.d_img && <Image source={chipImg} style={styles.img} />}
            <FadeIn data={data.d_en} {...this.getEnStyle()} />
          </View>
          <View style={{flex: 1, justifyContent: 'flex-start'}}>
            <FadeToTop data={data.d_ko} {...this.getKoStyle()} />
          </View>
        </View>
      </>
    );
  }
}

export default Description;
