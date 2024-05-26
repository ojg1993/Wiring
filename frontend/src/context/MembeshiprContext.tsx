import { createContext, useContext } from "react";
import useMembership from "../services/membershipService";

interface IuseServer {
  joinServer: (serverId: number) => Promise<void>;
  leaveServer: (serverId: number) => Promise<void>;
  isMember: (serverId: number) => Promise<boolean>;
  isUserMember: boolean;
  isLoading: boolean;
  error: Error | null;
}

const MembershipContext = createContext<IuseServer | null>(null);

export function MembershipProvider(props: React.PropsWithChildren) {
  const membership = useMembership();
  return (
    <MembershipContext.Provider value={membership}>
      {props.children}
    </MembershipContext.Provider>
  );
}

export function useMembershipContext(): IuseServer {
  const context = useContext(MembershipContext);
  if (context == null) {
    throw new Error(
      "useMembershipContext must be used within a MembershipProvider"
    );
  }
  return context;
}

export default MembershipProvider;
