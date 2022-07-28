import { TSMap } from "typescript-map";

export class DataHandler {

    public static initPack = new TSMap<string, Array<TSMap<string,any>>>();
    public static updatePack = new TSMap<string, Array<TSMap<string,any>>>();
    public static removePack = new TSMap<string, Array<string>>();

    static init() {
        DataHandler.initPack.set('players', new Array<TSMap<string,any>>());
        DataHandler.updatePack.set('players', new Array<TSMap<string,any>>());
        DataHandler.removePack.set('players', new Array<string>());
        DataHandler.initPack.set('bullets', new Array<TSMap<string,any>>());
        DataHandler.updatePack.set('bullets', new Array<TSMap<string,any>>());
        DataHandler.removePack.set('bullets', new Array<string>());
    }

    static addToInitPack(initData, label) {
        DataHandler.initPack.get(label).push(new TSMap<string, any>().fromJSON(initData));
    }

    static addToUpdatePack(updateData, label) {
        DataHandler.updatePack.get(label).push(new TSMap<string, any>().fromJSON(updateData));
    }

    static addToRemovePack(removeData, label) {
        DataHandler.removePack.get(label).push(removeData);
    }

    static clearPacks() {
        DataHandler.initPack.set('players', new Array<TSMap<string,any>>());
        DataHandler.updatePack.set('players', new Array<TSMap<string,any>>());
        DataHandler.removePack.set('players', new Array<string>());
        DataHandler.initPack.set('bullets', new Array<TSMap<string,any>>());
        DataHandler.updatePack.set('bullets', new Array<TSMap<string,any>>());
        DataHandler.removePack.set('bullets', new Array<string>());
    }

}