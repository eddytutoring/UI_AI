import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {}
interface State {
  diameter: number;
}
// const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

class MICButton extends Component<Props, State> {
  state: State = {
    diameter: 80,
  };

  // midColor = new Animated.Value(0);
  // lastColor = new Animated.Value(0);
  // Animated.parallel([
  //   Animated.timing(this.midColor,{

  //   })
  // ])
  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: this.state.diameter,
        width: this.state.diameter,
        borderRadius: 64,
        // backgroundColor: '#342ead',
        shadowColor: '#1c0fff',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
    });
    return (
      <View style={styles.view}>
        <LinearGradient
          start={{x: 0.0, y: 0.25}}
          end={{x: 0.5, y: 1.0}}
          locations={[0, 0.6]}
          useAngle={true}
          angle={45}
          angleCenter={{x: 0.5, y: 0.5}}
          colors={['#e66465', '#9198e5']}
          style={styles.button}>
          <Text style={{color: 'white'}}>hey</Text>
        </LinearGradient>
      </View>
    );
  }
}

export default MICButton;
