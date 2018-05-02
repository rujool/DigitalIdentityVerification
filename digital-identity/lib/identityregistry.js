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
    async addPassport(passportData){
        let passport;
        try{
            this.passportRegistry = await this.bizNetworkConnection.getAssetRegistry('org.acme.digitalidentitynetwork.Passport');
            let factory = this.businessNetworkDefinition.getFactory();
            var formData = passportData.formData;
            passport = factory.newResource('org.acme.digitalidentitynetwork','Passport',formData['passport-id']);
            passport.name = formData['name'];
            passport.gender = formData['gender'];
            passport.countryName = formData['countryName'];
            passport.DOB = new Date(formData['DOB']);
            passport.fathersName = formData['fathersName'];
            passport.mothersName = formData['mothersName'];
            passport.nationality = formData['nationality'];
            passport.placeOfBirth = formData['placeOfBirth'];
            passport.placeofIssue = formData['placeOfIssue'];
            passport.issueDate = new Date(formData['issueDate']);
            passport.expiryDate = new Date(formData['expiryDate']);
            passport.photoString = passportData.idPhotoStr;
            passport.signatureString = passportData.signPhotoStr;
            return await this.passportRegistry.add(passport);
        }catch(error){
            console.log(error);
        }
    }
    async getPassport(passportID){
        let passport;
        try{
            this.passportRegistry = await this.bizNetworkConnection.getAssetRegistry('org.acme.digitalidentitynetwork.Passport');
            return await this.passportRegistry.get(passportID);
        }catch(error){
            console.log(error);
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