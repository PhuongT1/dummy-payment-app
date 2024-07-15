import { useTransactionDetailsViaPspQuery } from "@/generated/graphql";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const TransactionsPage = () => {
  const router = useRouter();
  const [pspReference, setPspReference] = React.useState<string>("");

  const [{ data, error }, fetchTransactions] = useTransactionDetailsViaPspQuery({
    variables: {
      pspReference,
    },
    pause: true,
  });

  useEffect(() => {
    if (data) {
      const transaction = data?.orders?.edges[0]?.node?.transactions.find((transaction) => {
        return transaction?.pspReference === pspReference;
      });
      if (transaction) {
        router.push(`/app/transactions/${transaction.id}`);
      }
    }
  }, [data]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      justifyContent="flex-start"
      alignItems="center"
      gap={4}
      marginTop={4}
    >
      <Text size={7}>Here you can create events for any transaction made using this app.</Text>
      <Box>
        <Text>Please paste PSP Reference of the transaction you want to create events for.</Text>
        <Input value={pspReference} onChange={(event) => setPspReference(event.target.value)} />
      </Box>
      <Box display="flex" gap={2}>
        <Button variant="secondary" onClick={() => setPspReference("")}>
          Clear
        </Button>
        <Button
          onClick={() => fetchTransactions()}
          disabled={!pspReference}
          variant={error ? "error" : "primary"}
        >
          Go to transaction
        </Button>
      </Box>
      {error && <Text color="critical1">Invalid PSP Reference</Text>}
    </Box>
  );
};

export default TransactionsPage;
