import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json";
import { credential } from "firebase-admin";

const account = {
  type: "service_account",
  project_id: "app-jonas-trader",
  private_key_id: "008e7118583e3b123252c0afecbb9259767c7135",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdt78J6iXL1Vp9\nLDiD0/ur2NfjJdxLIdYe6quRmRA4g1lZ1cIUtGo9jS4Ej/uw0bCdG2n71jo59L5/\naol5r4DiIYJSN7+3Zvz+m4jmqduSl2gFHftxJfA0tAgTYKPSkCUtpv+itlZ2uD5G\npH/+KF7Ao9schFztNsFTHFUcm0py9mIo61ZFbLCAykBEocUR0A/742fWYgXV5JZv\n2vxaI63rs168CQZMhYddcOK5BWX4lknIU5vrBDPpAwoeYERCn1InOByk+UPrzjwA\nFWeZqjrq4mzk7JW7YiuceTjvJrhfC8qA9JXc1l6g7hOgkJ2vuw43UFo2zYZmeRn4\nyIPCmx2TAgMBAAECggEAEZ0o8uYD/5jdyMH3Xn2pCz77Pq0xRkYf9Yb2z0VoDYUE\nexHHjEFpO2OOLUiZRDI+8Q9+jXdrkaJsOKsAxybFvuYdeaor4+3WuRFMv5oJDCeS\n9eisdq1VKhr7FehCk4GxV+u2fAkKF1XUmqtvd0aHQn4U5UFBEZBTv0DtnnVst0bw\n6UO9KNcOSjH0G0sRm90YTVQ1FERmPd2PfXIUV8wEU4J+BWy0t8JFdibWr68pelIa\nSWLPRz3qpf+lruEbQPFRq7AZdxJ/jNCJOWneD805nVZZj1R4mLfaUqiZFlBA0dZk\nD3rsxT97iMmCMevz4mZgLkVuSQ+QANU8FB5Igpkh0QKBgQDaSqsf1qkw3bReGd4a\nmp9PiBl93nwEMA9wdr8PKXUcBR6EYkB/nSYXg/MUhq5mYhecWgKpuSoUUVpgoBmL\nnrLm1gW225iW6lduKQMeAG+yf0RABOZP09NW7npM/EzLAka4L+nWo8yhUjqYGwQ1\njDAyQsKr4KNgRlRQ6b3ePwpjowKBgQC49l4pP+GvSjCK6L1fni6qNDfjvNFbtZE/\nBx7iNLuByYWvAv+OkVQG3S7AkQzfEOYPExIEbuobEl02CM2HPuiLY/nIU84Mo3Gd\nT9BAnwHbLEg/P8EpaM9j8xJWN3atH+Qy0fpl9NGiBCWYL/8INvT/trpxfTit8wzq\nuptgHll9UQKBgQCWkcyJsJKRf0uLYQJfjWn3/OPAe3dFmDT+GRpehfUed7V+ERt2\nKtp8e+purRucyWqJ0Vhm467PxvG1FpmoQbYbHWNhpwUQi+H0vVtGFXz2PWzBT9/h\nDjaHjwVTFvCNUyuenoYIJIHggIykIHZ9zQ3tjTkkP1XR8ZD1ItVxeEBdSwKBgFIK\nTTfEswj6Qk/K7fyUgCRUpxmnrcEc5wDq2qMBOs5VoatADDSjd37X6p3VeL0UlMbI\n8avvun0phxipjOhZWfJB9RALRBDNCl75gOi43qzllmIfmEES0TKHJXIChexCggic\npJFGpxlS943qdBejsMYfudEO9u4JKYiQHsziiVURAoGAX1o63nFsehHY43MlE2Xl\npX5Sv2YADY6XvYTORGqG6zWH22wfWgQAEgeWY1X5kpKbNsuzWYifwnkz5ShrU5qe\nOpDfGFeEymPLayxvhRJnVcCcubBafMchKAiKukgNfAbcOJXWUrK8wlRiX+AC36oo\nCdToa4C7/VUP9tot25G4r6U=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-9www2@app-jonas-trader.iam.gserviceaccount.com",
  client_id: "107890129512099287649",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url:
    "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9www2%40app-jonas-trader.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

initializeApp({
  //
  credential: credential.cert({
    projectId: account.project_id,
    privateKey: account.private_key,
    clientEmail: account.client_email,
  }),
});

export const db = getFirestore();
