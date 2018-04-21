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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PassportService } from './Passport.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Passport',
	templateUrl: './Passport.component.html',
	styleUrls: ['./Passport.component.css'],
  providers: [PassportService]
})
export class PassportComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          passportID = new FormControl("", Validators.required);
        
  
      
          name = new FormControl("", Validators.required);
        
  
      
          countryName = new FormControl("", Validators.required);
        
  
      
          gender = new FormControl("", Validators.required);
        
  
      
          DOB = new FormControl("", Validators.required);
        
  
      
          fathersName = new FormControl("", Validators.required);
        
  
      
          mothersName = new FormControl("", Validators.required);
        
  
      
          nationality = new FormControl("", Validators.required);
        
  
      
          placeOfBirth = new FormControl("", Validators.required);
        
  
      
          placeofIssue = new FormControl("", Validators.required);
        
  
      
          issueDate = new FormControl("", Validators.required);
        
  
      
          expiryDate = new FormControl("", Validators.required);
        
  
      
          photoString = new FormControl("", Validators.required);
        
  
      
          signatureString = new FormControl("", Validators.required);
        
  


  constructor(private servicePassport:PassportService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          passportID:this.passportID,
        
    
        
          name:this.name,
        
    
        
          countryName:this.countryName,
        
    
        
          gender:this.gender,
        
    
        
          DOB:this.DOB,
        
    
        
          fathersName:this.fathersName,
        
    
        
          mothersName:this.mothersName,
        
    
        
          nationality:this.nationality,
        
    
        
          placeOfBirth:this.placeOfBirth,
        
    
        
          placeofIssue:this.placeofIssue,
        
    
        
          issueDate:this.issueDate,
        
    
        
          expiryDate:this.expiryDate,
        
    
        
          photoString:this.photoString,
        
    
        
          signatureString:this.signatureString
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.servicePassport.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.digitalidentitynetwork.Passport",
      
        
          "passportID":this.passportID.value,
        
      
        
          "name":this.name.value,
        
      
        
          "countryName":this.countryName.value,
        
      
        
          "gender":this.gender.value,
        
      
        
          "DOB":this.DOB.value,
        
      
        
          "fathersName":this.fathersName.value,
        
      
        
          "mothersName":this.mothersName.value,
        
      
        
          "nationality":this.nationality.value,
        
      
        
          "placeOfBirth":this.placeOfBirth.value,
        
      
        
          "placeofIssue":this.placeofIssue.value,
        
      
        
          "issueDate":this.issueDate.value,
        
      
        
          "expiryDate":this.expiryDate.value,
        
      
        
          "photoString":this.photoString.value,
        
      
        
          "signatureString":this.signatureString.value
        
      
    };

    this.myForm.setValue({
      
        
          "passportID":null,
        
      
        
          "name":null,
        
      
        
          "countryName":null,
        
      
        
          "gender":null,
        
      
        
          "DOB":null,
        
      
        
          "fathersName":null,
        
      
        
          "mothersName":null,
        
      
        
          "nationality":null,
        
      
        
          "placeOfBirth":null,
        
      
        
          "placeofIssue":null,
        
      
        
          "issueDate":null,
        
      
        
          "expiryDate":null,
        
      
        
          "photoString":null,
        
      
        
          "signatureString":null
        
      
    });

    return this.servicePassport.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "passportID":null,
        
      
        
          "name":null,
        
      
        
          "countryName":null,
        
      
        
          "gender":null,
        
      
        
          "DOB":null,
        
      
        
          "fathersName":null,
        
      
        
          "mothersName":null,
        
      
        
          "nationality":null,
        
      
        
          "placeOfBirth":null,
        
      
        
          "placeofIssue":null,
        
      
        
          "issueDate":null,
        
      
        
          "expiryDate":null,
        
      
        
          "photoString":null,
        
      
        
          "signatureString":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.digitalidentitynetwork.Passport",
      
        
          
        
    
        
          
            "name":this.name.value,
          
        
    
        
          
            "countryName":this.countryName.value,
          
        
    
        
          
            "gender":this.gender.value,
          
        
    
        
          
            "DOB":this.DOB.value,
          
        
    
        
          
            "fathersName":this.fathersName.value,
          
        
    
        
          
            "mothersName":this.mothersName.value,
          
        
    
        
          
            "nationality":this.nationality.value,
          
        
    
        
          
            "placeOfBirth":this.placeOfBirth.value,
          
        
    
        
          
            "placeofIssue":this.placeofIssue.value,
          
        
    
        
          
            "issueDate":this.issueDate.value,
          
        
    
        
          
            "expiryDate":this.expiryDate.value,
          
        
    
        
          
            "photoString":this.photoString.value,
          
        
    
        
          
            "signatureString":this.signatureString.value
          
        
    
    };

    return this.servicePassport.updateAsset(form.get("passportID").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicePassport.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.servicePassport.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "passportID":null,
          
        
          
            "name":null,
          
        
          
            "countryName":null,
          
        
          
            "gender":null,
          
        
          
            "DOB":null,
          
        
          
            "fathersName":null,
          
        
          
            "mothersName":null,
          
        
          
            "nationality":null,
          
        
          
            "placeOfBirth":null,
          
        
          
            "placeofIssue":null,
          
        
          
            "issueDate":null,
          
        
          
            "expiryDate":null,
          
        
          
            "photoString":null,
          
        
          
            "signatureString":null 
          
        
      };



      
        if(result.passportID){
          
            formObject.passportID = result.passportID;
          
        }else{
          formObject.passportID = null;
        }
      
        if(result.name){
          
            formObject.name = result.name;
          
        }else{
          formObject.name = null;
        }
      
        if(result.countryName){
          
            formObject.countryName = result.countryName;
          
        }else{
          formObject.countryName = null;
        }
      
        if(result.gender){
          
            formObject.gender = result.gender;
          
        }else{
          formObject.gender = null;
        }
      
        if(result.DOB){
          
            formObject.DOB = result.DOB;
          
        }else{
          formObject.DOB = null;
        }
      
        if(result.fathersName){
          
            formObject.fathersName = result.fathersName;
          
        }else{
          formObject.fathersName = null;
        }
      
        if(result.mothersName){
          
            formObject.mothersName = result.mothersName;
          
        }else{
          formObject.mothersName = null;
        }
      
        if(result.nationality){
          
            formObject.nationality = result.nationality;
          
        }else{
          formObject.nationality = null;
        }
      
        if(result.placeOfBirth){
          
            formObject.placeOfBirth = result.placeOfBirth;
          
        }else{
          formObject.placeOfBirth = null;
        }
      
        if(result.placeofIssue){
          
            formObject.placeofIssue = result.placeofIssue;
          
        }else{
          formObject.placeofIssue = null;
        }
      
        if(result.issueDate){
          
            formObject.issueDate = result.issueDate;
          
        }else{
          formObject.issueDate = null;
        }
      
        if(result.expiryDate){
          
            formObject.expiryDate = result.expiryDate;
          
        }else{
          formObject.expiryDate = null;
        }
      
        if(result.photoString){
          
            formObject.photoString = result.photoString;
          
        }else{
          formObject.photoString = null;
        }
      
        if(result.signatureString){
          
            formObject.signatureString = result.signatureString;
          
        }else{
          formObject.signatureString = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "passportID":null,
        
      
        
          "name":null,
        
      
        
          "countryName":null,
        
      
        
          "gender":null,
        
      
        
          "DOB":null,
        
      
        
          "fathersName":null,
        
      
        
          "mothersName":null,
        
      
        
          "nationality":null,
        
      
        
          "placeOfBirth":null,
        
      
        
          "placeofIssue":null,
        
      
        
          "issueDate":null,
        
      
        
          "expiryDate":null,
        
      
        
          "photoString":null,
        
      
        
          "signatureString":null 
        
      
      });
  }

}
