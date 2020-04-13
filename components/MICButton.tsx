import React, {Component} from 'react';
import {StyleSheet, View, Image, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';
import Tts from 'react-native-tts';

interface Props {
  tts: string;
}
interface State {
  diameter: number;
  isReady: boolean;
  isTtsFinished: boolean;
}

class MICButton extends Component<Props, State> {
  state: State = {
    diameter: 90,
    isReady: false,
    isTtsFinished: false,
  };

  constructor(props: Props) {
    super(props);
    Tts.setDefaultLanguage('en-IE');
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isReady: true,
      });
      Tts.speak(
        this.props.tts,
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
    }, 2000);
    Tts.addEventListener('tts-finish', () => {
      this.setState({isReady: false, isTtsFinished: true});
    });
  }

  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: this.state.diameter,
        width: this.state.diameter,
        borderRadius: 100,
      },
      shadow: {
        shadowColor: '#1a0fff',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    });
    return (
      <View style={styles.view}>
        <RadialGradient
          colors={['#1a0fff', '#fafafa']}
          stops={[0, 0.4]}
          center={[60, 60]}
          radius={110}
          style={{
            height: 120,
            width: 120,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 1.0, y: 1.0}}
            locations={[0.1, 0.7]}
            useAngle={true}
            angle={135}
            angleCenter={{x: 0.5, y: 0.5}}
            colors={
              this.state.isReady ? ['#fff', '#fff'] : ['#e66465', '#9198e5']
            }
            style={styles.button}>
            <Image
              source={
                this.state.isTtsFinished
                  ? require('../resource/clear.png')
                  : require('../resource/mic.png')
              }
              style={
                this.state.isTtsFinished
                  ? {width: 40, height: 35}
                  : {width: 20, height: 40}
              }
            />
          </LinearGradient>
        </RadialGradient>
      </View>
    );
  }
}

export default MICButton;
