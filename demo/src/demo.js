/*
 *  Vitor Pamplona
 *  PathCheck Foundation
 *  2021-08-25
 *
 *  Copyright (2013-2021) Trust Over IP
*
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const { signAndPack, unpackAndVerify } = require ('./credential');
const privateKey = require ('./cache/keys/private-key.json');
const jsonxtTemplate = require ('./cache/templates/ghp.json'); 

// This is the ceritifcate data. 
const demoVaccineCertificate = {
  type: [ 'GHPVaccinationCertificate' ],
  recipient: {
    type: [ 'GHPEventRecipient' ],
    birthDate: "1972-10-17",
    givenName: "RODNEY",
    familyName: "DANGERFIELD"
  },
  medicinalProductName: "1",
  marketingAuthorizationHolder: "1",
  doseNumber: 1,
  dosesPerCycle: 2,
  dateOfVaccination: "2021-08-04",
  stateOfVaccination: "MA",
  countryOfVaccination: "US",
  disease: "1",
  vaccineDescription: "0",
  vaccineType: "1"
}

// This is the W3C VC enclosure
const vc = {
  '@context': ['https://www.w3.org/2018/credentials/v1', "https://www.demo.com/context/v1"],
  type: ['VerifiableCredential'],
  issuer: 'did:web:demo.com:DemoController',
  issuanceDate: '2021-05-18T16:06:06Z',
  credentialSubject: demoVaccineCertificate
}


console.log("Preparing to Sign: \n");
console.log(vc);
console.log("");

// Signing and Generating QR
signAndPack(vc, privateKey, 'demo.com', 'ghp-vaccination', '1', jsonxtTemplate).then(uri => {
  console.log("Generated QR is: \n");
  console.log(uri);
  console.log("");

  // Unpacking QR and Verifying
  unpackAndVerify(uri, jsonxtTemplate).then(vc => {
    console.log("Unpacked and verified to: \n");
    console.log(vc);
    console.log("");
  });
});

