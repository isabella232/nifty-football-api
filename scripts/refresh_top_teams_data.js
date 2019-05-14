const _ = require('lodash');
const program = require('commander');
const {contracts} = require('nifty-football-contract-tools');

const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(require("../functions/_keys/futbol-cards-firebase-adminsdk.json")),
    databaseURL: 'https://futbol-cards.firebaseio.com'
});

const wait = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 250);
    });
};

void async function () {
    ////////////////////////////////
    // The network to run against //
    ////////////////////////////////

    program
        .option('-n, --network <n>', 'Network - either 1,3,4,5777', parseInt)
        .parse(process.argv);

    if (!program.network) {
        console.log(`Please specify --network=1, 3, 4 or 5777`);
        process.exit();
    }

    const network = contracts.getNetwork(program.network);

    require('../functions/services/data/firebase.service').firestore(admin);

    const teamsService = require('../functions/services/data/teams.service');
    const niftyContractService = require('../functions/services/contracts/niftyFootball.contract.service');

    const tokenIdPointer = await niftyContractService.tokenIdPointer();

    const test = [
        '0x401cbf2194d35d078c0bcdae4bea42275483ab5f',
        '0x0f48669b1681d41357eac232f516b77d0c10f0f1',
        '0x377a75c4ef92502fe40d2b454f0c3829b8c0ffc5',
        '0xace0a8666953bf9e1fe1cc91abf5db5a1c57dd46',
        '0x64c971d7e3c0483fa97a7714ec55d1e1943731c7',
        '0x60d29311fdb1bf848856ca5caedd199cff4229a8',
        '0xfa517d2db855ff27c3388f5122e3693817a107f4',
        '0xad52f7c2a61ce428b3af3d4c758c4006749ab860',
        '0xf03af1891534c133d7847241a60840fadcfa442d',
        '0x77350e1152efd5f2d807a6124015c629a907155e',
        '0xe13d4abee4b304b67c52a56871141cad1b833aa7',
        '0x6b1a2b145bfed6b90144c3d92a0811be4285ae03',
        '0x3a22282cbd2715e9d302b4a4ab0d6a117d8438b6',
        '0xc7391970d642faf65fabac8f63b0d41c4481d787',
        '0x7beed30332656ca4220cb2ce8e4508fb18013e8d',
        '0x359002cdabd2cc1e5ea4132005268fe923c00519',
        '0xf22f00d0b95b1b728078066e5f4410f6b2be8fae',
        '0xb13c38273e001f0427c26f15b79b57db90606a91',
        '0xd449175208274b6d9084edbf89e3a3879f9babb2',
        '0x30602250c5f1fcba5407e99b1dfaab992ea4ffd2',
        '0xe96a1b303a1eb8d04fb973eb2b291b8d591c8f72',
        '0xf3860788d1597cecf938424baabe976fac87dc26',
        '0x2a3f7e5170ea8ca967f85f091ef84591f639e031',
        '0xa6f10f98bcf9d62c6ee7c46a41e5ec1e23e77369',
        '0x7205a1b9c5cf6494ba2ceb5adcca831c05536912',
        '0xfbfc98210cdab3fcdb25d8a5b4e85bd544d13fd9',
        '0xa8ee0babe72cd9a80ae45dd74cd3eae7a82fd5d1',
        '0x6ed88d983b169aa814b3064be9c7fa1655aafc4c',
        '0x97b00eebfc135baf9fbcf1daeeddab2fde75d5ce',
        '0xdc59bdbf8a404a6663505cad3d40890f8aade79f',
        '0x0e26169270d92ff3649461b55ca51c99703de59e',
        '0xdec00a8df45f9cf321636340921d3d9c91d23723',
        '0x7fbc25eedfd1d7f9ce1ec1db951d22f0a8b0691a',
        '0x3bd455234245bcd7e5b4a418610ad3adb2ffae7e',
        '0x14e0c25b35a0fe5c62bb8eb0c8064e6fae290f8e',
        '0xa5e3c78e7b97b51dcbe9ebe7d6edad78fc740cac',
        '0xbc1b89612b8c8e006929197569818e785e427bfb',
        '0x3768225622d53ffcc1e00eac53a2a870ecd825c8',
        '0x7dec37c03ea5ca2c47ad2509be6abaf8c63cdb39',
        '0xd8d908959b0fdaeb9e5812443841362c6ef6663d',
        '0xa4ad045d62a493f0ed883b413866448afb13087c',
        '0x748044889b60230f7b27039893b6805a8686b286',
        '0xe68593fbd0838398b413606f2e8099474b97da86',
        '0x7461a76c834025c2dacbce5fa3a24729817624f8',
        '0xc1587feb970afcfd61836d8eb009bc81e4fc2363',
        '0x8eff17e1a92dec085e6742791357dc19fcbe7312',
        '0x530cf036ed4fa58f7301a9c788c9806624cefd19',
        '0x576a655161b5502dcf40602be1f3519a89b71658',
        '0xec7ab6d28a3431bf69206b6a616b5fef598c2506',
        '0xd7e1bc51cd3f30e21b17bab33d77078e3fb7cc26',
        '0x70bd3045414ebcbae77ef84505bc6ea6af48e672',
        '0x9d3afce69158c94f79b93f3e494270585ca59e99',
        '0xda81a57188006feac8711b046b28a79ea202e999',
        '0x98503dd9fa0863c7b1c0612aa2fad36f046c1109',
        '0xf868dad98d6b38e20d6eef9c3a641a2278c23311',
        '0x035e8a0a57f24fd10d447c6ce44524513dd6e09c',
        '0x4c1bd9c7ff3906ba3c106c61f47c0d9ad55c1bb7',
        '0x8b3158e35a0ed11ccd27aec9576ac371efe261f0',
        '0x3153acafaa7d1190324cfce205d11ea5a995bfe6',
        '0x96080155dd976e98305fa9aea96834a03abda864',
        '0x10cbbba0e6995a1885f5dea72d75f972f6d0286f',
        '0x92baffdd6cfb11a4e57a58ffec4833b4d1abd25d',
        '0x41b888be6e9dccf4316df7454176f75b72f640de',
        '0x34c1116678b62fd7ca548eea729d60ab1a566b39',
        '0x5d7f92c45c2b6a1711a0a1a7b7f6608437d17e76',
        '0xbce3bd3b206946abbe094903ae2b4244b52fb4e9',
        '0x8c174cfbd2f4224f2a4bb8eeff94a08efac00c7e',
        '0x3f86f18322a888d9b3adef38f127c941bccc014d',
        '0xe3ace06ffa96f25fd652d068cd133cbb6b1869eb',
        '0xec7641e298af02c19171451381c570327389b0c2',
        '0x16205a6048b6af17f1ac1a009bbf2ed9289e6921',
        '0x388e07d4fc7f3e2c825e6cb1ff46447764798b24',
        '0xc02e60a6728114f6769fed45dec52eedd1a67ebc',
        '0xb628c8c4f2b3434162a9403d3abce35973603a41',
        '0x8b104344f397afc33ee55c743a0fbd7d956201cd'
    ];

    const owners = new Set([]);

    for (let i = 1; i <= tokenIdPointer; i++) {
        const owner = await niftyContractService.ownerOf(network, i);
        owners.add(owner);
    }

    // console.log(owners);

    owners.forEach(async (owner) => {
        await teamsService.refreshTopTeamForAddress(network, owner);
        await wait();
    });

}();
