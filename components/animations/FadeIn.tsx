import React, {Component} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface Props {
  data: any;
  type: 'hasImg' | 'noImg';
  // fontSize: number;
  // color: string;
  // textAlign: 'center' | 'auto' | 'left' | 'right' | 'justify' | undefined;
}
interface State {
  fontSize: number;
  color: string;
  textAlign: 'center' | 'auto' | 'left' | 'right' | 'justify' | undefined;
}

let animation: Animated.Value | any;

class FadeIn extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    animation = new Animated.Value(0);
  }

  state: State = {
    fontSize: this.props.type === 'hasImg' ? 12 : 20,
    color: this.props.type === 'hasImg' ? 'white' : '#444',
    textAlign: this.props.type === 'hasImg' ? 'center' : 'left',
  };

  componentDidMount() {
    this.animationTiming();
  }

  animationTiming() {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  render() {
    let opacityStyle = {
      opacity: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    const styles = StyleSheet.create({
      text: {
        fontSize: this.state.fontSize,
        fontWeight: '300',
        textAlign: this.state.textAlign,
        color: this.state.color,
        lineHeight: this.state.fontSize + 8,
      },
    });

    return (
      <Animated.View style={opacityStyle}>
        <Animated.Text style={{...styles.text}}>
          {this.props.data}
        </Animated.Text>
      </Animated.View>
    );
  }
}

export default FadeIn;
