import { Client } from "@elastic/elasticsearch";

const node = process.env.ELASTICSEARCH_URL;
const apiKey = process.env.ELASTICSEARCH_API_KEY;

if (!node) {
  throw new Error("Missing ELASTICSEARCH_URL");
}

if (!apiKey) {
  throw new Error("Missing ELASTICSEARCH_API_KEY");
}

export const elastic = new Client({
  node,
  auth: {
    apiKey,
  },
});

export const PRODUCT_INDEX =
  process.env.ELASTICSEARCH_INDEX || "paustica-products";