//Simple Class Wrapping Inventory Functionality
module.exports.Inventory = class Inventory {
    construct() {

    }

    async Create(req){
        return "Inventory.Create";
    }

    async Update(req){
        return "Inventory.Update";
    }

    async FetchAll(req){
        return "Inventory.FetchAll";
    }

    async Fetch(req){
        return "Inventory.Fetch";
    }

    async Adjust(req){
        return "Inventory.Adjust";
    }
};
