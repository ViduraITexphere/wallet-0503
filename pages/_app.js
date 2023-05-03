// website/pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { GrazProvider, mainnetChains } from "graz";

export default function CustomApp(props) {
  const { Component, pageProps } = props;
  return (
    <ChakraProvider>
      <GrazProvider
        grazOptions={{
          defaultChain: mainnetChains.cosmoshub,
        }}
      >
        <Component {...pageProps} />
      </GrazProvider>
    </ChakraProvider>
  );
}
