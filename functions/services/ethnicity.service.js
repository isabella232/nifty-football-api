const hairs = ['#8D5524', '#212F3D', '#784212', '#F7DC6F', '#424949', '#603909', '#7e4d1c'];
const skins = ['#F39C12', '#C68642', '#E0AC69', '#F1C27D', '#FFDBAC', '#603909', '#7e4d1c'];

class EthnicityService {

    skinAndHair() {
        const skin = skins[Math.floor(Math.random() * skins.length)];
        const hair = hairs[Math.floor(Math.random() * hairs.length)];

        return {skin, hair};
    }
}

module.exports = new EthnicityService();
