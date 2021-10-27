# The Good Health Pass Interoperability Blueprint<br>Paper Credentials Cookbook

Version 0.9

1 October 2021

Status: DRAFT. 

This publicly available guide was approved by the ToIP Foundation Steering Committee on [date of approval (dd month yyyy)].

The mission of the [Trust over IP (ToIP) Foundation](http://www.trustoverip.org) is to define a complete architecture for Internet-scale digital trust that combines cryptographic assurance at the machine layer with human accountability at the business, legal, and social layers. Founded in May 2020 as a non-profit hosted by the Linux Foundation, the ToIP Foundation has over 300 organizational and 100 individual members from around the world.

Please see the end page for licensing information and how to get involved with the Trust Over IP Foundation.

# Introduction​​

This document is a “cookbook” for creating [Good Health ](https://www.goodhealthpass.org/)[Pass](https://www.goodhealthpass.org/) (GHP) paper credentials and passes (PCP).

The “recipe” consists of the following steps”

1. Choose a file repository
1. Create Data Definitions
1. Encode Data
1. Wrap Encoded Data in Verifiable Credential
1. Encode VC as QR Code

There are four different types of data objects you can create with GHP:

1. Vaccination Credential - Proof of Immunization
1. COVID-19 Citizen Recovery Credential - Proof of Recovery
1. COVID-19 Antigen Test Credential - Proof of Test
1. Good Health Pass

You should be familiar with the basic terminology used in Verifiable Credentials:

- Holder
- Verifier
- Issuer
- Credential
- Pass

The full GHP Blueprint, including a guide to terminology can be found here: [https://www.goodhealthpass.org/blueprint](https://www.goodhealthpass.org/blueprint). If you just want to dive in and look and code, JSON and [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/), go here: [https://github.com/trustoverip/ghp-paper-creds](https://github.com/trustoverip/ghp-paper-creds).


# The Recipe

## 1. Choose an Online File Repository

GHP Paper Credentials will require several files to be retrievable online. These files can be cached in any Validator and do not pose a tracking risk to Holders. 

The files that need to be uploaded are:
- the @context for [JSON-LD](https://json-ld.org/) files
- optionally, the template for [JSON-XT](https://jsonxt.io/) compression

Although there is a common set of data elements defined by GHP, these must be customized for each particular Issuer for the needs of their country / locale (for example, medical coding changes from country to country). At the end of this process, you should be able to retrieve files like:

- [https://example-locale.com/context.json](https://example.com/context.json)
- [https://example-locale.com/templates.json](https://example.com/context.json)

We suggest you keep these domains, paths and filenames as short as possible, as encoding data on QR codes is very space sensitive.

## 2. Create Data Definitions

There are four different data objects that can be created in GHP (Proof of Immunization, Recovery, Test; and a Pass), which need to be customized to your particular locale. The customization process is fairly straightforward and should not be time consuming.

Expanded data definitions can be found here: [GHP COVID-19 Data Capture](https://drive.google.com/drive/u/0/folders/12rUFo7_EkjF-AcfRcghrtoGTN0iWgf-j). Example data definition can be found [https://github.com/trustoverip/ghp-paper-creds](https://github.com/trustoverip/ghp-paper-creds) and if you need further advice, please reach out to Paul Knowles at [paul.knowles@humancolossus.org](mailto:paul.knowles@humancolossus.org).

### Common Fields to all Passes and Credentials

Note that there are privacy concerns about encoding data and digitally signing it with “well-known” organizations such as national governments. If your use case permits, consider omitting as much data as possible - for example, only use the person’s initials or birth year.

- **givenName**
- **middleName**
- **familyName**
- **birthDate**

### Good Health Pass

If you’re accepting proof documents and manually or digitally validating them and then issuing a short term pass - say, for entry to a province or a country - this is probably the one you wish to use.

- **recipient** - The resource identifier of the schema used for event recipient identification (_includes_ _givenName, middleName, familyName, birthDate_)
- **linkedCredential** - Unique identifier(s) of associated credential(s)
- **status** - Trust decision made by the verifier

### Vaccination Credential (Proof of Immunization)

- **recipient** - The resource identifier of the schema used for event recipient identification (_includes_ _givenName, middleName, familyName, birthDate_)
- **linkedVaccineCertificate** - Unique identifier of the associated vaccination certificate
- **disease** - Disease or agent that the vaccination provides protection against
- **vaccineDescription** - Generic description of the vaccine/prophylaxis
- **vaccineType** - Generic description of the vaccine/prophylaxis or its component(s) [J07BX03 covid-19 vaccines]
- **medicinalProductName** - Medicinal product name
- **cvxCode** - CVX code (North America only)
- **marketingAuthorizationHolder** - Marketing Authorisation Holder
- **doseNumber** - Number of dose administered in a cycle
- **dosesPerCycle** - Number of expected doses for a complete cycle (specific for a person at the time of administration)
- **dateOfVaccination** - The date the vaccination event occurred (or was intended to occur)
- **stateOfVaccination** - The state in which the individual has been vaccinated
- **countryOfVaccination** - The country in which the individual has been vaccinated
- **certificateNumber** - Unique identifier of the certificate (UVCI), to be printed (human readable) into the certificate; the unique identifier can be included in the IIS

### COVID-19 Citizen Recovery Credential (Proof of Recovery)

- **recipient** - The resource identifier of the schema used for event recipient identification (_includes_ _givenName, middleName, familyName, birthDate_)
- **linkedTestCertificate** - Unique identifier of the associated test certificate
- **disease** - Disease or agent the citizen has recovered from.
- **dateOfFirstPositiveResult** - Date when the sample for the test was collected that led to positive test obtained through a procedure established by a public health authority in the Member State.
- **stateOfTest** - The state in which the individual was tested
- **countryOfTest** - The country in which the first positive test was performed.
- **certificateValidFrom** - Certificate valid from (required if known)
- **certificateValidTo** - Certificate valid until
- **certificateNumber** - Unique identifier of the certificate (UVCI), to be printed (human readable) into the certificate; the unique identifier can be included in the IIS

### COVID-19 Antigen Test Credential (Proof of Test)

- **recipient** - The resource identifier of the schema used for event recipient identification (_includes_ _givenName, middleName, familyName, birthDate_)
- **linkedTestCertificate** - Unique identifier of the associated test certificate
- **disease** - Disease or agent that the test provides detection of.
- **testDescription** - Generic description of the test
- **testType** - Description of the type of test that was conducted, e.g. NAAT or rapid antigen test.
- **testCommercialName** - Commercial or brand name of the test.
- **testManufacturer** - Legal manufacturer of the test.
- **dateOfSample** - Date and time when the sample was collected. 
- **dateOfResult** - Date and time when the test result was produced.
- **testResult** - For example, negative, positive, inconclusive or void.
- **testingCentre** - Name/code of testing centre, facility or a health authority responsible for the testing event.
- **stateOfTest** - The state in which the individual was tested
- **countryOfTest** - The country in which the individual was tested.
- **certificateNumber** - Unique identifier of the certificate (UVCI), to be printed (human readable) into the certificate; the unique identifier can be included in the IIS

### JSON-LD @context 

When you have completed your data definition, it should look at the example in the Appendices - we’re not including it in the text here because of the size. Again, if you’re having trouble creating this, please get in touch with us and we can help you out.

### Encode Data

The following sections are examples of the encoded data - this may vary slightly depending on your **@context** definition; these ones have been produced for Canada.

### Vaccination Credential (Proof of Immunization)

[https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-vaccination.json](https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-vaccination.json)

```json
{
  "type": [ "**GHPVaccinationCertificate**" ],
  "recipient": {
    "type": [ "GHPEventRecipient" ],
    "birthDate": "1972-10-17",
    "givenName": "Rodney",
    "middleName": "Milburn",
    "familyName": "Dangerfield"
  },
  "linkedVaccineCertificate": "VAX383469956",
  "medicinalProductName": "28571000087109",
  "cvxCode": "207",
  "marketingAuthorizationHolder": "MOD",
  "doseNumber": 1,
  "dosesPerCycle": 2,
  "dateOfVaccination": "2021-08-04",
  "stateOfVaccination": "CA-AB",
  "countryOfVaccination": "CA",
  "disease": "RA01",
  "vaccineType": "XM0GQ8",
  "certificateNumber": "URN:UVCI:01:CA:67097896F94ADD0FF5093FBC875BE2396#D"
}
```

### COVID-19 Citizen Recovery Credential (Proof of Recovery)

[https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-recovery.json](https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-recovery.json)

```json
{
  "type": [ "GHPCitizenRecoveryCredential" ],
  "recipient": {
    "type": [ "GHPEventRecipient" ],
    "birthDate": "1972-10-17",
    "givenName": "Rodney",
    "middleName": "Milburn",
    "familyName": "Dangerfield"
  },
  "linkedTestCertificate": "PGR39264009",
  "dateOfFirstPositiveResult": "2020-11-23",
  "stateOfTest": "CA-AB",
  "countryOfTest": "CA",
  "disease": "RA01",
  "certificateValidFrom": "2021-08-02",
  "certificateValidTo": "2021-08-09",
  "certificateNumber": "URN:UVCI:01:US:78543092A86FDS3SD5612DBV673FG943#C"
}
```

### COVID-19 Antigen Test Credential (Proof of Test)

[https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-antigen.json](https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-antigen.json)

```json
{
  "type": [ "GHPAntigenTestCredential" ],
  "recipient": {
    "type": [ "GHPEventRecipient" ],
    "birthDate": "1972-10-17",
    "givenName": "Rodney",
    "middleName": "Milburn",
    "familyName": "Dangerfield"
  },
  "linkedTestCertificate": "PGR39264009",
  "disease": "RA01",
  "testType": "LP6464-4",
  "testCommercialName": "GLN-8800075500014/M22MD100M",
  "testManufacturer": "GLN-8800075500014",
  "dateOfSample": "2021-08-02T01:08:03Z",
  "dateOfResult": "2021-08-02T01:08:02Z",
  "testResult": "260415000",
  "testingCentre": "Joseph Walker Williams Community Center",
  "stateOfTest": "CA-AB",
  "countryOfTest": "CA",
  "certificateNumber": "URN:UVCI:01:US:10807843F94AEE0EE5093FBC254BD813#B"
}
```

### Good Health Pass

[https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass.json](https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass.json)

```json
{
  "type": [ "GoodHealthPass" ],
  "recipient": {
    "type": [ "GHPEventRecipient" ],
    "birthDate": "1972-10-17",
    "givenName": "Rodney",
    "middleName": "Milburn",
    "familyName": "Dangerfield"
  },
  "status": true
}
```

## 3. Wrap Encoded Data in Signed Verifiable Credential

See the Appendices for how to use the code to sign VCs ([https://github.com/trustoverip/ghp-paper-creds/blob/main/demo/src/demo.js](https://github.com/trustoverip/ghp-paper-creds/blob/main/demo/src/demo.js)).  

### Example VC (Good Health Pass)

[https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass-vc.json](https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass-vc.json) - note that in this folder there are example Verifiable Credentials for all the GHP Credential Types.

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.goodhealthpass.org/context/v1"
  ],
  "type": ["VerifiableCredential"],
  "issuer": "DID:WEB:DEMO.COM:CONTROLLER",
  "issuanceDate": "2021-09-03T14:58:13Z",
  "credentialSchema": {
    "id": "7VhEMSUkXt8jnhgXKGkipDcoT6RTiESwAWKCKJV8rbpj",
    "type": "OCASchemaValidator"
  },
  "credentialSubject": {
    "type": ["GoodHealthPass"],
    "recipient": {
      "type": ["GHPEventRecipient"],
      "birthDate": "1972-10-17",
      "givenName": "Rodney",
      "middleName": "Milburn",
      "familyName": "Dangerfield"
    },
    "status": true
  }
}
``` 

## 4. Encode VC as QR Code

See the Appendices for how to use the code to sign VCs ([https://github.com/trustoverip/ghp-paper-creds/blob/main/demo/src/demo.js](https://github.com/trustoverip/ghp-paper-creds/blob/main/demo/src/demo.js)).

### Example JSON-XT QR Code (Good Health Pass)

[https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass-vc.png](https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass-vc.png) - note that in this folder there are example QR Codes for all the GHP Credential Types.

### Example JSON-XT URL (Good Health Pass)

[https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass-vc.txt](https://github.com/trustoverip/ghp-paper-creds/blob/main/examples/example-pass-vc.txt) - note that in this folder there are example JSON-XT URLs for all the GHP Credential Types.

```
JXT:DEMO.COM:VAX:1:Rodney/Milburn/Dangerfield/26OJ A1GJ4E05//DID%3AWEB%3ADEMO.COM%3ACONTROLLER/*G$0DEMO.COM%3ACONTROLLER%23KEY/3U30D58G9XLEF2WELCM8R80L0VU6W3B5VLI34HTRDOLNJGW8RL6G26W6E86SRLOWNGE0HTXW1FYCPLG0RVDY74W78CQ27BEZKMRR9
```

# Appendices

## Demo Code

### Installation

From a *nix shell

```
git clone [git@github.com](mailto:git@github.com):trustoverip/ghp-paper-creds.git
cd ghp-paper-creds/demo
npm install
```

### Running

This demo has all the code you need. It will:

1. create a W3C Verifiable Credential
1. sign it using Ed25519Signature2020
1. pack the result into a JSON-XT URL
1. optionally, write that URL as a PNG QR Code
1. verify the signature

Run:

```
cd ghp-paper-creds/demo/src
node demo --help
node demo
```

## Sample JSON-LD @context

Due to size, we’ve left this out of this document. Note that this @context is for Canada, you need to customize for your own jurisdiction but this is a good jumping off point:

[https://github.com/trustoverip/ghp-paper-creds/blob/main/demo/src/cache/context/ghp-context.json](https://github.com/trustoverip/ghp-paper-creds/blob/main/demo/src/cache/context/ghp-context.json)

# Document Notice
The [Trust Over IP Foundation](https://trustoverip.org/) (ToIP) is hosted by the Linux Foundation under its [Joint Development Foundation](https://www.jointdevelopment.org/) legal structure. We produce a wide range of tools and deliverables organized into five categories:

- Specifications to be implemented in code
- Recommendations to be followed in practice
- Guides to be executed in operation
- White Papers to assist in decision making
- Glossaries to be incorporated in other documents

ToIP is a membership organization with three classes—Contributor, General, and Steering. 

The work of the Foundation all takes place in Working Groups, within which there are Task Forces self-organized around specific interests. All ToIP members regardless of membership class may participate in all ToIP Working Groups and Task Forces.

When you join ToIP, you are joining a community of individuals and organizations committed to solving the toughest technical and human centric problems of digital trust.  Your involvement will shape the future of how trust is managed across the Internet, in commerce, and throughout our digital lives. The benefits of joining our collaborative community are that together we can tackle issues that no single organization, governmental jurisdiction, or project ecosystem can solve by themselves. The results are lower costs for security, privacy, and compliance; dramatically improved customer experience, accelerated digital transformation, and simplified cross-system integration.

To learn more about the Trust Over IP Foundation please visit our website, [https://trustoverip.org](https://trustoverip.org).

## Licensing Information

The [working group name] at the Trust Over IP Foundation deliverables are published under the following licenses:

Copyright mode: Attribution 4.0 International licenses: [http://creativecommons.org/licenses/by/4.0/legalcode](http://creativecommons.org/licenses/by/4.0/legalcode)

Patent mode: W3C Mode (based on the W3C Patent Policy): [http://www.w3.org/Consortium/Patent-Policy-20040205](http://www.w3.org/Consortium/Patent-Policy-20040205)

Source code: Apache 2.0.[http://www.apache.org/licenses/LICENSE-2.0.htm](http://www.apache.org/licenses/LICENSE-2.0.html)