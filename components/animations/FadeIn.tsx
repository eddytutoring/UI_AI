import React, {Component} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface Props {
  data: any;
  fontSize: number;
  color: string;
  textAlign: 'center' | 'auto' | 'left' | 'right' | 'justify' | undefined;
}
interface State {}

let animation: Animated.Value | any;

class FadeIn extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    animation = new Animated.Value(0);
  }

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
        fontSize: this.props.fontSize,
        fontWeight: '300',
        textAlign: this.props.textAlign,
        color: this.props.color,
        lineHeight: this.props.fontSize + 8,
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
