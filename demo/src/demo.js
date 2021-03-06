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

const { signAndPack, unpackAndVerify, unpack } = require ('./credential');
const privateKey = require ('./cache/keys/private-key.json');
const jsonxtTemplate = require ('./cache/templates/ghp.json');

const qrcode = require("qrcode")
const path = require("path")
const fs = require("fs")

const isodatetime = date => 
    (date ? new Date(date) : new Date()).toISOString().replace(/....Z$/, "Z") // Resolution of seconds to avoid creating a unique indentifier  

const minimist = require("minimist")
const at = {
    boolean: [
        "verbose", 
        "help",
    ],
    string: [
        "credential",
        "date",
        "issuer",
        "resolver",
        "type",
        "version",

        "qrcode",
        "uri",
        "vc",
    ],
    default: {
        "verbose": false,
        "credential": path.join(path.dirname(__filename), "../../examples/example-vaccination.json"),
        "date": null,
        "issuer": 'DID:WEB:DEMO.COM:CONTROLLER',                     // Issuer's Controller for the KeyPair
        "resolver": "demo.com"
    },
}
const ad = minimist(process.argv.slice(2), at)

const help = message => {
    const name = "demo"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log(`
usage: ${name} [options] 

Demonstrate signing and validating GoodHealthPass 
W3C Verifiable Credentials.

This will run with no command line arguments, but
you can parameterize it somewhat to play with it.

Options:

--credential <file.json>     file with JSON credential
--date <date>
--issuer <issuer>            VC issuer (default: ${at.default.issuer})
--resolver <host>            JSONXT resolver (default: ${at.default.resolver})
--type <type>                JSONXT type (default: ${at.default.type})
--version <version>          JSONXT version (default: ${at.default.version})

Writing options:

--qrcode <file.png>          file to write QR code to
--uri <file.txt>             file to write JSONXT URI to
--vc <file.json>             file to write signed VC to
`)

    process.exit(message ? 1 : 0)
}

if (ad.help) {
    help()
} else if (!ad.credential) {
    help("--credential <data.json> required")
}

const findTemplateType = (templates, type) => {
  let foundTemplate = undefined;
  Object.entries(templates).forEach(([templateName, templateRoot]) => {
    if (templateRoot.template.credentialSubject.type[0] === type[0]) {
      foundTemplate = templateName;
    }
  }); 
  if (foundTemplate) return foundTemplate;
  console.error("Could not find JSONXT template for the credential type " + type)
}

const main = async (ad) => {
    const demoVaccineCertificate = JSON.parse(await fs.promises.readFile(ad.credential, "utf-8"))

    if (!ad.type) {
      template = findTemplateType(jsonxtTemplate, demoVaccineCertificate.type);
      ad.type = template.split(":")[0];
      ad.version = template.split(":")[1];
    }

    // This is the W3C VC enclosure
    const vc = {
      '@context': ['https://www.w3.org/2018/credentials/v1', "https://www.goodhealthpass.org/context/v1"],
      type: ['VerifiableCredential'],
      issuer: ad.issuer,                     // Issuer's Controller for the KeyPair
      issuanceDate: isodatetime(ad.date), 
      credentialSchema: {
        id: "7VhEMSUkXt8jnhgXKGkipDcoT6RTiESwAWKCKJV8rbpj",          // Fixes the OCA Schema version used to issue this credential. 
        type: "OCASchemaValidator"
      },
      credentialSubject: demoVaccineCertificate,
    }

    console.log("  Preparing to Sign");
    if (ad.verbose) {
      console.log("");
      console.log(JSON.stringify(vc, null, 2))
      console.log("");
    }

    // Signing and Generating QR
    signAndPack(vc, privateKey, ad.resolver, ad.type, ad.version, jsonxtTemplate).then(async uri => {
      console.log(`  Generated QR (${uri.length} bytes)`);
      if (ad.verbose) {
        console.log("");
        console.log(uri);
        console.log("");
      }

      if (ad.uri) {
        await fs.promises.writeFile(ad.uri, uri)
      }
      if (ad.vc) {
        unpack(uri, jsonxtTemplate).then(vc => {
          fs.promises.writeFile(ad.vc, JSON.stringify(vc, null, 2))
        });
      }
      if (ad.qrcode) {
        await qrcode.toFile(ad.qrcode, uri, {
            errorCorrectionLevel: "Q",
        })
      }

      // Unpacking QR and Verifying
      unpackAndVerify(uri, jsonxtTemplate).then(vc => {
        if (vc) {
          console.log("  Unpacked and verified");
          if (ad.verbose) {
            console.log("");
            console.log(JSON.stringify(vc, null, 2))
            console.log("");
          }
        } else { 
          unpack(uri, jsonxtTemplate).then(vc => {
            console.log("  Unable to Verify: \n");
            console.log(JSON.stringify(vc, null, 2))
            console.log("");
          });
        }
      });
    });
}

try {
    main(ad)
} catch (x) {
    console.log(x)
}
