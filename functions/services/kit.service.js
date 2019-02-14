
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
