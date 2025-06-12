import { useEffect, useState, createContext, useContext } from "react";
import { fakeFetchCrypto, fetchAssets } from "../api";
import { percentDifference } from "../utils";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
});

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState(() => {
    const savedAssets = localStorage.getItem("assets");
    return savedAssets ? JSON.parse(savedAssets) : [];
  });

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  function mapAssets(assets, result) {
    return assets.map((asset) => {
      const coin = result.find((c) => c.id === asset.id);
      return {
        grow: asset.price < coin.price,
        growPercent: percentDifference(asset.price, coin.price),
        totalAmount: asset.amount * coin.price,
        totalProfit: asset.amount * coin.price - asset.amount * asset.price,
        name: coin.name,
        ...asset,
      };
    });
  }

  function mergeAssets(savedAssets, apiAssets) {
    const apiAssetsDict = apiAssets.reduce((acc, asset) => {
      acc[asset.id] = asset;
      return acc;
    }, {});

    const combined = [];

    savedAssets.forEach((saved) => {
      if (apiAssetsDict[saved.id]) {
        combined.push({ ...apiAssetsDict[saved.id], ...saved });
        delete apiAssetsDict[saved.id];
      } else {
        combined.push(saved);
      }
    });

    Object.values(apiAssetsDict).forEach((asset) => combined.push(asset));

    return combined;
  }

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const { result } = await fakeFetchCrypto();
      const apiAssets = await fetchAssets();

      const savedAssets = localStorage.getItem("assets");
      const parsedSavedAssets = savedAssets ? JSON.parse(savedAssets) : [];

      const combinedAssets = mergeAssets(parsedSavedAssets, apiAssets);
      setAssets(mapAssets(combinedAssets, result));

      setCrypto(result);
      setLoading(false);
    }
    preload();
  }, []);

  async function addAsset(newAsset) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          setAssets((prev) => mapAssets([...prev, newAsset], crypto));
          resolve();
        } else {
          reject(new Error("Amount cannot exceed 1000"));
        }
      }, 1000);
    });
  }

  return (
    <CryptoContext.Provider
      value={{ loading, crypto, assets, setAssets, addAsset }}
    >
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
