import React, {Component} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';
import passedImg from '../../resource/clearImg.png';
import testImg from '../../resource/mic.png';
import closeImg from '../../resource/close.png';

interface Props {
  status: 'wrong' | 'correct' | 'hide' | 'testing';
  color: 'colored' | 'white' | 'red';
}
interface State {
  diameter: number;
  colors: Array<string>;
}

class MIC extends Component<Props, State> {
  state: State = {
    diameter: 80,
    colors:
      this.props.color === 'white'
        ? ['#fff', '#fff']
        : this.props.color === 'colored'
        ? ['#e66465', '#9198e5']
        : ['#fa744f', '#fa744f'],
  };

  render() {
    const styles = StyleSheet.create({
      view: {
        alignItems: 'center',
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
    });

    return (
      <View style={styles.view}>
        {this.props.status === 'hide' ? (
          <RadialGradient radius={100} center={[60, 55]} />
        ) : (
          <RadialGradient
            colors={['#1a0fff', '#fafafa']}
            stops={[0, 0.4]}
            center={[50, 55]}
            radius={100}
            style={{
              height: 100,
              width: 100,
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
              colors={this.state.colors}
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
          </RadialGradient>
        )}
        <Text style={styles.text}>
          {this.props.status === 'correct'
            ? '잘했어요!'
            : this.props.status === 'wrong'
            ? '다시 말해보세요.'
            : ' '}
        </Text>
      </View>
    );
  }
}

export default MIC;
