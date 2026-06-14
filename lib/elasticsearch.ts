import { Client } from "@elastic/elasticsearch";

const node = process.env.ELASTICSEARCH_URL;
const apiKey = process.env.ELASTICSEARCH_API_KEY;

export const PRODUCT_INDEX =
  process.env.ELASTICSEARCH_INDEX || "paustica-products";

export const elastic =
  node && apiKey
    ? new Client({
        node,
        auth: {
          apiKey,
        },
      })
    : null;