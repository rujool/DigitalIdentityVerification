/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var cryptoJS = require('crypto-js');
var crypto = require('crypto');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

let cardname = 'admin@digital-identity-network';

class IdentityRegistry {

    constructor() {
        this.bizNetworkConnection = new BusinessNetworkConnection();
    }


    // Initialize business network definition
    async init() {
        this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardname);
    }


    // Add new Official
    async addOfficial(officialData) {
        let official;
        try {
            this.officialRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.acme.digitalidentitynetwork.Official');
            let factory = this.businessNetworkDefinition.getFactory();

            official = factory.newResource('org.acme.digitalidentitynetwork', 'Official', officialData.id);
            official.officialName = officialData.name;
            official.designation = officialData.designation;

            return await this.officialRegistry.add(official);

        } catch(error) {
            console.log(error);
            throw error;
            return null;
        }
    }

    // Add Passport
    async addPassport(obj){
        let passport;
        try{
            this.passportRegistry = await this.bizNetworkConnection.getAssetRegistry('org.acme.digitalidentitynetwork.Passport');
            let factory = this.businessNetworkDefinition.getFactory();
            passport = factory.newResource('org.acme.digitalidentitynetwork','Passport',obj.passportData.passportID);
            passport.passportData = obj.passportData.data;
            passport.signature = obj.signature;
            return await this.passportRegistry.add(passport);
        }catch(error){
            console.log(error);
            throw error;
        }
    }
    async getPassport(credObj){
        let passport;
        try{
            this.passportRegistry = await this.bizNetworkConnection.getAssetRegistry('org.acme.digitalidentitynetwork.Passport');
            this.governmentRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.acme.digitalidentitynetwork.Government');
            
            passport = await this.passportRegistry.get(credObj.id);
            var IV = credObj.iv;
            var passportData = passport.passportData;
            var encryptedID = passport.passportID;
            var decryptedID = cryptoJS.AES.decrypt(encryptedID,credObj.password,{
                'iv':IV
            }).toString(cryptoJS.enc.Utf8);
            var decryptedData = JSON.parse(cryptoJS.AES.decrypt(passportData,credObj.password,{
                'iv':IV
            }).toString(cryptoJS.enc.Utf8));
            var govName = decryptedData.formData.countryName;
            var signature = passport.signature;
            let government = await this.governmentRegistry.get(govName);
            var publicKey = government.publicKey;
            var encryptedObj = {
                'passportID': encryptedID,
                'data' : passportData
            };
            var verifyObj = crypto.createVerify('RSA-SHA256');
            verifyObj.update(JSON.stringify(encryptedObj));
            var verified = verifyObj.verify(publicKey,signature,'base64');
            return decryptedData; 
        }catch(error){
            console.log(error);
            throw "Error: Please check your credentials";
        }
    }

    async addGovernment(governmentData){
        let government;
        try{
            this.governmentRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.acme.digitalidentitynetwork.Government');
            let factory = this.businessNetworkDefinition.getFactory();

            government = factory.newResource('org.acme.digitalidentitynetwork', 'Government', governmentData.name);
            government.publicKey = governmentData.publicKey;
            
            return await this.governmentRegistry.add(government);
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}
module.exports = IdentityRegistry;