"use client";

import { linkInstitution } from "@/lib/actions/user";
import { useCallback } from "react";
import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import { Button } from "./ui/button";
import { toast } from "sonner";

export type PlaidLinkProps = {
  children: React.ReactNode;
  token: string | null;
  userId: string;
  onComplete?: () => Promise<void>;
};

export function PlaidLinkButton(props: PlaidLinkProps) {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata) => {
      const res = await linkInstitution(publicToken, metadata, props.userId);

      if (res.error) {
        if (res.severity === "warning") {
          toast.warning(res.error);
        } else if (res.severity === "error") {
          toast.error(res.error);
        }

        return;
      }

      if (props.onComplete) {
        props.onComplete();
      }
      toast.success("Institution linked successfully");
    },
    [props]
  );

  const { open, ready } = usePlaidLink({
    token: props.token,
    onSuccess: onSuccess,
  });

  return (
    <Button
      onClick={() => open()}
      className="not-disabled:cursor-pointer disabled:cursor-not-allowed"
      disabled={!ready}
    >
      {props.children}
    </Button>
  );
}
