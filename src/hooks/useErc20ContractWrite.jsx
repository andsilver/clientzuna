import { useContractWrite, usePrepareContractWrite } from "wagmi";
import erc20ABI from "../contracts/abis/erc20.json";

export default function useErc20ContractWrite({ address, functionName }) {
  const { config } = usePrepareContractWrite({
    address,
    abi: erc20ABI,
    functionName,
  });
  return useContractWrite(config);
}
