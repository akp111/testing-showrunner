// @name: Hello Channel
// @version: 1.0
// @recent_changes: Adapter Pattern

import { Service, Inject } from 'typedi';
import config from '../../config';
import showrunnersHelper from '../../helpers/showrunnersHelper';
import { ethers, logger } from 'ethers';
import epnsHelper, { InfuraSettings, NetWorkSettings, EPNSSettings } from '@epnsproject/backend-sdk-staging'

const infuraSettings: InfuraSettings = {
    projectID: config.infuraAPI.projectID,
    projectSecret: config.infuraAPI.projectSecret
}
const settings: NetWorkSettings = {
    alchemy: config.alchemyAPI,
    infura: infuraSettings,
    etherscan: config.etherscanAPI
}
const epnsSettings: EPNSSettings = {
    network: config.web3RopstenNetwork,
    contractAddress: config.deployedContract,
    contractABI: config.deployedContractABI
}
const NETWORK_TO_MONITOR = config.web3RopstenNetwork;//network to monitor
const DEBUG = true; //set to false to turn of logging

const debugLogger = (message) => DEBUG && logger.info(message);

export default class HelloChannel {
    constructor(
        @Inject('logger') private logger,
    ) { }

    public async getWalletKey() {
        var path = require('path');
        const dirname = path.basename(__dirname);
        const wallets = config.showrunnerWallets[`${dirname}`];
        const currentWalletInfo = await showrunnersHelper.getValidWallet(dirname, wallets);
        const walletKeyID = `wallet${currentWalletInfo.currentWalletID}`;
        const walletKey = wallets[walletKeyID];
        return walletKey;
    }

    public async sendMessageToContracts(simulate) {
        debugLogger(`[${new Date(Date.now())}]-[Hello Channel] `);
        debugLogger(`[Hello Channel sendMessageToContract] - sending sample notification`);
        //  Overide logic if need be
        const logicOverride = typeof simulate == 'object' ? (simulate.hasOwnProperty("logicOverride") ? simulate.hasOwnProperty("logicOverride") : false) : false;
        //  -- End Override logic
        const walletKey = await this.getWalletKey()
        const sdk = new epnsHelper(NETWORK_TO_MONITOR, walletKey, settings, epnsSettings);

        const title = `Hello World`;
        const body = `Hello World from EPNS`;
        const payloadTitle = `Hello World`;
        const payloadMsg = `Hello World from EPNS [timestamp: ${Math.floor(new Date() / 1000)}]`;
        const notificationType = 3;
        const tx = await sdk.sendNotification("0xD8634C39BBFd4033c0d3289C4515275102423681", title, body, payloadTitle, payloadMsg, notificationType, simulate)
        logger.info(tx);
    }
}