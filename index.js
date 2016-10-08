const gm = require('gm').subClass({imageMagick: true});
const fs = require('fs-extra');
const path = require('path');

const PROJECT_ROOT = '/Users/almouro/bam/elsan-materniteam/Materniteam';
const IOS_ASSETS_FOLDER = 'ios/Materniteam/Images.xcassets/AppIcon.appiconset';
const ICON_SOURCE = './icon.png';

const iosSizes = [20, 29, 40, 60];
const iosMultipliers = [2, 3];

const androidSizes = [
  { value: 36,  density: 'ldpi' },
  { value: 48,  density: 'mdpi' },
  { value: 72,  density: 'hdpi' },
  { value: 96,  density: 'xhdpi' },
  { value: 144, density: 'xxhdpi' },
  { value: 192, density: 'xxxhdpi' },
];

const resizeImage = (srcPath, destinationPath, width, height) => {
  const directory = path.dirname(destinationPath);
  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
  }

  return new Promise((resolve, reject) => {
    gm(srcPath)
      .flatten()
      .resize(width, height || width)
      .write(destinationPath, function (err) {
        if (err) return reject(err);
        return resolve();
      });
  });
};

iosSizes.forEach((size) => {
  iosMultipliers.forEach((multiplier) => {
    resizeImage(
      ICON_SOURCE,
      `${PROJECT_ROOT}/${IOS_ASSETS_FOLDER}/icon-${size}@${multiplier}x.png`,
      size * multiplier
    );
  });
});

fs.copySync('./templates/AppIconsetContents.json', `${PROJECT_ROOT}/${IOS_ASSETS_FOLDER}/Contents.json`);

androidSizes.forEach((size) => {
  resizeImage(
    ICON_SOURCE,
    `${PROJECT_ROOT}/android/app/src/main/res/mipmap-${size.density}/ic_launcher.png`,
    size.value
  );
});
