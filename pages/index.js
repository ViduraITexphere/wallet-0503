// website/pages/index.tsx
import { useEffect } from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { useAccount, useActiveChain, useConnect, useDisconnect } from "graz";
import { useRouter } from "next/router";
export default function HomePage() {
  const { isConnected, data: account } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const activeChain = useActiveChain();

  // get window path
  const router = useRouter();
  const { id } = router.query;
  const idFromPath = router.asPath.split("/")[2];
  const walletAddress = account?.bech32Address;
  console.log("walletAddress from query: ", walletAddress);

  console.log("id from query: ", id);
  console.log("id from path: ", idFromPath);

  async function handleConnect() {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }

  useEffect(() => {
    async function saveId() {
      if (account) {
        const res = await fetch("/api/saveId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idFromPath,
            walletAddress: account.bech32Address,
          }),
        });
        if (!res.ok) {
          console.error("Error saving idFromPath:", res.statusText);
        }
      }
    }

    saveId();
  }, [account]);

  return (
    <Center minH="100vh">
      <Stack
        bgColor="whiteAlpha.100"
        boxShadow="md"
        maxW="md"
        p={4}
        rounded="md"
        spacing={4}
        w="full"
      >
        <HStack>
          <Tag>
            <TagLeftIcon
              as={Box}
              bgColor={isConnected ? "green.500" : "red.500"}
              boxSize={3}
              rounded="full"
            />
            <TagLabel>{isConnected ? "Connected" : "Disconnected"}</TagLabel>
          </Tag>
        </HStack>
        <Text>
          Active chain id: <b>{activeChain?.chainId}</b>
        </Text>
        <Text>
          Name: <b>{account?.name}</b>
        </Text>
        <Text noOfLines={1} wordBreak="break-all">
          Address: <b>{account?.bech32Address}</b>
        </Text>
        <HStack align="end" pt={4}>
          <Button onClick={handleConnect}>
            {isConnected ? "Disconnect" : "Connect Wallet"}
          </Button>
        </HStack>
      </Stack>
    </Center>
  );
}
