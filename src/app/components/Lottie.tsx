import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../public/flow-1.json'; // public 폴더의 json 파일 경로

export default function LottieAnimation() {
    const defaultOptions = {
      loop: false,
      autoplay: false,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
  
    return (
      <div>
        <Lottie 
          options={defaultOptions}
        />
      </div>
    );
  }