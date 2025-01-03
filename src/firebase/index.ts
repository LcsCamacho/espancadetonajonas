import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json";
import { credential } from "firebase-admin";

const account = {
  apiKey: "AIzaSyBQg-uaSFZtWuTQSOtUyV3gVWr9S8ptXgM",
  authDomain: "jonastraderia.firebaseapp.com",
  projectId: "jonastraderia",
  storageBucket: "jonastraderia.appspot.com",
  messagingSenderId: "704917550717",
  appId: "1:704917550717:web:02cfdb6212329d94d4a314",
  measurementId: "G-DMTBEKQ2EB",
  type: "service_account",
  project_id: "jonastraderia",
  private_key_id: "a4aaa559dbcd8c16f19d7713e407ea364143dc42",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCakpS+1HRoip2g\njt+KdCwOOmtEBsPfE3iM7+Xv2cVHB9YBGPbLVfrBsCOyY035Nq/BMX4X7NQ8RyaY\nvGinvcHktOHScISIzFdU6OJZ1DF5rvHcImVa3Zh9FBu5q0Gjnd2WOfY+8S74hdcI\nfFl7/iQnmgknfaP/Dp8Rkcb8tZE+XwEn4MkBpxu2dXG3/63TqQbnJDnrw5bxz3Y0\nrMyoHRO0wlQur3qnD2sPd8GZS4pL+TMoOxDgnh8JTnRe/NQdgzm0KDAAX+2IYc3k\nIOP+XS1hN0gU90WZevG+SSAOxp7UGkz1Ghd61TcME+NuNKXoPx1IHsXyu3dlrYHZ\nDK6sShZVAgMBAAECggEAGs+VBFqmjGGKwMg3ZvUKlTc11tlTjTR74vpTiFxeFxl5\nWbxiRle2BHWQY4dNBY6iQqDajbzS/VecDr8TahEEei6TwuQoYPAMr9orNMiVAlXB\ndtzydqXcJsnfmz9kxcQCpOWN3FIKQyo3561l+hdVXxcdQl/NG9cF6U6/VKMLu+UK\ni5pWQkKEhfEUgk0t1ysM3vBSpnyueHzoPQt3nlbk9ErtFZ9/POIhfxtdVKJfTZ5U\np80a1jCGtmafb/mhlR2W1FiiJx71NsyI/D+yoZZC9bN9xDOiKXcLSN4rlSbaDjDu\ntnaLRjLza0+ytp6AzD7eM2FfaVRb8fJWatqXVnmJywKBgQDU9KDbNbsNT6z1sIKT\nLrEvBctaIAZtmVSF65mgjil7/cRhvZLgot30IlhAciJ/8N6OURLQciYAE3nfnqO/\n1hf6TEKzBTKQOCie4xXOhaIA65yKf4miUep1MuUBr1xINCyYiTCq7oi7VUGyDiKD\n+Pa+CaTa//q4H6kBFpuAu/4JywKBgQC50O210fCnwTMywC9fNgYtNchneVRaT/Kh\nD1nCNC0aXMRU3atQ8Micz7bxp0NBaxcra0dnzTzn6TM/vB+1FHZ5rb5+h4KedX0q\nhwM/3vnV4XpeSNa+Sl0RIr11PNkfXr5hZDFcIvGLH5glaOqceToyWvw/Z/+92+3c\noID2Po7cXwKBgH/s6Ehm8ZPgfg0lWHsj/Go799mPDW1/Q2gjjKkHXWJPok34vKfX\nDrAehZdJOPJUds1VZJD1UWCQUpED0mhmKwdAEn1KLQK3yacQ0UO7wQL+ho4oaTyq\nKsb2qN0nQ69YMEX9e8/i9R5b69gTZ6aRw1+LmY25YhqDYln2A7oEtGmbAoGBAIxC\n94ytwpj+r2T5yUh3gUYTOQlSfqgFfUKyUbDUrc8eg10ETtM0TlqAOLpE5fG1orG1\nsxrZw8XTNEpB+TU5Ew1aZ1cfdyuhyC+X5o4KBFC8eSA+n0rY21OaA6VBnyuc2tyt\nQs0n22iHGtPyVFZ088cbAxnhqRxprS1DQtWd9zzFAoGASEyJyPLUCdrabDuSMaD3\n4sb9yKjjsOEpL8JPkZw6PZfiuifIiNZclDLnZRMo4Yk+VvdP3kXW52jkdCYA5mu6\nFA/GolozqF5Y/D4XR2gFecFMc+T1+5PbDAyv23Yv0nFUmvGFATTlvrun8iE5+j1u\nXRVpneHr7on+ndS7r1Hqbtk=\n-----END PRIVATE KEY-----\n",
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
