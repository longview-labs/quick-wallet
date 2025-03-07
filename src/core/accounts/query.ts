const query = `
  query (
    $hash: String!
  ) {
    transactions(
      first: 1
      tags: [{ name: "QuickWallet-User", values: [$hash] }]
    ) {
      ...MessageFields
      __typename
    }
  }
  fragment MessageFields on TransactionConnection {
    edges {
      cursor
      node {
        id
        recipient
        block {
          timestamp
          height
          __typename
        }
        ingested_at
        tags {
          name
          value
          __typename
        }
        data {
          size
          __typename
        }
        owner {
          address
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
`;

export const fetchEncryptedKeyfile = async (username_hash: string) => {
  const response = await fetch("https://arweave-search.goldsky.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { hash: username_hash }
    }),
  }).then((res) => res.json())

  const tx = response.data.transactions.edges[0].node;
  if (!tx) throw new Error("QuickWallet: User not found");

  const { id } = tx;
  const keyfile = await fetch(`https://arweave.net/${id}`).then((res) => res.text());
  return keyfile;
}