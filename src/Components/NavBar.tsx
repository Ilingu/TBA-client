import { FC } from "react";

interface NavBarProps {
  address: string | undefined;
  NetworkName: string;
  ConnectedToNet: boolean;
}

const NavBar: FC<NavBarProps> = ({ address, NetworkName, ConnectedToNet }) => {
  return (
    <nav className="mx-4 flex h-[10%] justify-evenly">
      <div className="flex items-center justify-center">
        <button
          className="rounded-lg bg-yellow-500 p-2 font-bold text-black transition-all focus:ring-2 
          focus:ring-yellow-700"
        >
          👋 {`${address?.slice(0, 5)}...${address?.slice(38)}`}
        </button>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="rounded-lg bg-yellow-500 p-2 text-black  transition-all focus:ring-2 
          focus:ring-yellow-700"
        >
          Network: <span className="font-bold">{NetworkName}</span>
        </button>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="rounded-lg bg-yellow-500 p-2 font-bold text-black transition-all focus:ring-2 
          focus:ring-yellow-700"
        >
          Contract {ConnectedToNet ? "Connected" : "Not Connected"}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
