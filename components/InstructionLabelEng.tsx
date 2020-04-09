import React, {Component} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface Props {
  label: string;
  fontSize: number;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
}
interface State {
  duration: number;
}

class instructionLabelEng extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.opacity = [];
    this.textArr = this.props.label.trim().split(' ');
    this.textArr.forEach((text, i) => {
      this.opacity[i] = new Animated.Value(0);
    });
  }

  state: State = {
    duration: 800,
  };

  opacity: any;
  textArr: Array<string>;

  componentDidMount() {
    this.animated();
  }

  animated = (toValue = 1) => {
    const animations = this.textArr.map((word, i) => {
      return Animated.timing(this.opacity[i], {
        toValue,
        duration: this.state.duration,
      });
    });

    Animated.stagger(this.state.duration / 1.5, animations).start();
  };

  render() {
    const styles = StyleSheet.create({
      view: {
        // flex: 1,
        justifyContent: 'center',
      },
      text: {
        fontSize: this.props.fontSize,
        fontWeight: this.props.fontWeight,
      },
      textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      },
    });

    return (
      <Animated.View style={[styles.view, styles.textWrapper]}>
        {this.textArr.map((word, i) => {
          return (
            <Animated.Text
              key={`${word}-${i}`}
              style={[
                styles.text,
                {
                  opacity: this.opacity[i],
                  color: this.opacity[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', '#444'],
                  }),
                  transform: [
                    {
                      translateX: this.opacity[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}>
              {word}
              {`${i < this.textArr.length ? ' ' : ''}`}
            </Animated.Text>
          );
        })}
      </Animated.View>
    );
  }
}

export default instructionLabelEng;
