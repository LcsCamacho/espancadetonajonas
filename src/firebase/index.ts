import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json";
import { credential } from "firebase-admin";

const account = {
  type: "service_account",
  project_id: "jonastraderia",
  private_key_id: "5e216de4d1e38e6059acb74b9e3604cf5ae3f619",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9c0HIB+/bqZg0\nD4I4pWRCtaEB7WJx7Q4NHaTImPsiGi69ruTKpqLREwGhvVY8X77GFv6ON0LYYMIo\nM4bqGk4Z/Mhy0X87ZLQwePO8maK/biGtZ/zSEF1GAtYJ3EIgKQdP83RXSzt3oiEf\n99C0y/yasW6l5UhJhW08rLfqRID8go1NU3bRgMHGFN3g5szrjaxdHmJlic1nNMHb\nj843tH2oT/QO3rZzh/KEXwlIWlGE5hmni1WBGU8FvB4tLNq6PfbI3Y90N6c0J7Gj\nqPxhbhnsGyNXF23FS0SI3zy+EpynnMElUt0XjfEd2WmUs6+5c3zLrLl6Rsl29sOg\nEccYcCMnAgMBAAECggEAFykcBaRSwnv9S4AJ33r4wt8Ji/7FZkAg06GoH430RbsF\ns9LJzayJgx3buTY4cLET1YvCGwjOdz18/wUtnTkSC0NIDiFmeJBbJwHialAuAVEp\ndNWdpuCxRnnaSOJQgzYA2tlcg7+CyaFcg1f8f93gR9khOc7KA5L4Q86pvU4apsPo\nv+GgbIBQUQVgvfegShXdofPSA1aBWXRNUdekVFKztDnYWYXvmmAGT5jbF71V6hOu\nZLdWO7AjJoX9+9AaT3feqcWXCKURf+nZpQYe3UZTQXb6vPMTzNZMtpnGFelWLI6i\nd5zcEdIGDv/XLqXvjlp510zCHAfEOA+dsGY2t1LX4QKBgQD8lwbMDDXfBINwkK7Y\njqfS78Ymsk8cDv5PfnUVjanO920vCscaIXTQeo7aXAWsnM9Og7cinZIphIptKvJK\nKDSzj57vjDdYO2z9v0gHjM1gjpzdLDVHubuKkSpbavQ6KEt5Q9uqBDS+scS7ovZp\nhnPJmfhLceJlvyFz+3iQsoDi5QKBgQDAAgONDRji+BaMAh2uhl3ezQbSB5Dw/pD5\nY3bNPhMd6x3tKwAvi7ppfsjP8U0triQSD5R0vb+sxMSnnvudfif/DKGmexrzr2Nc\nH7B06e8NubMNbENjAy/SGDfcmxfdIf3aZ6+St+YLqeEaX78e8+ymfAGUu8ZpF3Bq\nGUpiDzsRGwKBgQD6rKeCOVv9SG1peS0MngbPwEXWgX8hSX/5RHbOPRkY3VTuKrQN\nqsZTYE4FRu4asETMlstY/yffLDp0vPpXvi8PRKlm8rC6T7+K1BqX45SvDtl+ZjE6\nTYlhq09uCmb2kKbWYhHOWP4/ggzMap5Be73NhZB0z0Dv2Q9KG3c7outmQQKBgDEc\nksHyVqo/YK0BIYxxa/NAJ/1y1/z8cCKJ8Wo/9W3SpL30IMEIkW7Ich7WDrKfdzRz\nbbqKiktrrQ1e2ecHzL0tAu/tTxCDjPuUU3MkHvQ4ynaleXsK5qFrdmZj+S+jsSW7\nHap+hUX4ds5jLSSCqcZPs6vSd8aLq0JII8F/OdF/AoGBAISymBYOZR9979Xkc8Xm\n8INy6tjFeOEyELRkahWMmkZR0dQqm6I2jdlfxfdjajiz714Hi8kyts7HWJcqgJw7\nIK7Yu3Zkc0sug5x4gPbV6CO25Fj8YZ2MnlMA12WQwCeMQ6lqPBcWIlFy5uIxVe0p\n10EZ3ehSuKwVywENUm4wyxA4\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-uutkd@jonastraderia.iam.gserviceaccount.com",
  client_id: "113564127357820067857",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url:
    "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uutkd%40jonastraderia.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

initializeApp({
  credential: credential.cert({
    projectId: account.project_id,
    privateKey: account.private_key,
    clientEmail: account.client_email,
  }),
});

export const db = getFirestore();
