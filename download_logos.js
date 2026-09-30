const https = require('https');
const fs = require('fs');

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  try {
    await downloadImage('https://cdn-icons-png.flaticon.com/512/2991/2991148.png', 'src/assets/images/common/google_logo.png'); // Google logo
    await downloadImage('https://cdn-icons-png.flaticon.com/512/124/124010.png', 'src/assets/images/common/facebook_logo.png'); // Facebook logo
    console.log('Downloaded logos');
  } catch (err) {
    console.error('Error downloading:', err);
  }
}
run();
