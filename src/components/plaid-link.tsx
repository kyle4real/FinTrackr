import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";

export type PlaidLinkProps = {
  children: React.ReactNode;
  token: string;
  onSuccess: PlaidLinkOnSuccess;
};

export function PlaidLinkButton(props: PlaidLinkProps) {
  const { open, ready } = usePlaidLink({
    token: props.token,
    onSuccess: props.onSuccess,
  });

  return (
    <button onClick={() => open()} className="cursor-pointer" disabled={!ready}>
      {props.children}
    </button>
  );
}
