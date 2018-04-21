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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for digital-identity-app', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be digital-identity-app', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('digital-identity-app');
    })
  });

  it('network-name should be digital-identity-network@0.0.1',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('digital-identity-network@0.0.1.bna');
    });
  });

  it('navbar-brand should be digital-identity-app',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('digital-identity-app');
    });
  });

  
    it('Passport component should be loadable',() => {
      page.navigateTo('/Passport');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Passport');
      });
    });

    it('Passport table should have 15 columns',() => {
      page.navigateTo('/Passport');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(15); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Government component should be loadable',() => {
      page.navigateTo('/Government');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Government');
      });
    });

    it('Government table should have 3 columns',() => {
      page.navigateTo('/Government');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('PassportHolder component should be loadable',() => {
      page.navigateTo('/PassportHolder');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('PassportHolder');
      });
    });

    it('PassportHolder table should have 3 columns',() => {
      page.navigateTo('/PassportHolder');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('Official component should be loadable',() => {
      page.navigateTo('/Official');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Official');
      });
    });

    it('Official table should have 4 columns',() => {
      page.navigateTo('/Official');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('updatePassport component should be loadable',() => {
      page.navigateTo('/updatePassport');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('updatePassport');
      });
    });
  

});