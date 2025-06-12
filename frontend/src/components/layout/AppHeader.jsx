import { Layout, Select, Space, Button, Modal, Drawer } from "antd";
import { useCrypto } from "../../context/crypto-context";
import { useEffect, useState } from "react";
import CoinInfoModal from "../CoinInfoModal";
import AddAssetForm from "../AddAssetForm";

const headerStyle = {
  width: "100%",
  textAlign: "center",
  height: 60,
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const options = [
  {
    label: "China",
    value: "china",
    emoji: "🇨🇳",
    desc: "China (中国)",
  },
  {
    label: "USA",
    value: "usa",
    emoji: "🇺🇸",
    desc: "USA (美国)",
  },
  {
    label: "Japan",
    value: "japan",
    emoji: "🇯🇵",
    desc: "Japan (日本)",
  },
  {
    label: "Korea",
    value: "korea",
    emoji: "🇰🇷",
    desc: "Korea (韩国)",
  },
];

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [coin, setCoin] = useState(null);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { crypto } = useCrypto();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const keypress = (event) => {
      if (event.key === "/") {
        setSelect((prev) => !prev);
      }
    };
    document.addEventListener("keypress", keypress);
    return () => document.removeEventListener("keypress", keypress);
  }, []);

  function handleSelect(value) {
    setCoin(crypto.find((c) => c.id === value));
    setModal(true);
  }

  return (
    <Layout.Header style={headerStyle}>
      <Select
        style={{ width: 250 }}
        onOpenChange={(select) => setSelect(select)}
        onSelect={handleSelect}
        onClick={() => setSelect((prev) => !prev)}
        value="press / to open"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        showSearch
        optionFilterProp="label"
        filterOption={(input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        }
        onSearch={(searchValue) => setSearchValue(searchValue)}
        optionRender={(option) => {
          const label = option.data.label;
          const lowerLabel = label.toLowerCase();
          const index = lowerLabel.indexOf(searchValue.toLowerCase());

          if (index === -1 || !searchValue) {
            return (
              <Space>
                <img
                  style={{ width: 20 }}
                  src={option.data.icon}
                  alt={option.data.label}
                />
                {label}
              </Space>
            );
          }

          const beforeStr = label.slice(0, index);
          const matchStr = label.slice(index, index + searchValue.length);
          const afterStr = label.slice(index + searchValue.length);

          return (
            <Space>
              <img
                style={{ width: 20 }}
                src={option.data.icon}
                alt={option.data.label}
              />
              <span>
                {beforeStr}
                <span style={{ backgroundColor: "yellow" }}>{matchStr}</span>
                {afterStr}
              </span>
            </Space>
          );
        }}
      />
      <Button type="primary" onClick={() => setDrawer(true)}>
        Add Asset Text
      </Button>

      <Modal open={modal} onCancel={() => setModal(false)} footer={null}>
        <CoinInfoModal coin={coin} />
      </Modal>

      <Drawer
        width={600}
        title="Add Asset"
        onClose={() => setDrawer(false)}
        open={drawer}
        destroyOnClose
      >
        <AddAssetForm onClose={() => setDrawer(false)} />
      </Drawer>
    </Layout.Header>
  );
}
