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
 
const GHPContext = require('./cache/context/ghp-context.json')
const W3CED25519Context = require('./cache//context/ed25519-signature-2020-v1.json')
const W3CCredentialsContext = require('./cache//context/credentials.json')
const W3CSecurityV3Context = require('./cache//context/securityV3.json')

const DemoPublicKey = require('./cache/keys/public-key.json')

/*
 * Cached JSONs Contexts and Keys. 
 */
var contexts = {
  "https://www.w3.org/2018/credentials/v1": W3CCredentialsContext,
  "https://w3id.org/security/v3-unstable": W3CSecurityV3Context, 
  "https://w3id.org/security/suites/ed25519-2020/v1": W3CED25519Context,
  "https://www.demo.com/context/v1": GHPContext,

  "did:web:demo.com:DemoController#DemoKeyName": DemoPublicKey
};

/*
 * This is a very simple offline document loader for the Signing and Verification Procedures. 
 * In the real world, this should return information from any URL it requests, not only these cached ones.  
 */
exports.documentLoader = async url => {
  const context = contexts[url];

  if (context) {
    return {
      contextUrl: null,
      document: context,
      documentUrl: url,
    };
  }

  // In production, this should never happen. 
  console.log("Unsupported URL on Tests", url);
};