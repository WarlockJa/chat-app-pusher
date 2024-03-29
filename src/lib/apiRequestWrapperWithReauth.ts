import generateSignature from "@/util/crypto/aes-cbc/generateSignature";

interface IApiRequestWrapperWithReauthProps {
  api: string;
  args?: any;
  callback?: (fetchResult: any) => void;
  accessToken: IAccessToken;
}

export default async function apiRequestWrapperWithReauth({
  api,
  args,
  callback,
  accessToken,
}: IApiRequestWrapperWithReauthProps) {
  const response = await fetch(api, args).catch((error) => {
    throw new Error(error);
  });

  // authentication required. Reauthenticating and refetching request
  if (response.status === 401) {
    await fetch("/api/v1/auth", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        // API endpoints protection
        "pusher-chat-signature": generateSignature({
          key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        }),
      },
      body: JSON.stringify({
        user_id: accessToken.user_id,
        user_admin: accessToken.user_admin,
      }),
    });
    fetch(api, args)
      .then((response) => response.json())
      .then((result) => callback && callback(result));
  } else if (response.status === 200) {
    const result = await response.json();
    callback && callback(result);
  } else {
    console.log(response);
    throw new Error(JSON.stringify(response));
  }
}
