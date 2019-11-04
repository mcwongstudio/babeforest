/*
 * @Author: RidingWind
 * @Info: 弱提示框
 * @Date: 2018-11-18 14:34:39
 * @Last Modified by: 绩牛金融 - RidingWind
 * @Last Modified time: 2018-11-18 17:12:26
*/

// 用法
// import TOAST from '../../utils/toast';
// 1、TOAST.show('<div>。。。</div>');
// 2、TOAST.show('<div>。。。</div>', option);
// 3、TOAST.show(text));
// 4、TOAST.show(text, option);
//  其中option为对象可变属性有 fadeIn、delay、top、padding

const TOAST = {
  show(text, option) {
    const child = document.getElementById('toast-div-jiniu');
    if (child) {
      document.body.removeChild(child);
    }

    const dom = document.createElement('div');
    dom.id = 'toast-div-jiniu';
    document.body.appendChild(dom);
    const toast = document.getElementById('toast-div-jiniu');

    toast.style.maxWidth = '90%';
    toast.style.display = 'none';
    toast.style.position = 'fixed';
    toast.style.left = '50%';
    toast.style.lineHeight = 1.4;
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    toast.style.color = '#F0F0F0';
    toast.style.fontSize = '14px';
    toast.style.boxSizing = 'border-box';
    toast.style.textAlign = 'center';
    toast.style.borderRadius = '5px';
    toast.style.wordWrap = 'break-word';
    toast.style.wordBreak = 'normal';
    toast.style.zIndex = 1000000;

    const mOption = option || {};
    const fadeIn = mOption.fadeIn || 800;
    const delay = mOption.delay || 1500;
    const fadeOut = mOption.fadeOut || 800;
    const top = mOption.top || '30%';
    const padding = mOption.padding || '8px 20px 8px 20px';

    toast.style.top = top;
    toast.style.padding = padding;

    if (text) {
      toast.innerHTML = text;

      let opacity = 0; // 透明度
      const speed = 10; // 速度
      // 淡入淡出
      const fadeInNum = +(fadeIn / speed).toFixed(0);
      const delayNum = +(delay / speed).toFixed(0);
      const fadeOutNum = +(fadeOut / speed).toFixed(0);

      const allNum = fadeInNum + delayNum + fadeOutNum;
      toast.style.display = 'block';
      toast.style.opacity = opacity;
      const fadeInfunc = (i) => {
        setTimeout(() => {
          if (i < fadeInNum) {
            opacity += (1 / fadeInNum);
          } else if (
            (i >= fadeInNum) &&
            (i < (fadeInNum + delayNum))
          ) {
            opacity = 1;
          } else if (
            (i < (allNum - 1)) &&
            (i >= (fadeInNum + delayNum))
          ) {
            opacity -= (1 / fadeOutNum);
          } else {
            opacity = 0;
            toast.style.display = 'none';
          }

          toast.style.opacity = opacity;
        }, i * speed);
      };

      for (let i = 0; i < allNum; i += 1) {
        fadeInfunc(i);
      }
    }
  },
};

export default TOAST;
