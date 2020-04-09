import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {}
interface State {
  diameter: number;
}
// const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

class MICButton extends Component<Props, State> {
  state: State = {
    diameter: 90,
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
        justifyContent: 'space-between',
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
        backgroundColor: 'transparent',
      },
    });
    return (
      <View style={styles.view}>
        <View style={styles.shadow}>
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 1.0, y: 1.0}}
            locations={[0.1, 0.7]}
            useAngle={true}
            angle={135}
            angleCenter={{x: 0.5, y: 0.5}}
            colors={['#e66465', '#9198e5']}
            // colors={['#fff']}
            style={styles.button}>
            {/* <Text style={{color: 'white', backgroundColor: 'transparent'}}>
              hey
            </Text> */}
            <Image
              source={require('./sources/mic.png')}
              style={{width: 20, height: 40}}></Image>
          </LinearGradient>
        </View>
      </View>
    );
  }
}

export default MICButton;
