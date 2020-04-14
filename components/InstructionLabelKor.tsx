import React, {Component} from 'react';
import {Animated, Text, StyleSheet, View} from 'react-native';

interface Props {
  label: string;
  fontSize: number;
  accentFontColor: string;
  fontColor: string;
  alignment: 'center' | 'flex-start' | undefined;
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
interface State {}

class instructionLabelKor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.opacity = new Animated.Value(0);
    this.textArr = this.props.label.trim().split('"');
  }

  opacity: Animated.Value | any;
  textArr: Array<string>;

  componentDidMount() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        transform: [
          {
            translateY: this.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      },
      text: {
        fontSize: this.props.fontSize,
        lineHeight: this.props.fontSize,
        fontWeight: this.props.fontWeight,
        paddingVertical: 4,
      },
      textWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: this.props.alignment,
      },
    });

    return (
      <Animated.View style={[styles.view, styles.textWrapper]}>
        {this.textArr.map((word, i) => {
          <Animated.Text
            key={`${word}-${i}`}
            style={{
              ...styles.text,
              color: this.props.accentFontColor,
            }}>
            {i % 2 === 1 && word !== '' ? '"' : ''}
          </Animated.Text>;
          {
            word.split('').map((word2, a) => {
              return (
                <Animated.Text
                  key={`${word2}-${a}`}
                  style={{
                    ...styles.text,
                    color:
                      i % 2 ? this.props.accentFontColor : this.props.fontColor,
                  }}>
                  {word2}
                </Animated.Text>
              );
            });
          }
          <Animated.Text
            key={`blank-${i}`}
            style={{
              ...styles.text,
              color: this.props.accentFontColor,
            }}>
            {i % 2 === 1 && word !== '' ? '"' : ''}
          </Animated.Text>;
        })}
      </Animated.View>
    );
  }
}

export default instructionLabelKor;
