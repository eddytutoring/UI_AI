import React, {Component} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface Props {
  data: any;
}
interface State {}

let animation: Array<Animated.Value> | any;
let words: Array<string>;

class FadeToLeft extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    animation = [];
    this.animationTiming(this.props.data);
    console.log(props.data);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    this.animationTiming(nextProps.data);
    return this.props.data !== nextProps.data;
  }

  // componentWillUnmount() {
  //   console.log('unmounted');
  // }

  animationTiming(sentence: string) {
    words = sentence.split(' ');
    words.forEach((_, i) => {
      animation[i] = new Animated.Value(0);
    });
    const animations = words.map((_, i) => {
      return Animated.timing(animation[i], {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      });
    });
    Animated.stagger(700 / 1.5, animations).start();
  }

  render() {
    const styles = StyleSheet.create({
      text: {
        fontSize: 20,
        fontWeight: '300',
      },
      textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      },
    });

    let textStyle = (i: number) => ({
      opacity: animation[i],
      color: animation[i].interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', '#444'],
      }),
      transform: [
        {
          translateX: animation[i].interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
      ],
    });

    return (
      <Animated.View style={[styles.textWrapper]}>
        {words.map((word, i) => {
          return (
            <Animated.Text
              key={`word-${i}`}
              style={[styles.text, textStyle(i)]}>
              {word}
              {i < words.length ? ' ' : ''}
            </Animated.Text>
          );
        })}
      </Animated.View>
    );
  }
}

export default FadeToLeft;
