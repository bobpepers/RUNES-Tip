import sharp from 'sharp';
import svgCaptcha from "svg-captcha";
import { AlgebraicCaptcha } from "algebraic-captcha";

const backgroundArray = [
  '#cc9966',
  '#ffffff',
  "#FF5733",
  "#33FFE6",
  "#272F92 ",
  "#882792",
  "#922759",
];
const captchaTypeArray = [
  'svg',
  'algebraic',
];

export const generateCaptcha = async () => {
  let captcha;
  let captchaImage;
  let captchaText;
  let captchaType;
  const randomFunc = captchaTypeArray[Math.floor(Math.random() * captchaTypeArray.length)];
  const randomBackground = backgroundArray[Math.floor(Math.random() * backgroundArray.length)];

  if (randomFunc === 'svg') {
    while (!captcha || Number(captcha.text) < 0) {
      captcha = svgCaptcha.createMathExpr({
        mathMin: 0,
        mathMax: 9,
        mathOperator: '+-',
        background: randomBackground,
        noise: 15,
        color: true,
      });
    }

    captchaType = 'svg';
    captchaText = captcha.text;
    captchaImage = await sharp(Buffer.from(`${captcha.data}`.trim()))
      .resize(450, 150)
      .png()
      .toBuffer();
  }
  if (randomFunc === 'algebraic') {
    const modes = [
      'formula',
      'equation',
    ];

    while (!captcha || Number(captcha.answer) < 0) {
      const preCaptcha = new AlgebraicCaptcha({
        width: 150,
        height: 50,
        background: randomBackground,
        noise: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
        minValue: 1,
        maxValue: 9,
        operandAmount: Math.floor((Math.random() * 2) + 1),
        operandTypes: ['+', '-'],
        mode: modes[Math.round(Math.random())],
        targetSymbol: '?',
      });
      // eslint-disable-next-line no-await-in-loop
      captcha = await preCaptcha.generateCaptcha();
    }

    captchaType = 'algebraic';
    captchaText = captcha.answer.toString();
    captchaImage = await sharp(Buffer.from(`${captcha.image}`.trim()))
      .resize(450, 150)
      .png()
      .toBuffer();
  }

  return [
    captchaImage,
    captchaText,
    captchaType,
  ];
};
