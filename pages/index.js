// website/pages/index.tsx
import { useEffect, useState } from "react";
import { useAccount, useActiveChain, useConnect, useDisconnect } from "graz";
import { useRouter } from "next/router";
import MetaMask from "./MetaMask";
export default function HomePage() {
  const { isConnected, data: account } = useAccount();
  const [lightColor, setLightColor] = useState("red");
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const activeChain = useActiveChain();

  // get window path
  const router = useRouter();
  const { id } = router.query;
  const idFromPath = router.asPath.split("/")[2];
  const walletAddress = account?.bech32Address;
  console.log("walletAddress from query: ", walletAddress);

  async function handleConnect() {
    if (isConnected) {
      disconnect();
      setLightColor("red"); // update the light color to red
    } else {
      connect();
      setLightColor("green"); // update the light color to green
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
            cosmoWalletAddress: account.bech32Address,
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
    // <Center minH="100vh">
    //   <Stack
    //     bgColor="whiteAlpha.100"
    //     boxShadow="md"
    //     maxW="md"
    //     p={4}
    //     rounded="md"
    //     spacing={4}
    //     w="full"
    //   >
    //     <HStack>
    //       <Tag>
    //         <TagLeftIcon
    //           as={Box}
    //           bgColor={isConnected ? "green.500" : "red.500"}
    //           boxSize={3}
    //           rounded="full"
    //         />
    //         <TagLabel>{isConnected ? "Connected" : "Disconnected"}</TagLabel>
    //       </Tag>
    //     </HStack>
    //     <Text>
    //       Active chain id: <b>{activeChain?.chainId}</b>
    //     </Text>
    //     <Text>
    //       Name: <b>{account?.name}</b>
    //     </Text>
    //     <Text noOfLines={1} wordBreak="break-all">
    //       Address: <b>{account?.bech32Address}</b>
    //     </Text>
    //     <HStack align="end" pt={4}>
    //       <Button onClick={handleConnect}>
    //         {isConnected ? null : "Connect Wallet"}
    //       </Button>
    //     </HStack>
    //   </Stack>
    //   <MetaMask />
    // </Center>
    <div className="App">
      <MetaMask />
      {/* <div className="wrapper">
            <label>
              Address: <b>{account?.bech32Address}</b>
            </label>
            <button className="cosmoButton" onClick={handleConnect}>
              {isConnected ? null : "Connect Wallet"}
            </button>
          </div> */}

      <div className="metamask">
        <div className="light" style={{ backgroundColor: lightColor }}></div>

        <div>
          <img
            className="keplarIcon"
            src="https://i.postimg.cc/yd7Z1ctT/n-Wwj-GAZN-400x400-removebg-preview.png"
            alt="metamask"
          />
        </div>

        {isConnected ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexDirection: "column",
            }}
          >
            <label>Wallet Address:</label>
            <p
              className="walletAddress"
              style={{ fontWeight: "normal", fontSize: "12px" }}
            >
              {account?.bech32Address}
            </p>
            <button className="metaButton" onClick={handleConnect}>
              {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
            </button>
          </div>
        ) : (
          <button className="metaButton" onClick={handleConnect}>
            {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
          </button>
        )}
      </div>
    </div>
  );
}
