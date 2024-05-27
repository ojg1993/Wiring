import { Button } from "@mui/material";
import { useMembershipContext } from "../../context/MembeshiprContext";
import { useParams } from "react-router-dom";

const JoinServerButton = () => {
  const { serverId } = useParams();
  const { joinServer, leaveServer, isUserMember } = useMembershipContext();

  const handleJoinServer = async () => {
    try {
      await joinServer(Number(serverId));
      console.log("Joined server");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveServer = async () => {
    try {
      await leaveServer(Number(serverId));
      console.log("Left server");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isUserMember ? (
        <Button sx={{ color: "darkred" }} onClick={handleLeaveServer}>
          Leave Server
        </Button>
      ) : (
        <Button sx={{ color: "grey" }} onClick={handleJoinServer}>
          Join Server
        </Button>
      )}
    </>
  );
};

export default JoinServerButton;
