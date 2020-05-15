import React, {Component} from 'react';
import {Image, View, StyleSheet, Platform} from 'react-native';
import chipImg from '../../resource/chip.png';
import FadeIn from '../animations/FadeIn';
import FadeToTop from '../animations/FadeToTop';
import Tts from '../sounds/Tts';

interface Props {
  data: any;
  goNextPage(stat: boolean): void;
}

interface State {}

class Description extends Component<Props, State> {
  tts: any;

  componentDidMount() {
    this.tts.ttsSpeaking(this.props.data.d_en);
  }

  removeBrackets(str: string) {
    str = str.split('{').join('');
    return str.split('}').join('');
  }

  replaceAll(str: string, search: string | any, replace: string | any) {
    return str.split(search).join(replace);
  }

  render() {
    const {data} = this.props;
    data.d_ko = this.removeBrackets(data.d_ko);
    data.d_en = this.removeBrackets(data.d_en);

    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'space-around',
        padding: 30,
        alignItems: this.props.data.d_img ? 'center' : 'flex-start',
        backgroundColor: this.props.data.d_img ? '#be79df' : 'white',
      },
      img: {
        width: 80,
        height: 80,
        marginBottom: 20,
      },
    });

    return (
      <View style={styles.view}>
        <Tts
          ref={(ref) => (this.tts = ref)}
          type={'D'}
          goNextPage={this.props.goNextPage}
        />
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            width: '85%',
          }}>
          {data.d_img && <Image source={chipImg} style={styles.img} />}
          <FadeIn data={data.d_en} type={data.d_img ? 'hasImg' : 'noImg'} />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <FadeToTop data={data.d_ko} type={data.d_img ? 'desImg' : 'des'} />
        </View>
      </View>
    );
  }
}

export default Description;
