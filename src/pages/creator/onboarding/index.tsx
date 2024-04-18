import { FC } from "react";
import useQuery from "../../../hooks/useQuery";
import { useParams } from "react-router";

const Onboarding: FC = () => {
  const { creatorId } = useParams();
  const { token } = useQuery();
  return <div>Onboarding</div>;
};

export default Onboarding;
