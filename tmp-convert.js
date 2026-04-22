const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

function convert(input, output) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(input)) {
        console.log("File not found", input);
        resolve();
        return;
    }
    console.log(`Converting ${input} to ${output}...`);
    ffmpeg(input)
      .output(output)
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .on('end', () => {
        console.log(`Finished converting ${output}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error converting ${input}:`, err.message);
        reject(err);
      })
      .run();
  });
}

async function main() {
  await convert('public/audio/articles/ngongo-philosophique.wav', 'public/audio/articles/ngongo-philosophique.mp3');
  await convert('public/audio/articles/chefferie-equilibre-deux-mondes.wav', 'public/audio/articles/chefferie-equilibre-deux-mondes.mp3');
}

main();
