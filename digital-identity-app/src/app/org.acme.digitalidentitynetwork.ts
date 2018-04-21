import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.acme.digitalidentitynetwork{
   export class Passport extends Asset {
      passportID: string;
      name: string;
      countryName: string;
      gender: string;
      DOB: Date;
      fathersName: string;
      mothersName: string;
      nationality: string;
      placeOfBirth: string;
      placeofIssue: string;
      issueDate: Date;
      expiryDate: Date;
      photoString: string;
      signatureString: string;
   }
   export class Government extends Participant {
      countryName: string;
      publicKey: string;
   }
   export class PassportHolder extends Participant {
      userID: string;
      passport: Passport;
   }
   export class Official extends Participant {
      officialID: string;
      officialName: string;
      designation: string;
   }
   export class updatePassport extends Transaction {
      official: Official;
      gov: Government;
      passport: Passport;
   }
// }
