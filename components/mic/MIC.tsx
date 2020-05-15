import React, {Component, Fragment} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';
import passedImg from '../../resource/passed.png';
import testImg from '../../resource/mic.png';
import closeImg from '../../resource/close.png';

interface Props {
  status: 'wrong' | 'correct' | 'hide' | 'testing';
  color: 'colored' | 'white' | 'red';
  vol1: boolean;
  vol2: boolean;
}
interface State {
  diameter: number;
}

class MIC extends Component<Props, State> {
  state: State = {
    diameter: 80,
  };

  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
      },
      micImg: {
        alignItems: 'center',
        justifyContent: 'center',
        height: this.state.diameter,
        width: this.state.diameter,
        borderRadius: 100,
      },
      text: {
        color: '#888',
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 0.7,
      },
      vol1: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor:
          this.props.vol1 || this.props.vol2 ? '#1a0fff30' : 'transparent',
        width: this.props.vol1
          ? this.state.diameter * 1.1
          : this.props.vol2
          ? this.state.diameter * 1.3
          : 100,
        height: this.props.vol1
          ? this.state.diameter * 1.1
          : this.props.vol2
          ? this.state.diameter * 1.3
          : 100,
      },
      vol2: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor:
          this.props.vol1 || this.props.vol2 ? '#1a0fff10' : 'transparent',
        width: this.props.vol1
          ? this.state.diameter * 1.3
          : this.props.vol2
          ? this.state.diameter * 1.5
          : 100,
        height: this.props.vol1
          ? this.state.diameter * 1.3
          : this.props.vol2
          ? this.state.diameter * 1.5
          : 100,
      },
      // volume: {
      //   position: 'absolute',
      //   flex: 1,
      //   alignItems: 'center',
      //   justifyContent: 'center',
      //   height: this.state.diameter + 100,
      //   width: this.state.diameter,
      // },
    });

    return (
      <View style={styles.view}>
        {this.props.status === 'hide' ? (
          <RadialGradient radius={100} center={[60, 55]} />
        ) : (
          <RadialGradient
            colors={['#1a0fff', 'transparent']}
            stops={[0, 0.4]}
            center={[50, 103]}
            radius={100}
            style={{
              flex: 1,
              width: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.vol2}>
              <View style={styles.vol1}>
                <LinearGradient
                  start={{x: 0.0, y: 0.0}}
                  end={{x: 1.0, y: 1.0}}
                  locations={[0.1, 0.7]}
                  useAngle={true}
                  angle={135}
                  angleCenter={{x: 0.5, y: 0.05}}
                  colors={
                    this.props.color === 'white'
                      ? ['#fff', '#fff']
                      : this.props.color === 'colored'
                      ? ['#e66465', '#9198e5']
                      : ['#fa744f', '#fa744f']
                  }
                  style={styles.micImg}>
                  <Image
                    source={
                      this.props.status == 'correct'
                        ? passedImg
                        : this.props.status === 'testing'
                        ? testImg
                        : closeImg
                    }
                    style={
                      this.props.status === 'correct' ||
                      this.props.status === 'wrong'
                        ? {width: 40, height: 35}
                        : {width: 20, height: 40}
                    }
                  />
                </LinearGradient>
              </View>
            </View>
            <Text style={styles.text}>
              {this.props.status === 'correct'
                ? '잘했어요!'
                : this.props.status === 'wrong'
                ? '다시 말해보세요.'
                : ' '}
            </Text>
          </RadialGradient>
        )}
      </View>
    );
  }
}

export default MIC;
