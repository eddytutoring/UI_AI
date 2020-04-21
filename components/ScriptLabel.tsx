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
  paddingHorizontal: number;
  alignment: 'center' | 'left';
  duration: number;
}
interface State {}

class ScriptLable extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.opacity = new Animated.Value(0);
  }

  opacity: Animated.Value | any;

  componentDidMount() {
    this.animationTiming();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    this.opacity = new Animated.Value(0);
    this.animationTiming();
    return this.props.label !== nextProps.label;
  }

  replaceAll(str: string, search: string | any, replace: string | any) {
    return str.split(search).join(replace);
  }

  animationTiming() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: this.props.duration,
      useNativeDriver: false,
    }).start();
  }

  render() {
    let color = this.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#444'],
    });

    const styles = StyleSheet.create({
      view: {
        paddingHorizontal: this.props.paddingHorizontal,
      },
      text: {
        fontSize: this.props.fontSize,
        fontWeight: this.props.fontWeight,
        textAlign: this.props.alignment,
      },
    });

    return (
      <Animated.View style={[styles.view]}>
        <Animated.Text style={{...styles.text, color: color}}>
          {this.replaceAll(this.props.label, '/', '"')}
        </Animated.Text>
      </Animated.View>
    );
  }
}

export default ScriptLable;
