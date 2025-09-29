import { Account, Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID);

const account = new Account(client);
const database = new Databases(client);

export { account, client, database };
export { ID } from "appwrite";
