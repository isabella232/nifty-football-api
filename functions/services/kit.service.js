const kits = ['classic', 'striped', 'mixed', 'tri', 'one-tone'];
const colours = ['#DA291C', '#B50E12', '#000', '#FFF', '#6C1D45', '#99D6EA', '#F0B323', '#6CABDD', '#1C2C5B', '#FBEE23', '#004812', '#61259E'];

class KitService {

    kitAndColours() {
        const kit = kits[Math.floor(Math.random() * kits.length)];
        const primary = colours[Math.floor(Math.random() * colours.length)];
        const secondary = colours[Math.floor(Math.random() * colours.length)];
        const tertiary = colours[Math.floor(Math.random() * colours.length)];

        return {kit, primary, secondary, tertiary};
    }
}

module.exports = new KitService();
