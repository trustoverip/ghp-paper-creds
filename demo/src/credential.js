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
 
// Dependencies for Signing/Verifying the VC 
const vc = require('@digitalbazaar/vc');
const { Ed25519Signature2020 }  = require('@digitalbazaar/ed25519-signature-2020');
const { Ed25519VerificationKey2020 }  = require('@digitalbazaar/ed25519-verification-key-2020');

// For packing into a QR Code
const JXT = require("jsonxt");

// A cached Loader for keys and contexts
const { documentLoader } = require('./cachedLoader');

// Signs a certificate into a VC using the private key in the KeyPair
const sign = async function (certificate, keyPairSerialized) {
    const keyPair = await Ed25519VerificationKey2020.from(keyPairSerialized);
    const suite = new Ed25519Signature2020({key: keyPair});

    const credential = {
        ...certificate
    };

    return await vc.issue({credential, suite, documentLoader});
}

// Downloads the public key, contexts and verifies the credential
const verify = async function (credential) {
    const suite = new Ed25519Signature2020();

    const controller = {
        '@context': 'https://w3id.org/security/v3-unstable',
        id: credential.issuer,
        assertionMethod: [credential.proof.verificationMethod],
        authentication: [credential.proof.verificationMethod]
    };

    const verification = await vc.verifyCredential({
        credential,
        controller, 
        suite, 
        documentLoader
    });

    return verification.verified;
}

// Unpacks the QR Code into a JSON. FullTemplate should be used only on debug/demo
const unpack = async function (uri, fullTemplate) {
  if (fullTemplate) 
    return await JXT.unpack(uri, ()=>{return fullTemplate;});
  else
    return await JXT.unpack(uri, JXT.resolveCache);
}    

// Packs the VC into a QR Code. FullTemplate should be used only on debug/demo
const pack = async function (signedData, domain, templateName, templateVersion, fullTemplate) {
  if (fullTemplate) 
    return await JXT.pack(signedData, fullTemplate, templateName, templateVersion, domain, {
        uppercase: true,
    });
  else
    return await JXT.resolvePack(signedData, templateName, templateVersion, domain, JXT.resolveCache, {
        uppercase: true,
    });
}

// Signs the payload and packs into a QR Code
const signAndPack = async function signAndPack(payload, keyPairSerialized, domain, templateName, templateVersion, template) {
  return await pack(await sign(payload, keyPairSerialized), domain, templateName, templateVersion, template);
}

// Unpacks the QR Code and verifies the VC, returning the VC object if verified. 
const unpackAndVerify = async function unpackAndVerify(uri, fullTemplate) {
  try {
    const json = await unpack(uri, fullTemplate);
    if (await verify(json)) {
      return json;
    }
    return undefined;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

exports.signAndPack = signAndPack;
exports.unpackAndVerify = unpackAndVerify;