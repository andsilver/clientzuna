import { useContractRead } from "wagmi";
import erc20ABI from "../contracts/abis/erc20.json";

export default function useErc20ContractRead(address, functionName, args = []) {
  return useContractRead({
    address,
    abi: erc20ABI,
    functionName,
    args,
  });
}
